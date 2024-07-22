import { useGetCategories } from "@/domains/content/composables/useGetCategories";
import { useGetFacets } from "@/domains/organization/composables/useGetFacets";
import { useGetProductSheets } from "@/domains/organization/composables/useGetProductSheets";

export function useWidgetDonutPieForm(organizationId: string) {
	
	const $pt = usePageTranslate();
	const { categories, getCategories } = useGetCategories();
	const { facets, getFacets } = useGetFacets(organizationId);
	const { productSheets, getProductSheets } = useGetProductSheets(organizationId);
	const toggle = ref(false);
	const actionToggleDonutPie = () => toggle.value = !toggle.value;

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
		facet: computed(() => ({
			type: "combo",
			label: $pt("form.label.facet"),
			textButton: $pt("form.textButton.facet"),
			items: facets.value.map(({ value, type }) => ({ label: value, identifier: value, type })),
			placeholder: $pt("form.placeholder.facet"),
			emptyLabel: $t("label.empty"),
			onUpdateSearchTerm: (value) => getFacets(undefined, value),
			zodSchema: zod.object(
				{ identifier: zod.string() }, 
				{ message: $t("form.rule.required") }
			).transform(item => item.identifier),
			disabled: true,
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
					{ message: $pt("form.rule.endDateEStartDate") }
				)
		},
	});

	const startDate = values.startDate as Ref<string>;

	return {
		FormWidgetDonutPie: Form,
		checkFormWidgetDonutPie: checkForm,
		resetFormWidgetDonutPie: resetForm,
		valuesWidgetDonutPie: values,
		toggleDonutPie: toggle,
		actionToggleDonutPie,
	};
}
