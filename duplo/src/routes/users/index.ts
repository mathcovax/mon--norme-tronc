import { welcomeTemplate } from "@/templates/welcome";
import { addressValidCheck } from "@checkers/address";
import { firebaseTokenCheck } from "@checkers/token";
import { inputUser, userExistCheck } from "@checkers/user";
import { primordialRolesTuple, userSchema } from "@schemas/user";
import { hasPrimordialRole } from "@security/hasPrimordialRole";
import { Mail } from "@services/mail";
import { AccessToken } from "@services/token";
import { zodToArray } from "@utils/zod";

/* METHOD : GET, PATH : /users */
export const GET = (method: Methods, path: string) => hasPrimordialRole({ options: { primordialRole: "ADMIN" } })
	.declareRoute(method, path)
	.extract({
		query: {
			page: zod.coerce.number().default(0),
			email: zod.string().optional(),
			primordialRole: zodToArray(zod.enum(primordialRolesTuple)).optional()
		}
	})
	.handler(
		async ({ pickup }) => {
			const page = pickup("page");
			const searchEmail = pickup("email");
			const primordialRole = pickup("primordialRole");

			const users = await prisma.user.findMany({
				where: {
					email: searchEmail
						? {
							contains: searchEmail,
							mode: "insensitive",
						}
						: undefined,
					AND: {
						OR: primordialRole?.map(pr => ({
							primordialRole: pr
						}))
					}
				},
				take: 10,
				skip: page * 10
			});

			throw new OkHttpException("users", users);
		},
		new IHaveSentThis(OkHttpException.code, "users", userSchema.array())
	);

/* METHOD : POST, PATH : /users */
export const POST = (method: Methods, path: string) => duplo
	.declareRoute(method, path)
	.extract({
		body: zod.object({
			fireBaseIdToken: zod.string(),
			lastname: zod.string().max(32).toUpperCase(),
			firstname: zod.string().max(36).toLowerCase(),
			address: zod.string().max(400),
			dateOfBirth: zod.coerce.date(),
			emailNotifcationsNewsletter: zod.boolean(),
		}).strip(),
	})
	.check(
		firebaseTokenCheck,
		{
			input: p => p("body").fireBaseIdToken,
			...firebaseTokenCheck.preCompletions.mustBeValid
		},
		new IHaveSentThis(UnauthorizedHttpException.code, "firebase.token.invalid")
	)
	.check(
		userExistCheck,
		{
			input: p => inputUser.email(
				p("idTokenContent").email
			),
			result: "user.notfound",
			catch: () => {
				throw new ConflictHttpException("user.alreadyExist");
			}
		},
		new IHaveSentThis(ConflictHttpException.code, "user.alreadyExist")
	)
	.check(
		addressValidCheck,
		{
			input: p => p("body").address,
			result: "address.valid",
			catch: () => {
				throw new BadRequestHttpException("user.address.invalid");
			}
		},
		new IHaveSentThis(BadRequestHttpException.code, "user.address.invalid")
	)
	.cut(
		({ pickup }) => {
			const userDateOfBirth = pickup("body").dateOfBirth;
			const timestamp18year = 568036800000;
			
			if (Date.now() - userDateOfBirth.getTime() < timestamp18year) {
				throw new BadRequestHttpException("user.dateOfBirth.invalid");
			}

			return {};
		},
		[],
		new IHaveSentThis(BadRequestHttpException.code, "user.dateOfBirth.invalid")
	)
	.handler(
		async ({ pickup }) => {
			const { email } = pickup("idTokenContent");
			const { lastname, firstname, address, dateOfBirth, emailNotifcationsNewsletter } = pickup("body");

			const { id, updatedAt } = await prisma.user.create({
				data: {
					email,
					lastname,
					firstname,
					address,
					dateOfBirth: new Date(
						dateOfBirth.getFullYear(), 
						dateOfBirth.getMonth(), 
						dateOfBirth.getDate()
					),
					emailNotifcationsNewsletter
				},
				select: {
					id: true,
					updatedAt: true
				}
			});

			Mail.send(
				email,
				"Bienvenue chez MET",
				welcomeTemplate(
					firstname,
					ENV.ORIGIN
				)
			);

			const accessToken = AccessToken.generate({ id, lastUpdateUser: updatedAt.getTime() });

			throw new CreatedHttpException("user.registered", accessToken);
		},
		new IHaveSentThis(CreatedHttpException.code, "user.registered", zod.string())
	);
