import { duploTesting } from "@test/setup";
import { MockPrisma } from "@test/mocks/providers";
import { inputNotification, notificationExistCheck } from "./notification";

describe("notification checker", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	it("find by id", async () => {
		const notification = {};
		const spy = vi.fn(async () => notification);
		MockPrisma.set("subscribeProductNotifications", "findFirst", spy);

		const res = await duploTesting
			.testChecker(notificationExistCheck, inputNotification.notificationId({ id: 1234, userId: "1234" }));

		expect(spy).lastCalledWith({
			where: { id: 1234, userId: "1234" }
		});
		expect(res.info).toBe("notification.exist");
	});

	it("find by notification", async () => {
		const notification = {};
		const spy = vi.fn(async () => notification);
		MockPrisma.set("subscribeProductNotifications", "findFirst", spy);

		const res = await duploTesting
			.testChecker(notificationExistCheck, inputNotification.notification({
				type: "PRODUCT_PROMOTION",
				productSheetId: "1234",
				userId: "1234"
			}));

		expect(spy).lastCalledWith({
			where: {
				type: "PRODUCT_PROMOTION",
				productSheetId: "1234",
				userId: "1234"
			}
		});
		expect(res.info).toBe("notification.exist");
	});

	it("notfound", async () => {
		MockPrisma.set("subscribeProductNotifications", "findFirst", () => null);
		const res = await duploTesting
			.testChecker(notificationExistCheck, inputNotification.notificationId({ id: 143535, userId: "1234" }));

		expect(res.info).toBe("notification.notfound");
	});
});
