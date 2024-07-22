import { duploTesting } from "@test/setup";
import { hasPrimordialRole } from "./hasPrimordialRole";
import { Response } from "@duplojs/duplojs";

describe("hasPrimordialRole", () => {
	it("user is admin", async () => {
		const floorValue = await duploTesting
			.testAbstractRoute(hasPrimordialRole.abstractRoute)
			.setDefaultFloorValue({
				user: { primordialRole: "ADMIN" }
			})
			.launch();

		expect(floorValue).toStrictEqual({ user: { primordialRole: "ADMIN" } });
	});

	it("user is customer", async () => {
		const res: Response = await duploTesting
			.testAbstractRoute(hasPrimordialRole.abstractRoute)
			.setDefaultFloorValue({
				user: { primordialRole: "CUSTOMER" }
			})
			.launch();

		expect(res.information).toStrictEqual("user.role.invalid");
	});

	it("user is admin and need customer", async () => {
		const floorValue = await duploTesting
			.testAbstractRoute(hasPrimordialRole.abstractRoute)
			.setDefaultFloorValue({
				user: { primordialRole: "ADMIN" },
				options: { primordialRole: "CUSTOMER" },
			})
			.launch();

		expect(floorValue).toStrictEqual({ user: { primordialRole: "ADMIN" } });
	});
});
