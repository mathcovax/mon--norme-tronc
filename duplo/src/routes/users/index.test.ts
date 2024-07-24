import { duploTesting } from "@test/setup";
import { GET } from ".";
import { MockPrisma } from "@test/mocks/providers";
import { POST } from ".";

describe("GET /users", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	it("get users", async () => {
		const spy = vi.fn(() => []);
		MockPrisma.set("user", "findMany", spy);

		const res = await duploTesting
			.testRoute(GET("GET", ""))
			.setRequestProperties({
				query: {
					email: "eeee",
					page: 3,
				}
			})
			.launch();

		expect(res.information).toBe("users");
		expect(spy).lastCalledWith({
			where: {
				email: {
					contains: "eeee",
					mode: "insensitive",
				},
				AND: {
					OR: undefined
				}
			},
			skip: 30,
			take: 10,
		});
	});

	it("get users with query role", async () => {
		const spy = vi.fn(() => []);
		MockPrisma.set("user", "findMany", spy);

		const res = await duploTesting
			.testRoute(GET("GET", ""))
			.setRequestProperties({
				query: {
					primordialRole: "ADMIN"
				}
			})
			.launch();

		expect(res.information).toBe("users");
		expect(spy).lastCalledWith({
			where: {
				AND: {
					OR: [{ primordialRole: "ADMIN" }]
				}
			},
			skip: 0,
			take: 10,
		});
	});
});

describe("POST /users", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	it("user register", async () => {
		const spy = vi.fn(() => ({ updatedAt: new Date() }));
		MockPrisma.set("user", "create", spy);

		const res = await duploTesting
			.testRoute(POST("POST", ""))
			.setRequestProperties({
				body: {
					fireBaseIdToken: "test",
					lastname: "Doe",
					firstname: "Jhon",
					dateOfBirth: new Date(2002, 8, 13),
					address: "test",
					emailNotifcationsNewsletter: true,
				}
			})
			.mockChecker(
				"firebaseToken",
				{ info: "firebase.token.valid", data: { email: "test" } },
				{ passCatch: true }
			)
			.mockChecker(
				"userExist",
				{ info: "user.notfound", data: null }
			)
			.mockChecker(
				"addressValid",
				{ info: "address.valid", data: true }
			)
			.launch();

		expect(res.information).toBe("user.registered");
		expect(spy).lastCalledWith({
			data: {
				email: "test",
				lastname: "DOE",
				firstname: "jhon",
				dateOfBirth: new Date(2002, 8, 13),
				address: "test",
				emailNotifcationsNewsletter: true,
			},
			select: {
				id: true,
				updatedAt: true
			}
		});
	});

	it("user already exist", async () => {
		const res = await duploTesting
			.testRoute(POST("POST", ""))
			.setRequestProperties({
				body: {
					fireBaseIdToken: "test",
					lastname: "Doe",
					firstname: "Jhon",
					dateOfBirth: new Date("2002-09-13"),
					address: "test",
					emailNotifcationsNewsletter: true,
				}
			})
			.mockChecker(
				"firebaseToken",
				{ info: "firebase.token.valid", data: { email: "test" } }
			)
			.mockChecker(
				"userExist",
				{
					info: "user.exist",
					data: {
						fireBaseIdToken: "test",
						lastname: "Doe",
						firstname: "Jhon",
						dateOfBirth: new Date("2002-09-13"),
						address: "test",
						emailNotifcationsNewsletter: true,
					}
				}
			)
			.mockChecker(
				"addressValid",
				{ info: "address.valid", data: true }
			)
			.launch();

		expect(res.information).toBe("user.alreadyExist");
	});

	it("user has invalid address", async () => {
		const res = await duploTesting
			.testRoute(POST("POST", ""))
			.setRequestProperties({
				body: {
					fireBaseIdToken: "test",
					lastname: "Doe",
					firstname: "Jhon",
					dateOfBirth: new Date("2002-09-13"),
					address: "test",
					emailNotifcationsNewsletter: true,
				}
			})
			.mockChecker(
				"firebaseToken",
				{ info: "firebase.token.valid", data: { email: "test" } }
			)
			.mockChecker(
				"userExist",
				{ info: "user.notfound", data: null }
			)
			.mockChecker(
				"addressValid",
				{ info: "user.address.invalid", data: false }
			)
			.launch();

		expect(res.information).toBe("user.address.invalid");
	});

	it("user has invalid date of birth", async () => {
		const res = await duploTesting
			.testRoute(POST("POST", ""))
			.setRequestProperties({
				body: {
					fireBaseIdToken: "test",
					lastname: "Doe",
					firstname: "Jhon",
					dateOfBirth: new Date(),
					address: "test",
					emailNotifcationsNewsletter: true,
				}
			})
			.mockChecker(
				"firebaseToken",
				{ info: "firebase.token.valid", data: { email: "test" } }
			)
			.mockChecker(
				"userExist",
				{ info: "user.notfound", data: null }
			)
			.mockChecker(
				"addressValid",
				{ info: "address.valid", data: true }
			)
			.launch();

		expect(res.information).toBe("user.dateOfBirth.invalid");
	});
});
