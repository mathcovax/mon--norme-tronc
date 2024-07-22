import { facetsSchema } from "./fullProductSheet";

const filterDateSchema = zod.object({
	startDate: zod.coerce.date(),
	endDate: zod.coerce.date(),
});

const filterProductSheetSchema = filterDateSchema.extend({
	productSheetsId: zod.string().array(),
	priceMax: zod.number().optional(),
	priceMin: zod.number().optional(),
});

export type FilterProductSheetSchema = Zod.infer<typeof filterProductSheetSchema>;

const filterCategoriesFacetsSchema = filterDateSchema.extend({
	categories: zod.string().array().optional(),
	facets: facetsSchema.optional(),
	priceMax: zod.number().optional(),
	priceMin: zod.number().optional(),
});

export type FilterCategoriesFacetsSchema = Zod.infer<typeof filterCategoriesFacetsSchema>;

const filterTopSchema = filterDateSchema.extend({
	customfilterType: zod.enum(["categories", "productSheetsId"]),
	filterValue: zod.string().array()
});

export type FilterTopSchema = Zod.infer<typeof filterTopSchema>;

const filterValueSchema = filterDateSchema.extend({
	customfilterType: zod.enum(["category", "productSheetId"]),
	filterValue: zod.string(),
});

export type FilterValueSchema = Zod.infer<typeof filterValueSchema>;

const filterChartSchema = zod.union([
	filterProductSheetSchema,
	filterCategoriesFacetsSchema,
]);

export const widgetParamSchema = zod.union([
	zod.object({
		type: zod.enum([
			"line", "bar", "pie", "donut", "area",
		]),
		filters: filterChartSchema,
	}),
	zod.object({
		type: zod.literal("top"),
		filters: filterTopSchema,
	}),
	zod.object({
		type: zod.literal("value"),
		filters: filterValueSchema,
	}),
]);

export const widgetSchema = zod.object({
	x: zod.number().int(),
	y: zod.number().int(),
	w: zod.number().int(),
	h: zod.number().int(),
	i: zod.number().int(),
	params: widgetParamSchema,
});

export const gridStatCommandSchema = widgetSchema.array();

export type GridStatCommandSchema = Zod.infer<typeof gridStatCommandSchema>;

const formattedDataChartSchema = zod.object({
	data: zod.array(
		zod.object({
			name: zod.string()
		}).and(zod.record(zod.union([zod.number(), zod.string()])))
	),
	categories: zod.union([
		zod.array(
			zod.object({
				name: zod.string()
			}),
		),
		zod.object({
			name: zod.string()
		})
	])
});

const formattedDataTopSchema = zod.object({
	key: zod.string(),
	total: zod.number(),
});

export const formattedDataSchema = zod.union([
	formattedDataChartSchema, 
	zod.object({ 
		data: formattedDataTopSchema.array() 
	})
]);

export type FormattedDataSchema = Zod.infer<typeof formattedDataSchema>;

const entryFormatterChartSchema = zod.object({
	dayOfYear: zod.coerce.date(),
	totalValue: zod.number(),
	quantity: zod.number(),
	priceUnit: zod.number(),
	name: zod.string(),
});

export type EntryFormatterChartSchema = Zod.infer<typeof entryFormatterChartSchema>;
