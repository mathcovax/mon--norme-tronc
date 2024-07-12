import "./setup";
import { mongoose } from "./setup/mongoose";
import { FindSlice } from "@utils/findSlice";
import { PromiseList } from "./setup/promiseList";
import { bundle, carrier_name } from "@prisma/client";
import { LaPosteCarrier } from "@services/carriers/laPost";

const carrierMapper: Record<carrier_name, ((bundle: bundle) => Promise<unknown>)> = {
	LA_POSTE: (bundle) => LaPosteCarrier.updateBundled(bundle)
};

const bundleGenerator = FindSlice(
	500,
	(slice, size) =>  prisma.bundle.findMany({
		where: {
			NOT: {
				status: {
					in: [
						"BACK_DONE", "DONE", "DONE_OFFICE", "UNDELIVERABLE"
					]
				}
			}
		},
		skip: slice * size,
		take: size,
	})
);

const promiseList = new PromiseList(100);

for await (const bundle of bundleGenerator) {
	await promiseList.append(
		carrierMapper[bundle.carrierName](bundle)
	);
}

await promiseList.clear();

mongoose.connection.close();
