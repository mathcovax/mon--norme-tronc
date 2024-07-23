import { organizationHasUserCheck } from "@checkers/organization";
import { inputUser, userExistCheck } from "@checkers/user";
import { organizationRolesEnum, organizationUserSchema } from "@schemas/organization";
import { hasOrganizationRoleByOrganizationId } from "@security/hasOrganizationRole/byOrganizationId";

/* METHOD : POST, PATH : /organizations/{organizationId}/users */
export const POST = (method: Methods, path: string) =>
	hasOrganizationRoleByOrganizationId({ pickup: ["organization"] })
		.declareRoute(method, path)
		.extract({
			body: zod.object({
				email: zod.string().toLowerCase(),
				firstname: zod.string().toLowerCase(),
				lastname: zod.string().toUpperCase(),
				organizationRole: zod.enum([
					organizationRolesEnum.STORE_KEEPER,
					organizationRolesEnum.PRODUCT_SHEET_MANAGER,
					organizationRolesEnum.ACCOUNTANT,
				]),
			}).strip()
		})
		.check(
			userExistCheck,
			{
				input: p => inputUser.EFL({
					email: p("body").email,
					firstname: p("body").firstname,
					lastname: p("body").lastname,
				}),
				...userExistCheck.preCompletions.mustExist
			},
			new IHaveSentThis(NotFoundHttpException.code, "user.notfound")
		)
		.check(
			organizationHasUserCheck,
			{
				input: p => ({ organizationId: p("organization").id, userId: p("user").id }),
				result: "organization.hasNotUser",
				catch: () => {
					throw new ConflictHttpException("organization.hasAlreadyUser");
				}
			},
			new IHaveSentThis(ConflictHttpException.code, "organization.hasAlreadyUser")
		)
		.handler(
			async ({ pickup }) => {
				const { id: organizationId } = pickup("organization");
				const { organizationRole } = pickup("body");
				const { id: userId } = pickup("user");

				await prisma.user_to_organization.create({
					data: {
						organizationId,
						userId,
						organizationRole,
					}
				});

				throw new CreatedHttpException("organization.user.add");
			},
			new IHaveSentThis(CreatedHttpException.code, "organization.user.add")
		);

/* METHOD : GET, PATH : /organizations/{organizationId}/users */
export const GET = (method: Methods, path: string) => 
	hasOrganizationRoleByOrganizationId({ pickup: ["organization"] })
		.declareRoute(method, path)
		.extract({
			query: {
				page: zod.coerce.number().default(0),
				email: zod.coerce.string().optional(),
			}
		})
		.handler(
			async ({ pickup }) => {
				const { id: organizationId } = pickup("organization");
				const page = pickup("page");
				const email = pickup("email");

				const users = await prisma.user_to_organization.findMany({
					where: {
						organizationId,
						user: email 
							? {
								email: {
									contains: email,
									mode: "insensitive",
								}
							}
							: undefined
					},
					select: {
						organizationRole: true,
						user: true
					},
					take: 10,
					skip: page * 10,
				}).then(
					userToOrganizationCollection => userToOrganizationCollection.map(
						v => ({ 
							id: v.user.id, 
							email: v.user.email,
							firstname: v.user.firstname,
							lastname: v.user.lastname,
							organizationRole: v.organizationRole 
						})
					)
				);

				throw new OkHttpException("organization.users", users);
			},
			new IHaveSentThis(OkHttpException.code, "organization.users", organizationUserSchema.array())
		);
