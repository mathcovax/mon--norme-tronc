import { useGetCategories } from "@/domains/content/composables/useGetCategories";
import { useGetProductSheets } from "@/domains/organization/composables/useGetProductSheets";

export function useWidgetValueForm(organizationId: string) {

	const $pt = usePageTranslate();
	const { categories, getCategories } = useGetCategories();
	const { productSheets, getProductSheets } = useGetProductSheets(organizationId);
	const toggle = ref(false);
	const actionToggleValue = () => toggle.value = !toggle.value;

	const { Form, checkForm, resetForm, values } = useFormBuilder({
		category: computed(() => ({
			type: "combo",
			label: $pt("form.label.category"),
			textButton: $pt("form.textButton.category"),
			items: categories.value.map(({ name }) => ({ label: name, identifier: name })),
			placeholder: $pt("form.placeholder.category"),
			emptyLabel: $t("label.empty"),
			onUpdateSearchTerm: (name) => getCategories(undefined, name),
			zodSchema: zod.object(
				{ identifier: zod.string() }, 
				{ message: $t("form.rule.required") }
			).transform(item => item.identifier),
			disabled: toggle.value,
		})),
		productSheet: computed(() => ({
			type: "combo",
			label: $pt("form.label.productSheet"),
			textButton: $pt("form.textButton.productSheet"),
			items: productSheets.value.map(({ name, id }) => ({ label: name, identifier: id })),
			placeholder: $pt("form.placeholder.productSheet"),
			emptyLabel: $t("label.empty"),
			onUpdateSearchTerm: (name) => getProductSheets(undefined, name),
			zodSchema: zod.object(
				{ identifier: zod.string() }, 
				{ message: $t("form.rule.required") }
			).transform(item => item.identifier),
			disabled: !toggle.value,
		})),
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
		FormWidgetValue: Form,
		checkFormWidgetValue: checkForm,
		resetFormWidgetValue: resetForm,
		valuesWidgetValue: values,
		toggleValue: toggle,
		actionToggleValue,
	};
}
