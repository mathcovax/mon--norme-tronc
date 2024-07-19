import { hasOrganizationRoleByOrganizationId } from "@security/hasOrganizationRole/byOrganizationId";
import { gridStatCommandSchema } from "@schemas/gridStatCommand";

/* METHOD : PUT, PATH : /organization/{organizationId}/grid */
export const PUT = (method: Methods, path: string) => 
	hasOrganizationRoleByOrganizationId({
		options: { organizationRole: "OWNER" },
		pickup: ["organization"]
	})
		.declareRoute(method, path)
		.extract({
			body: gridStatCommandSchema,
		})
		.handler(
			async ({ pickup }) => {

				const { id: organizationId } = pickup("organization");
				const grid = pickup("body");

				await prisma.organization.update({
					where: {
						id: organizationId,
					},
					data: {
						grid: JSON.stringify(grid),
					},
				});

				throw new NoContentHttpException("gridStatCommand.udpated");
			},
			new IHaveSentThis(NoContentHttpException.code, "gridStatCommand.updated")
		);

/* METHOD : GET, PATH : /organization/{organizationId}/grid */
export const GET = (method: Methods, path: string) =>
	hasOrganizationRoleByOrganizationId({
		options: { organizationRole: "OWNER" },
		pickup: ["organization"]
	})
		.declareRoute(method, path)
		.handler(
			async ({ pickup }) => {
				const { grid } = pickup("organization");

				throw new OkHttpException("gridStatCommand.found", JSON.parse(grid || "[]"));
			},
			new IHaveSentThis(OkHttpException.code, "gridStatCommand.found", gridStatCommandSchema)
		);
