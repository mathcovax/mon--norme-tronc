import { organizationHasUserCheck } from "@checkers/organization";
import { inputUser, userExistCheck } from "@checkers/user";
import { organizationRolesEnum, organizationUserSchema } from "@schemas/organization";
import { hasOrganizationRoleByOrganizationId } from "@security/hasOrganizationRole/byOrganizationId";
import { mustBeConnected } from "@security/mustBeConnected";

/* METHOD : POST, PATH : /organization/{organizationId}/user */
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
		
/* METHOD : GET, PATH : /organization/{organizationId}/user */
export const GET = (method: Methods, path: string) =>
	mustBeConnected({ pickup: ["user"] })
		.declareRoute(method, path)
		.extract({
			params: {
				organizationId: zod.string(),
			}
		})
		.check(
			organizationHasUserCheck,
			{
				input: p => ({ organizationId: p("organizationId"), userId: p("user").id }),
				...organizationHasUserCheck.preCompletions.mustHaveUser,
				result: "organization.hasUserWithMoreData",
				options: { selectUser: true }
			},
			new IHaveSentThis(NotAcceptableHttpException.code, "organization.hasNotUser")
		)
		.handler(
			async ({ pickup }) => {
				const { organizationRole, user: { id, email, lastname, firstname } } = pickup("userToOrganization");
				
				const organisationUser = {
					id,
					email,
					lastname,
					firstname,
					organizationRole,
				};

				throw new OkHttpException("organization.user", organisationUser);
			}, 
			new IHaveSentThis(OkHttpException.code, "organization.user", organizationUserSchema)
		);
