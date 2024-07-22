import { facetSchema } from "@schemas/facet";
import { hasOrganizationRoleByOrganizationId } from "@security/hasOrganizationRole/byOrganizationId";

/* METHOD : GET, PATH : /organization/{organizationId}/facets */
export const GET = (method: Methods, path: string) => 
	hasOrganizationRoleByOrganizationId({
		options: { organizationRole: "BELONG_TO" },
		pickup: ["organization"]
	})
		.declareRoute(method, path)
		.extract({
			query: {
				page: zod.coerce.number().default(0),
				facetValue: zod.string().optional(),
			}
		})
		.handler(
			async ({ pickup }) => {
				const { id: organizationId } = pickup("organization");
				const page = pickup("page");
				const facetValue = pickup("facetValue");

				const facets = await prisma.product_sheet.findMany({
					where: {
						organizationId: organizationId,
						facets: {
							some: {
								value: facetValue ? {
									contains: facetValue,
									mode: "default"
								} : undefined
							}
						}
					},
					select: {
						facets: true
					},
					take: 2,
					skip: page * 2
				});

				throw new OkHttpException("productSheet.facets", facets.map(facet => facet.facets).flat());
			},
			new IHaveSentThis(OkHttpException.code, "productSheet.facets", facetSchema.array())
		);
