export function useProductForm() {
	const $pt = usePageTranslate();

	const { Form, checkForm, resetForm, values } = useFormBuilder({
		sku: {
			type: "text",
			label: $pt("form.sku"),
			placeholder: $pt("form.skuPlaceholder"),
			defaultValue: "",
			zodSchema: zod.string({ message: $t("form.rule.required") })
				.max(255, { message: $t("form.rule.maxLength", { value: 255 }) })
				.min(2, { message: $t("form.rule.minLength", { value: 2 }) })
		},
	});

	return {
		ProductForm: Form,
		checkProductForm: checkForm,
		resetProductForm: resetForm,
		productValues: values
	};
}

