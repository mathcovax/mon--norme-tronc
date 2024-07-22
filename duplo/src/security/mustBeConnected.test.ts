import { duploTesting } from "@test/setup";
import { mustBeConnected } from "./mustBeConnected";
import { Response } from "@duplojs/duplojs";
import { UnauthorizedHttpException } from "@duplojs/http-exception";

describe("mustBeConnected", () => {
	it("user is connected", async () => {
		const floorValue = await duploTesting
			.testAbstractRoute(mustBeConnected.abstractRoute)
			.setRequestProperties({
				headers: {
					authorization: "test"
				}
			})
			.mockChecker(
				0,
				{
					info: "access.token.valid",
					data: { lastUpdateUser: new Date(2001, 8, 11) },
				},
				{ passCatch: true }
			)
			.mockChecker(
				1,
				{
					info: "user.exist",
					data: { id: "toto", updatedAt: new Date(2001, 8, 11) }
				},
				{ passCatch: true }
			)
			.launch();

		expect(floorValue).toStrictEqual({ 
			user: {
				id: "toto", 
				updatedAt: new Date(2001, 8, 11) 
			}
		});
	});

	it("user is not exist", async () => {
		const res: Response = await duploTesting
			.testAbstractRoute(mustBeConnected.abstractRoute)
			.setRequestProperties({
				headers: {
					authorization: "test"
				}
			})
			.mockChecker(
				0,
				{
					info: "access.token.valid",
					data: "test"
				},
				{ passCatch: true }
			)
			.mockChecker(
				1,
				{
					info: "user.notfound",
					data: null
				},
			)
			.launch();

		expect(res.information).toStrictEqual("user.notfound");
	});

	it("user is not connected", async () => {
		const res: Response = await duploTesting
			.testAbstractRoute(mustBeConnected.abstractRoute)
			.setRequestProperties({
				headers: {
					authorization: "test"
				}
			})
			.mockChecker(
				0,
				{
					info: "access.token.invalid",
					data: "test"
				}
			)
			.launch();

		expect(res.information).toStrictEqual("access.token.invalid");

		const res1: UnauthorizedHttpException = await duploTesting
			.testAbstractRoute(mustBeConnected.abstractRoute)
			.launch();
			
		expect(res1.info).toStrictEqual("access.token.invalid");
	});
});
