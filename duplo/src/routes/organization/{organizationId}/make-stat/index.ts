import chartMapper from "@services/stats/mapper";
import { fullCommandItemModel } from "@mongoose/model";
import { widgetParamSchema, formattedDataSchema } from "@schemas/gridStatCommand";
import PipelineStageBuilderKpi from "@services/stats/queryBuilders/kpi";
import { hasOrganizationRoleByOrganizationId } from "@security/hasOrganizationRole/byOrganizationId";

/* METHOD : POST, PATH : /organization/{organizationId}/make-stat */
export const POST = (method: Methods, path: string) =>
	hasOrganizationRoleByOrganizationId({
		options: { organizationRole: "BELONG_TO" },
		pickup: ["organization"]
	})
		.declareRoute(method, path)
		.extract({
			body: widgetParamSchema
		})
		.handler(
			async ({ pickup }) => {
				const organizationId = pickup("organization").id;
				const { type, filters } = pickup("body");

				if (filters.endDate > new Date(Date.now())) {
					filters.endDate = new Date(Date.now());
				}

				if (type === "top") {
					const pipe = new PipelineStageBuilderKpi(organizationId).buildPipelineStageForTop(filters);

					const data = await fullCommandItemModel.aggregate(pipe);

					throw new OkHttpException("widget.found", { data: data });
				}
				else if (type === "value") {
					const pipe = new PipelineStageBuilderKpi(organizationId).buildPipelineStageForValue(filters);

					const data = await fullCommandItemModel.aggregate(pipe);

					throw new OkHttpException("widget.found", { data: data });
				}
				else {
					const pipe =  chartMapper[type].PipelineStageBuilder(filters, organizationId);

					const data = await Promise.all(pipe.map(p => fullCommandItemModel.aggregate(p)));
					console.log(data);

					throw new OkHttpException("widget.found", chartMapper[type].Formatter(data));
				}
			},
			new IHaveSentThis(OkHttpException.code,"widget.found", formattedDataSchema)
		);
