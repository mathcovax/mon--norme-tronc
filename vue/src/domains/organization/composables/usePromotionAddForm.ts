import { useGetProductSheets } from "./useGetProductSheets";

export function usePromotionAddForm(organizationId: string) {
	const { productSheets, getProductSheets } = useGetProductSheets(organizationId);
	const $pt = usePageTranslate();

	const { Form, checkForm, resetForm, values } = useFormBuilder({
		productSheet: computed(() => ({
			type: "combo",
			items: productSheets.value
				.map(v => ({ label: v.name, identifier: v.id })),
			placeholder: $t("placeholder.productSheet"),
			emptyLabel: $t("label.empty"),
			label: $t("label.productSheet"),
			zodSchema: zod.object(
				{ identifier: zod.string() }, 
				{ message: $t("form.rule.required") }
			).transform(item => item.identifier),
			textButton: $t("button.search"),
			onUpdateSearchTerm: (value: string) => getProductSheets(0, value)
		})),
		percentage: {
			type: "number",
			label: $t("label.percentage"),
			zodSchema: zod.number({ message: $t("form.rule.required") })
				.min(0, $t("form.rule.min", { min: 1 }))
				.max(100, $t("form.rule.max", { max: 100 }))
				.positive($t("form.rule.positive"))
		},
		startDate: {
			type: "date",
			label: $t("label.startDate"),
			zodSchema: zod.coerce.date({ message: $t("form.rule.required") })
		},
		endDate: {
			type: "date",
			label: $t("label.endDate"),
			zodSchema: zod.coerce
				.date({ message: $t("form.rule.required") })
				.refine(
					endDate => new Date(startDate.value).getTime() < endDate.getTime(),
					{ message: $pt("form.endDateGteStartDate") }
				)
				.refine(
					endDate => endDate.getTime() !== new Date(startDate.value).getTime(),
					{ message: $pt("form.endDateEStartDate") }
				)
		},
		reason: {
			type: "text",
			label: $t("label.reason"),
			zodSchema: zod.string({ message: $t("form.rule.required") }),
		}
	});

	const startDate = values.startDate as Ref<string>;

	return {
		FormPromotionAdd: Form,
		checkFormPromotionAdd: checkForm,
		resetFormPromotionAdd: resetForm
	};
}
