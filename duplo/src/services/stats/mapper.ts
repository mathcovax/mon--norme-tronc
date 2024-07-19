import type { 
	FilterCategoriesFacetsSchema, 
	FilterProductSheetSchema, 
	FormattedDataSchema,
	EntryFormatterChartSchema,
} from "@schemas/gridStatCommand";
import PipelineStageBuilderChart from "./queryBuilders/chart";
import { PipelineStage } from "mongoose";
import { formatChart, formatDonut } from "./formatters/chart";

type ChartType = "line" | "bar" | "pie" | "donut" | "area";

type PipelineStageBuilder = (
	filters: FilterCategoriesFacetsSchema | FilterProductSheetSchema, 
	organizationId: string
) => PipelineStage[][];

type Formatter<T> = (data: T) => FormattedDataSchema;

function PipelineStages(
	filters: FilterCategoriesFacetsSchema | FilterProductSheetSchema,
	organizationId: string
) {
	const builder = new PipelineStageBuilderChart(organizationId);
	if (
		(filters as FilterCategoriesFacetsSchema).categories !== undefined || 
			(filters as FilterCategoriesFacetsSchema).facets !== undefined
	) return builder.buildPipelineStageForCategoriesFacets(filters);
	else return builder.buildPipelineStageForProductSheet(filters as FilterProductSheetSchema);
}
  
type ChartMapper = Record<ChartType, {
    PipelineStageBuilder: PipelineStageBuilder
	Formatter: Formatter<EntryFormatterChartSchema[][]>;
}>;

const chartMapper: ChartMapper = 
	{
		line: {
			PipelineStageBuilder: PipelineStages,
			Formatter: formatChart,
		},
		bar: {
			PipelineStageBuilder: PipelineStages,
			Formatter: formatChart,
		},
		pie: {
			PipelineStageBuilder: PipelineStages,
			Formatter: formatDonut,
		},
		donut: {
			PipelineStageBuilder: PipelineStages,
			Formatter: formatDonut,
		},
		area: {
			PipelineStageBuilder: PipelineStages,
			Formatter: formatChart,
		},
	};
export default chartMapper;


