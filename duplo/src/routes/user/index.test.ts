import { duploTesting } from "@test/setup";
import { GET, PATCH } from ".";
import { MockPrisma } from "@test/mocks/providers";
import { userData } from "@test/data/user";

describe("/user", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	describe("GET", () => {
		it("get user notfound", async () => {
			const res = await duploTesting
				.testRoute(GET("GET", ""))
				.setDefaultFloorValue({
					accessTokenContent: { id: "" }
				})
				.mockChecker(
					0,
					{
						info: "user.notfound",
						data: null
					}
				)
				.launch();
	
			expect(res.information).toBe("user.notfound");
		});
	
		it("get user", async () => {
			const spy = vi.fn(async () => 0);
			MockPrisma.set("user_to_organization", "count", spy);

			const res = await duploTesting
				.testRoute(GET("GET", ""))
				.setDefaultFloorValue({
					accessTokenContent: { id: "" }
				})
				.mockChecker(
					0,
					{
						info: "user.exist",
						data: userData
					}
				)
				.launch();

			expect(res.information).toBe("user");
			expect(spy).lastCalledWith({
				where: {
					userId: userData.id
				}
			});
		});
	});


	describe("PATCH", () => {
		it("patch user address invalid", async () => {
			const res = await duploTesting
				.testRoute(PATCH("PATCH", ""))
				.setDefaultFloorValue({
					accessTokenContent: { id: userData.id }
				})
				.setRequestProperties({
					body: {
						address: "test"
					}
				})
				.mockChecker(
					0,
					{
						info: "user.address.invalid",
						data: null
					}
				)
				.launch();
	
			expect(res.information).toBe("user.address.invalid");
		});
		it("patch user", async () => {
			const spy = vi.fn(async () => userData);
			MockPrisma.set("user", "update", spy);

			const res = await duploTesting
				.testRoute(PATCH("PATCH", ""))
				.setDefaultFloorValue({
					accessTokenContent: { id: userData.id }
				})
				.setRequestProperties({
					body: {
						lastname: "ROSBOULE",
						firstname: "Megue",
						address: "15 rue du Ketchup",
						emailNotifcationsNewsletter: true,
						emailNotifcationsProductStock: true,
						emailNotifcationsPromotion: true,
						emailNotifcationsNewProductsInCategory: true
					}
				})
				.mockChecker(
					0,
					{ 
						info: "address.valid",
						data: true 
					}
				)
				.launch();

			expect(res.information).toBe("user.edited");
			expect(spy).lastCalledWith({
				where: {
					id: userData.id
				},
				data: {
					lastname: "ROSBOULE",
					firstname: "Megue",
					address: "15 rue du Ketchup",
					emailNotifcationsNewsletter: true,
					emailNotifcationsProductStock: true,
					emailNotifcationsPromotion: true,
					emailNotifcationsNewProductsInCategory: true
				}
			});
		});
	});
});
