import { productExistCheck } from "@checkers/product";
import { productReturnSchema } from "@schemas/productReturn";
import { hasOrganizationRoleByOrganizationId } from "@security/hasOrganizationRole/byOrganizationId";

/* METHOD : GET, PATH : /organization/{organizationId}/product-returns */
export const GET = (method: Methods, path: string) => 
	hasOrganizationRoleByOrganizationId({
		options: { organizationRole: "STORE_KEEPER" },
		pickup: ["organization"]
	})
		.declareRoute(method, path)
		.extract({
			query: {
				sku: zod.string().optional(),
				page: zod.coerce.number().default(0),
			}
		})
		.handler(
			async ({ pickup }) => {
				const sku = pickup("sku");
				const page = pickup("page");
				const organisation = pickup("organization");
				
				const productReturns = await prisma.product_return.findMany({
					where: {
						organizationId: organisation.id,
						productSku: sku
							? { contains: sku }
							: undefined
					},
					take: MetConfig.productReturn.productReturnLimit,
					skip: MetConfig.productReturn.productReturnLimit * page,
				});

				throw new OkHttpException("productReturns", productReturns);
			},
			new IHaveSentThis(OkHttpException.code, "productReturns", productReturnSchema.array())
		);

/* METHOD : POST, PATH : /organization/{organizationId}/product-returns */
export const POST = (method: Methods, path: string) => 
	hasOrganizationRoleByOrganizationId({
		options: { organizationRole: "STORE_KEEPER" },
		pickup: ["organization"]
	})
		.declareRoute(method, path)
		.extract({
			body: zod.object({
				sku: zod.string(),
				reason: zod.string().max(255),
			}).strip()
		})
		.check(
			productExistCheck,
			{
				input: p => p("body").sku,
				...productExistCheck.preCompletions.mustExist,
			},
			new IHaveSentThis(NotFoundHttpException.code, "product.notfound")
		)
		.cut(
			({ pickup }) => {
				const product = pickup("product");
				
				if (product.status !== "SOLD") {
					throw new NotAcceptableHttpException("product.wrong.status");
				}

				return {};
			},
			[],
			new IHaveSentThis(NotAcceptableHttpException.code, "product.wrong.status")
		)
		.cut(
			async ({ pickup }) => {
				const product = pickup("product");
				
				const productReturn = await prisma.product_return.findFirst({
					where: {
						productSku: product.sku,
					}
				});
				
				if (productReturn) {
					throw new ConflictHttpException("product.alreadyInRefundProcess");
				}

				return {};
			},
			[],
			new IHaveSentThis(ConflictHttpException.code, "product.alreadyInRefundProcess")
		)
		.handler(
			async ({ pickup }) => {
				const product = pickup("product"); 
				const organization = pickup("organization");
				const { reason } = pickup("body");
				
				const productReturn = await prisma.product_return.create({
					data: {
						productSku: product.sku,
						organizationId: organization.id,
						reason,
					}
				});

				throw new CreatedHttpException("productReturn.created", productReturn);
			},
			new IHaveSentThis(CreatedHttpException.code, "productReturn.created", productReturnSchema)
		);
