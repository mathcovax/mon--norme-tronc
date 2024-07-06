import ZodAccelerator from "@duplojs/zod-accelerator";
import { bundle, bundle_status } from "@prisma/client";

export class LaPosteCarrier {
	static updateBundled(bundle: bundle) {
		return fetch(
			`https://api.laposte.fr/suivi/v2/idships/${bundle.id}?lang=fr_FR`,
			{
				method: "GET",
				headers: { "X-Okapi-Key": ENV.LA_POSTE_KEY }
			}
		).then(
			response => {
				if (!response.ok) {
					throw new Error(`${response.status} when geting status of bundle ${bundle.id}`);
				}
	
				return response.json();
			} 
		).then(
			payload => LaPosteCarrier.zodSchemaResponse.parse(payload)
		).then(
			currentCode => {
				const newStatus: bundle_status | undefined = LaPosteCarrier.codeMapper[currentCode];
	
				if (newStatus && newStatus !== bundle.status) {
					return prisma.bundle.update({
						where: {
							id: bundle.id
						},
						data: {
							status: newStatus
						}
					});
				}
				return bundle;
			}
		).catch(error => {
			console.log(error);
			return bundle;
		});
	}

	static codeMapper: Record<string, bundle_status| undefined> = {
		DR1: "CREATED",
		DR2: undefined,
		PC1: "CARRIER_SUPPORTED",
		PC2: "CARRIER_SUPPORTED",
		ET1: "CARRIER_PROCESS",
		ET2: "CARRIER_PROCESS",
		ET3: "CARRIER_PROCESS",
		ET4: "CARRIER_PROCESS",
		EP1: undefined,
		DO1: undefined,
		DO2: undefined,
		DO3: undefined,
		PB1: undefined,
		PB2: undefined,
		MD2: undefined,
		ND1: "UNDELIVERABLE",
		AG1: "DONE_OFFICE",
		RE1: "BACK",
		DI0: "DONE",
		DI1: "DONE",
		DI2: "BACK_DONE",
		DI3: undefined,
		ID0: undefined,
	};

	static zodSchemaResponse = ZodAccelerator.build(
		zod.object({
			shipment: zod.object({
				event: zod.object({
					code: zod.string(),
				}).array()
			})
		})
			.transform(value => value.shipment.event[0]?.code)
			.refine(value => !!value)
	);
}
