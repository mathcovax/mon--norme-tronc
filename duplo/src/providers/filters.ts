declare global {
	const filterDefs: (typeof import("./filters"))["filterDefs"];

	interface FilterDefBase<
		T extends string, 
		N extends string = string
	> {
		type: T
		name: N
		path: string
	}
	interface FilterDefCheckbox<N extends string = string> extends FilterDefBase<"CHECKBOX", N> {
		values: string[]
	}
	
	interface FilterDefRadio<N extends string = string> extends FilterDefBase<"RADIO", N> {
		values: string[]
	}
	
	interface FilterDefToggle<N extends string = string> extends FilterDefBase<"TOGGLE", N> {
		trueValue?: unknown
	}

	type FilterDefRange<N extends string = string> = FilterDefBase<"RANGE", N>

	type FilterDef<N extends string = string> = 
		| FilterDefCheckbox<N>
		| FilterDefRadio<N>
		| FilterDefToggle<N> 
		| FilterDefRange<N>
}

function defineFilters<
	N extends string,
	F extends FilterDef<N>
>(filtersDef: F[]): F[]
{
	return filtersDef;
}

export const filterDefs = defineFilters([
	{
		type: "CHECKBOX",
		name: "color",
		path: "facets.COLOR",
		values: [
			"red", "blue", "green", "yellow", "black", "white"
		]
	},
	{
		type: "RADIO",
		name: "size",
		path: "facets.SIZE",
		values: ["small", "medium", "large"]
	},
	{
		type: "RADIO",
		name: "diameter",
		path: "facets.DIAMETER",
		values: [
			"20mm", "30mm", "40mm", "50mm", "60mm"
		]
	},
	{
		type: "RADIO",
		name: "target",
		path: "facets.TARGET",
		values: ["man", "woman", "man/woman"]
	},
	{
		type: "TOGGLE",
		name: "accessory",
		path: "facets.ACCESSORY",
		trueValue: "true",
	},
	{
		type: "CHECKBOX",
		name: "material",
		path: "facets.MATERIAL",
		values: ["wood", "plastic"]
	},
	{
		type: "CHECKBOX",
		name: "stimulation",
		path: "facets.STIMULATION",
		values: [
			"anal", "vaginal", "clitoral", "prostate"
		]
	},
	{
		type: "TOGGLE",
		name: "promotion",
		path: "hasPromotion",
	},
	{
		type: "RANGE",
		name: "price",
		path: "price"
	},
	{
		type: "RADIO",
		name: "rate",
		path: "avgRate",
		values: ["5", "4", "3"]
	},
]);

//@ts-expect-error var 'global' cause type error.
global.filterDefs = filterDefs;
