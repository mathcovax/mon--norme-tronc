import { bundleArrivedTemplate } from "@/templates/bundle/arrived";
import ZodAccelerator from "@duplojs/zod-accelerator";
import { fullCommandModel } from "@mongoose/model";
import { bundle, bundle_status } from "@prisma/client";
import { Mail } from "@services/mail";

export class LaPosteCarrier {
	static fetchDetails(idShip: string) {
		return fetch(
			`https://api.laposte.fr/suivi/v2/idships/${idShip}?lang=fr_FR`,
			{
				method: "GET",
				headers: { "X-Okapi-Key": ENV.LA_POSTE_KEY }
			}
		).then(
			response => {
				if (!response.ok) {
					throw new Error(`${response.status} when getting details of idShip ${idShip}`);
				}

				return response.json();
			} 
		).then(
			payload => LaPosteCarrier.zodSchemaResponse.parse(payload)
		);
	}

	static async updateBundle(bundle: bundle): Promise<unknown> {
		return LaPosteCarrier
			.fetchDetails(bundle.idShip)
			.then(
				details => {
					const currentCode = details.event[0]?.code ?? "";
					const newStatus: bundle_status | undefined = LaPosteCarrier.codeMapper[currentCode];
	
					if (newStatus && newStatus !== bundle.status) {
						return prisma.bundle.update({
							where: {
								id: bundle.id
							},
							data: {
								status: newStatus
							}
						}).then(async () => {
							if (["DONE", "DONE_OFFICE"].includes(newStatus)) {
								return Promise.all([
									prisma.bundle.findFirst({
										where: {
											commandId: bundle.commandId,
											status: {
												notIn: ["DONE", "DONE_OFFICE"],
											}
										}
									}),
									prisma.command.findFirst({
										where: {
											id: bundle.commandId,
											status: {
												not: "IN_DELIVERY",
											}
										}
									}),
									prisma.user.findFirstOrThrow({
										where: {
											id: bundle.userId
										}
									}).then(
										user => Mail.send(
											user.email,
											`Votre colis n°${bundle.idShip} est bien arrivée !`,
											bundleArrivedTemplate(
												user.firstname,
												bundle.idShip,
												bundle.commandId,
												`${ENV.ORIGIN}/bundle/${bundle.id}`
											)
										)
									).catch(console.log),
								]).then(([findedBundle, findedCommand]) => {
									if (!findedBundle && !findedCommand) {
										return Promise.all([
											prisma.command.update({
												where: { id: bundle.commandId },
												data: {
													status: "DONE"
												}
											}),
											fullCommandModel.updateOne(
												{ id: bundle.commandId },
												{ status: "DONE" }
											)
										]);
									}
								});
							}
						});
					}
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
			event: zod.object({
				code: zod.string(),
			}).array(),
			timeline: zod.object({
				shortLabel: zod.string()
			}).array(),
		})
	);
}
