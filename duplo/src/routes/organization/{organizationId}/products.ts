import { hasOrganizationRoleByOrganizationId } from "@security/hasOrganizationRole/byOrganizationId";
import { productSchema, productStatusTuple } from "@schemas/product";
import { productEntityformater, productSelect } from "@utils/prisma/product";

/* METHOD : GET, PATH : /organization/{organizationId}/products */
export const GET = (method: Methods, path: string) =>
	hasOrganizationRoleByOrganizationId({ 
		options: { organizationRole: "STORE_KEEPER" }, 
		pickup: ["organization"] 
	})
		.declareRoute(method, path)
		.extract({
			query: {
				page: zod.coerce.number().default(0),
				sku: zod.string().optional(),
				productSheetId: zod.string().optional(),
				status: zod.enum(productStatusTuple).optional(),
			}
		})
		.handler(
			async ({ pickup }) => {
				const { id: organizationId } = pickup("organization");
				const page = pickup("page");
				const sku = pickup("sku");
				const productSheetId = pickup("productSheetId");
				const status = pickup("status");
				
				const products = await prisma.product.findMany({
					where: {
						organizationId,
						sku: sku
							? {
								contains: sku,
								mode: "insensitive"
							}
							: undefined,
						productSheetId,
						status,
					},
					take: 10,
					skip: page * 10,
					select: productSelect,
					orderBy: {
						createdAt: "desc",
					}
				}).then(
					productEntitys => productEntitys.map(productEntityformater)
				);
				
				throw new OkHttpException("products.found", products);
			},
			new IHaveSentThis(OkHttpException.code, "products.found", productSchema.array())
		);
