import { LaPosteCarrier } from "@services/carriers/laPost";

if (ENV.ENVIRONMENT === "DEV") {
	const { Config, JsonDB } = await import("node-json-db");
	const db = new JsonDB(
		new Config("src/filesDB/LaPostMock.json")
	);

	LaPosteCarrier.fetchDetails = async (idship) => {
		let details: ReturnType<typeof LaPosteCarrier.zodSchemaResponse["parse"]>;
		if (await db.exists(`/${idship}`) === true) {
			await db.reload();
			details = await db.getData(`/${idship}`);
		}
		else {
			details = {
				event: [{ code: "PC1" }],
				timeline: [{ shortLabel: "Pris en charge" }]
			};
			await db.push(`/${idship}`, details);
		}

		return LaPosteCarrier.zodSchemaResponse.parse(details);
	};
}
