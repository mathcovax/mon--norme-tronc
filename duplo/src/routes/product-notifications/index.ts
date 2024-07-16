import { categoryExistCheck } from "@checkers/category";
import { inputNotification, notificationExistCheck } from "@checkers/notification";
import { inputProductSheet, productSheetExistCheck } from "@checkers/productSheet";
import { notificationSchema, notificationTypeEnum } from "@schemas/userNotification";
import { mustBeConnected } from "@security/mustBeConnected";

/* METHOD : POST, PATH : /product-notifications */
export const POST = (method: Methods, path: string) =>
	mustBeConnected({ pickup: ["accessTokenContent"] })
		.declareRoute(method, path)
		.extract({
			body: zod.union([
				zod.object({
					productSheetId: zod.string(),
					type: zod.enum([notificationTypeEnum.PRODUCT_PROMOTION, notificationTypeEnum.PRODUCT_RESTOCK])
				}).strip(),
				zod.object({
					categoryName: zod.string(),
					type: zod.literal(notificationTypeEnum.NEW_PRODUCT_IN_CATEGORY)
				}).strip()
			])
		})
		.cut(
			({ pickup }) => {
				const body = pickup("body");

				if (body.type === notificationTypeEnum.PRODUCT_PROMOTION ||
					body.type === notificationTypeEnum.PRODUCT_RESTOCK) {
					return {
						productNotification: body
					};
				} else if (body.type === notificationTypeEnum.NEW_PRODUCT_IN_CATEGORY) {
					return {
						categoryNotification: body
					};
				} else {
					return {};
				}
			},
			["productNotification", "categoryNotification"]
		)
		.check(
			categoryExistCheck,
			{
				input: p => p("categoryNotification")?.categoryName ?? "",
				...categoryExistCheck.preCompletions.mustExist,
				skip: p => p("categoryNotification") == undefined,
			},
			new IHaveSentThis(NotFoundHttpException.code, "category.notfound")
		)
		.check(
			productSheetExistCheck,
			{
				input: (p) => inputProductSheet.id(p("productNotification")?.productSheetId ?? ""),
				...productSheetExistCheck.preCompletions.mustExist,
				skip: p => p("productNotification") == undefined,
			},
			new IHaveSentThis(NotFoundHttpException.code, "productSheet.notfound")
		)
		.check(
			notificationExistCheck,
			{
				input: (p) => inputNotification.notification({ ...p("body"), userId: p("accessTokenContent").id }),
				result: "notification.notfound",
				catch: () => {
					throw new ConflictHttpException("notification.alreadySubscribed");
				},
			},
			new IHaveSentThis(ConflictHttpException.code, "notification.alreadySubscribed")
		)
		.handler(
			async ({ pickup }) => {
				const body = pickup("body");
				const { id: userId } = pickup("accessTokenContent");

				const notification = await prisma.subscribeProductNotifications.create({
					data: {
						...body,
						userId
					}
				});

				throw new CreatedHttpException("notification.created", notification);

			},
			new IHaveSentThis(CreatedHttpException.code, "notification.created", notificationSchema)
		);

/* METHOD : GET, PATH : /product-notifications */
export const GET = (method: Methods, path: string) =>
	mustBeConnected({ pickup: ["accessTokenContent"] })
		.declareRoute(method, path)
		.extract({
			query: {
				productSheetId: zod.string().optional(),
				categoryName: zod.string().optional(),
			}
		})
		.cut(
			async ({ pickup }) => {
				const productSheetId = pickup("productSheetId");
				const categoryName = pickup("categoryName");

				if (!productSheetId && !categoryName) {
					throw new BadRequestHttpException("notification.invalidQuery");
				}

				return {};
			},
			[],
			new IHaveSentThis(BadRequestHttpException.code, "notification.invalidQuery")
		)
		.cut(
			async ({ pickup }) => {
				const { id: userId } = pickup("accessTokenContent");
				const productSheetId = pickup("productSheetId");
				const categoryName = pickup("categoryName");

				const notifications = await prisma.subscribeProductNotifications.findMany({
					where: {
						productSheetId,
						categoryName,
						userId
					}
				});

				return {
					notifications
				};
			},
			["notifications"],
		)
		.handler(
			async ({ pickup }) => {
				const notifications = pickup("notifications");

				throw new OkHttpException("notifications", notifications);
			},
			new IHaveSentThis(OkHttpException.code, "notifications", notificationSchema.array())
		);
