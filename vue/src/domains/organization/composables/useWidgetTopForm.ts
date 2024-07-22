import { useGetCategories } from "@/domains/content/composables/useGetCategories";
import { useGetProductSheets } from "@/domains/organization/composables/useGetProductSheets";

interface ItemMultiComBox {
	label: string,
	value: string | number
}

export function useWidgetTopForm(organizationId: string) {

	const $pt = usePageTranslate();
	const { categories, getCategories } = useGetCategories();
	const { productSheets, getProductSheets } = useGetProductSheets(organizationId);
	const toggle = ref(false);

	const actionToggleTop = () => toggle.value = !toggle.value;

	const { Form, checkForm, resetForm, values } = useFormBuilder({
		category: {
			type: "custom",
			label: $pt("form.label.category"),
			defaultValue: [] as ItemMultiComBox[] | undefined,
			zodSchema: zod.object({
				value: zod.string()
			}).array().max(5, { message: $t("form.rule.maxItems", { value: 5 }) }),
		},
		productSheet: {
			type: "custom",
			label: $pt("form.label.productSheet"),
			defaultValue: [] as ItemMultiComBox[] | undefined,
			zodSchema: zod.object({
				value: zod.string()
			}).array().max(5, { message: $t("form.rule.maxItems", { value: 5 }) }),
		},
		startDate: {
			type: "date",
			label: $pt("form.label.startDate"),
			zodSchema: zod.coerce.date({ message: $t("form.rule.required") })
		},
		endDate: {
			type: "date",
			label: $pt("form.label.endDate"),
			zodSchema: zod.coerce
				.date({ message: $t("form.rule.required") })
				.refine(
					endDate => new Date(startDate.value).getTime() < endDate.getTime(),
					{ message: $pt("form.rule.endDateGteStartDate") }
				)
				.refine(
					endDate => endDate.getTime() !== new Date(startDate.value).getTime(),
					{ message: $pt("form.rule.endDateGteStartDate") }
				)
		},
	});

	const startDate = values.startDate as Ref<string>;

	return {
		FormWidgetTop: Form,
		checkFormWidgetTop: checkForm,
		resetFormWidgetTop: resetForm,
		actionToggleTop,
		toggleTop: toggle,
		suggestedCategoriesTop: categories,
		getCategoriesWidgetTop: (value: string) => getCategories(undefined, value),
		suggestedProductSheetsTop: productSheets,
		getProductSheetsWidgetTop: (value: string) => getProductSheets(undefined, value),
	};
}
