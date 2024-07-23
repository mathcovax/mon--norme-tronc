import { duploTesting } from "@test/setup";
import { GET } from ".";
import { MockPrisma } from "@test/mocks/providers";
import { POST } from ".";
import { organizationData } from "@test/data/organization";

describe("GET /organizations", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	it("get organizations", async () => {
		const spy = vi.fn(() => []);
		MockPrisma.set("organization", "findMany", spy);

		const res = await duploTesting
			.testRoute(GET("GET", ""))
			.setRequestProperties({
				query: {
					name: "eeee",
				}
			})
			.launch();
		
		expect(spy).lastCalledWith({
			where: {
				name: {
					contains: "eeee",
					mode: "insensitive",
				}
			},
			skip: 0,
			take: 10,
		});
		expect(res.information).toBe("organizations");
	});
});

describe("POST /organization", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	it("post organization with used name", async () => {
		const res = await duploTesting
			.testRoute(POST("POST", ""))
			.setRequestProperties({
				body: {
					name: "aaa",
					ownerId: ""
				}
			})
			.mockChecker(
				0, 
				{
					info: "organization.exist", 
					data: null
				}
			)
			.launch();
		
		expect(res.information).toBe("organization.alreadyExist");
	});

	it("post organization with notfound owner", async () => {
		const res = await duploTesting
			.testRoute(POST("POST", ""))
			.setRequestProperties({
				body: {
					name: "aaa",
					ownerId: ""
				}
			})
			.mockChecker(
				0, 
				{
					info: "organization.notfound", 
					data: null
				}
			)
			.mockChecker(
				1, 
				{
					info: "user.notfound", 
					data: null
				}
			)
			.launch();
		
		expect(res.information).toBe("user.notfound");
	});

	it("post organization with owner of other organization", async () => {
		const spy = vi.fn(() => ({}));
		MockPrisma.set("organization", "findFirst", spy);

		const res = await duploTesting
			.testRoute(POST("POST", ""))
			.setRequestProperties({
				body: {
					name: "aaa",
					ownerId: ""
				}
			})
			.mockChecker(
				0, 
				{
					info: "organization.notfound", 
					data: null
				}
			)
			.mockChecker(
				1, 
				{
					info: "user.exist", 
					data: { id: "1" }
				}
			)
			.launch();
		
		expect(spy).lastCalledWith({ where: { ownerId: "1" } });
		expect(res.information).toBe("user.alreadyOwner");
	});

	it("post organization", async () => {
		MockPrisma.set("organization", "findFirst", () => null);
		
		const spy = vi.fn(() => organizationData);
		MockPrisma.set("organization", "create", spy);

		const res = await duploTesting
			.testRoute(POST("POST", ""))
			.setRequestProperties({
				body: {
					name: "aaaa",
					ownerId: "test"
				}
			})
			.mockChecker(
				0, 
				{
					info: "organization.notfound", 
					data: null
				}
			)
			.mockChecker(
				1, 
				{
					info: "user.exist", 
					data: { id: "1" }
				}
			)
			.launch();
		
		expect(res.information).toBe("organization.created");
		expect(spy).lastCalledWith({ 
			data: { 
				ownerId: "test", 
				name: "aaaa",
				userToOrganization: {
					create: {
						organizationRole: "OWNER",
						userId: "test"
					}
				}
			}, 
		});
	});
});
