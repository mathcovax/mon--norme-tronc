import { facetExistCheck } from "@checkers/facet";
import { facetSchema, facetTypeSchema, facetTypeTuple } from "@schemas/facet";
import { hasOrganizationRoleByProductSheetId } from "@security/hasOrganizationRole/byProductSheetId";

/* METHOD : POST, PATH : /product-sheets/{productSheetId}/facets */
export const POST = (method: Methods, path: string) => 
	hasOrganizationRoleByProductSheetId({ pickup: ["productSheet"] })
		.declareRoute(method, path)
		.extract({
			body: zod.object({
				type: facetTypeSchema,
				value: zod.string().min(2).max(50),
			}).strip()
		})
		.check(
			facetExistCheck,
			{
				input: p => ({ type: p("body").type, productSheetId: p("productSheet").id }),
				result: "facet.notfound",
				catch: () => {
					throw new ConflictHttpException("productSheet.facet.alreadyExist");
				}
			},
			new IHaveSentThis(ConflictHttpException.code, "productSheet.facet.alreadyExist")
		)
		.handler(
			async ({ pickup }) => {
				const { type, value } = pickup("body");
				const { id: productSheetId } = pickup("productSheet");

				const facet = await prisma.facet.create({
					data: {
						type,
						productSheetId,
						value,
					}
				});

				throw new CreatedHttpException("facet.created", facet);
			},
			new IHaveSentThis(CreatedHttpException.code, "facet.created", facetSchema)
		);

/* METHOD : GET, PATH : /product-sheets/{productSheetId}/facets */
export const GET = (method: Methods, path: string) => 
	hasOrganizationRoleByProductSheetId({ pickup: ["productSheet"] })
		.declareRoute(method, path)
		.handler(
			async ({ pickup }) => {
				const { id: productSheetId } = pickup("productSheet"); 

				const facets = await prisma.facet.findMany({
					where: {
						productSheetId
					},
					take: facetTypeTuple.length
				});

				throw new OkHttpException("productSheet.facets", facets);
			},
			new IHaveSentThis(OkHttpException.code, "productSheet.facets", facetSchema.array())
		);
