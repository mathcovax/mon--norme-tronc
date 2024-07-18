export function useNewsletterForm() {
	const $pt = usePageTranslate();

	const { Form, checkForm, values, resetForm } = useFormBuilder({
		object: {
			type: "text",
			label: $pt("form.label.object"),
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
		sendAt: {
			cols: 6,
			type: "custom",
			label: $pt("form.label.sendAt"),
			zodSchema: zod.coerce.date({ message: $t("form.rule.required") })
				.min(new Date(), { message: $t("form.rule.minDate", { value: new Date() }) })
		}
	});

	return {
		NewsletterForm: Form,
		checkNewsletterForm: checkForm,
		resetNewsletterForm: resetForm,
		valuesNewsletterForm: values,
	};
}
