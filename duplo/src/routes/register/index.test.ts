import { MockPrisma } from "@test/mocks/providers";
import { duploTesting } from "@test/setup";
import { POST } from ".";

describe("POST /register", () => {
	beforeEach(() => {
		MockPrisma.reset();
	});

	it("user register", async () => {
		const spy = vi.fn(() => ({}));
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
				primordialRole: true
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
