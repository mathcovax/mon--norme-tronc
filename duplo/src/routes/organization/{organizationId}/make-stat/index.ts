import chartMapper from "@services/stats/mapper";
import { fullCommandItemModel } from "@mongoose/model";
import { widgetParamSchema, formattedDataSchema } from "@schemas/gridStatCommand";
import PipelineStageBuilderKpi from "@services/stats/queryBuilders/kpi";

/* METHOD : POST, PATH : /organization/{organizationId}/make-stat */
export const POST = (method: Methods, path: string) => duplo
	.declareRoute(method, path)
	.extract({
		params: {
			organizationId: zod.string()
		},
		body: widgetParamSchema
	})
	.handler(
		async ({ pickup }) => {
			const organizationId = pickup("organizationId");
			const { type, filters } = pickup("body");

			if (type === "top") {
				const pipe = new PipelineStageBuilderKpi(organizationId).buildPipelineStageForTop(filters);

				const data = await fullCommandItemModel.aggregate(pipe);

				throw new OkHttpException("widget.found", data);
			}
			else if (type === "value") {
				const pipe = new PipelineStageBuilderKpi(organizationId).buildPipelineStageForValue(filters);

				const data = await fullCommandItemModel.aggregate(pipe);

				console.log(data);

				throw new OkHttpException("widget.found", data);
			}
			else {
				const pipe =  chartMapper[type].PipelineStageBuilder(filters, organizationId);

				const data = await Promise.all(pipe.map(p => fullCommandItemModel.aggregate(p)));

				throw new OkHttpException("widget.found", chartMapper[type].Formatter(data));
			}
		},
		new IHaveSentThis(OkHttpException.code,"widget.found", formattedDataSchema)
	);
