export function useNewsletterForm() {
	const $pt = usePageTranslate();

	const { Form, checkForm, values, resetForm } = useFormBuilder({
		title: {
			type: "text",
			label: $pt("form.label.title"),
			zodSchema: zod.string({ message: $t("form.rule.required") })
				.min(3, { message: $t("form.rule.minLength", { value: 3 }) })
				.max(255, { message: $t("form.rule.maxLength", { value: 255 }) })
		},
		content: {
			type: "custom",
			label: $pt("form.label.content"),
			zodSchema: zod.string({ message: $t("form.rule.required") }),
			defaultValue: ""
		},
	});

	return {
		NewsletterForm: Form,
		checkNewsletterForm: checkForm,
		resetNewsletterForm: resetForm,
		valuesNewsletterForm: values,
	};
}
