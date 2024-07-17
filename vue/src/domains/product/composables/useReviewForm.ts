export function useReviewForm() {
	const { Form, checkForm, resetForm } = useFormBuilder({
		rate: {
			type: "custom",
			label: $t("label.rate"),
			defaultValue: 5 as string | number,
			zodSchema: zod.coerce.number().min(1).max(5).int().default(5),
		},
		pseudo: {
			type: "text",
			label: $t("label.pseudo"),
			zodSchema: zod
				.string({ message: $t("form.rule.required") })
				.min(3, { message: $t("form.rule.minLength", { value: 3 }) })
				.max(30, { message: $t("form.rule.maxLength", { value: 30 }) })
		},
		content: {
			type: "textarea",
			defaultValue: "",
			label: $t("label.content"),
			zodSchema: zod
				.string()
				.max(30, { message: $t("form.rule.maxLength", { value: 500 }) })
				.default("")
		},
	});

	return {
		ReviewForm: Form,
		checkReviewForm: checkForm,
		resetReviewForm: resetForm,
	};
} 
