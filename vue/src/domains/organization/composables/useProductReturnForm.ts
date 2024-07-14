import { useGetProducts } from "./useGetPorducts";

export function useProductReturnForm(organizationId: string) {
	const $pt = usePageTranslate();
	const { products, getProducts } = useGetProducts(organizationId);

	const { Form, checkForm, values, resetForm } = useFormBuilder({
		sku: computed(() => ({
			type: "combo",
			items: products.value.map(p => ({ label: p.sku, identifier: p.sku })),
			label: $t("label.sku"),
			textButton: $t("button.search"),
			placeholder: $t("placeholder.productSheet"),
			emptyLabel: $t("label.empty"),
			onUpdateSearchTerm: term => getProducts({ sku: term, status: "SOLD" }),
			zodSchema: zod.object(
				{ identifier: zod.string() },
				{ message: $t("form.rule.required") }
			).transform(({ identifier }) => identifier)
		})),
		reason: {
			type: "text",
			label: $pt("label.reason"),
			zodSchema: zod.string({ message: $t("form.rule.required") })
				.max(255, { message: $t("form.rule.maxLength", { value: 255 }) })
		}
	});

	return {
		ProductReturnForm: Form,
		checkProductReturnForm: checkForm,
		productReturnValues: values,
		resetProductReturnForm: resetForm,
	};
}
