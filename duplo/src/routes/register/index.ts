import { baseTemplate } from "@/templates";
import { welcomeTemplate } from "@/templates/welcome";
import { addressValidCheck } from "@checkers/address";
import { firebaseTokenCheck } from "@checkers/token";
import { inputUser, userExistCheck } from "@checkers/user";
import { Mail } from "@services/mail";
import { AccessToken } from "@services/token";

/* METHOD : POST, PATH : /register */
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

			const { id, primordialRole } = await prisma.user.create({
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
					primordialRole: true
				}
			});

			const registerTemplate = welcomeTemplate(firstname, ENV.ORIGIN);
			const html = baseTemplate(registerTemplate);
			Mail.send(email, "Bienvenue chez MET", html);

			const accessToken = AccessToken.generate({ id, email, primordialRole });

			throw new CreatedHttpException("user.registered", accessToken);
		},
		new IHaveSentThis(CreatedHttpException.code, "user.registered", zod.string())
	);
