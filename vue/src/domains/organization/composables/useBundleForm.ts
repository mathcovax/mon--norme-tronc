import { useGetProducts } from "./useGetPorducts";

export function useBundleForm(organizationId: string) {
	const $pt = usePageTranslate();

	const { Form, resetForm, checkForm } = useFormBuilder({
		idShip: {
			type: "text",
			label: $pt("form.idShip"),
			zodSchema: zod
				.string({ message: $t("form.rule.required") })
				.min(11, { message: $t("form.rules.minLength", { value: 1 }) })
				.min(15, { message: $t("form.rules.maxLength", { value: 15 }) })
		},
		bundleItems: {
			type: "custom",
			defaultValue: [] as {commandItemId?: string, productSheetId?: string, sku?: string}[],
			zodSchema: zod.object(
				{
					commandItemId: zod.coerce.number({ message: $t("form.rule.required") }), 
					sku: zod.string({ message: $t("form.rule.required") })
				}, 
				{ message: $t("form.rule.required") }
			).array().min(1, { message: $t("form.rule.minItems", { value: 1 }) })
		}
	});

	const { products, getProducts } = useGetProducts(organizationId);

	return {
		BundleForm: Form,
		resetBundleForm: resetForm,
		findProducts: computed(() => products.value.map(p => p.sku)),
		getProducts: (sku: string, productSheetId?: string) => getProducts(0, sku, productSheetId, "IN_STOCK"),
		checkBundleForm: checkForm
	};
}
