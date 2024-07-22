import type { EntryFormatterChartSchema } from "@schemas/gridStatCommand";

type InputData = EntryFormatterChartSchema[][];

export function formatChart(data: InputData) {
	const dataMap = new Map<string, { name: string } & Record<string, number | string>>();

	data.forEach(sublist => {
		sublist.forEach(entry => {
			const date = entry.dayOfYear.toISOString().split("T")[0];

			if (!dataMap.has(date)) {
				dataMap.set(date, { name: date });
			}

			const dateEntry = dataMap.get(date);
			const name = entry.name.endsWith("_") ? entry.name.slice(0, -1) : entry.name;
			if (dateEntry) {
				dateEntry[name] = entry.totalValue;
				dateEntry[name + "_" + "quantity"] = entry.quantity;
			}
		});
	});

	return {
		data: Array.from(dataMap.values()),
		categories: data.map((entry) => ({
			name: entry[0].name.endsWith("_") ? 
				entry[0].name.slice(0, -1) : 
				entry[0].name 
		}))
	};
}

export function formatDonut(data: InputData) {
	const dataMap = new Map<string, { name: string } & Record<string, number | string>>();

	data[0]?.forEach(entry => {
		const date = entry.dayOfYear.toISOString().split("T")[0];

		if (!dataMap.has(date)) {
			dataMap.set(date, { name: date });
		}

		const dateEntry = dataMap.get(date);
		const name = entry.name.endsWith("_") ? entry.name.slice(0, -1) : entry.name;
		if (dateEntry) {
			dateEntry[name] = entry.totalValue;
			dateEntry[name + "_" + "quantity"] = entry.quantity;
		}
	});

	return {
		data: Array.from(dataMap.values()),
		categories: {
			name: data[0][0].name.endsWith("_") ? 
				data[0][0].name.slice(0, -1) : 
				data[0][0].name
		}
	};
}

