import { fullProductSheetModel } from "@mongoose/model";
import { fullProductSheetSchema } from "@schemas/fullProductSheet";
import { hasOrganizationRoleByOrganizationId } from "@security/hasOrganizationRole/byOrganizationId";

/* METHOD : GET, PATH : /organization/{organizationId}/full-product-sheets */
export const GET = (method: Methods, path: string) => 
	hasOrganizationRoleByOrganizationId({
		options: { organizationRole: "STORE_KEEPER" },
		pickup: ["organization"],
	})
		.declareRoute(method, path)
		.extract({
			query: {
				page: zod.coerce.number().default(0),
				ref: zod.string().optional(),
			}
		})
		.handler(
			async ({ pickup }) => {
				const page = pickup("page");
				const ref = pickup("ref");
				const organization = pickup("organization");

				const fullProductSheets = await fullProductSheetModel.aggregate([
					{ $match: { "organization.id": organization.id } },
					...(
						ref
							? [{ $match: { ref: { $regex: new RegExp(ref, "i") } } }]
							: []
					),
					{ $skip: MetConfig.productSheet.full.organizationLimit * page },
					{ $limit: MetConfig.productSheet.full.organizationLimit },
				]);

				throw new OkHttpException("organization.fullProductSheet", fullProductSheets);
			},
			new IHaveSentThis(OkHttpException.code, "organization.fullProductSheet", fullProductSheetSchema.array()),
		);
