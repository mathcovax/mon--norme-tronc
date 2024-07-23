export function useSignUpForm() {

	const timestamp18year = 568036800000;
	const { searchAddresses, addresses } = useSearchAddresses();

	const { Form, checkForm } = useFormBuilder({
		lastname: {
			cols: 6,
			type: "text",
			label: $t("label.lastname"),
			zodSchema: zod.string({ message: $t("form.rule.required") })
				.min(2, $t("form.rule.minLength", { value: 2 }))
				.max(255, $t("form.rule.maxLength", { value: 255 })),
		},
		fistname: {
			cols: 6,
			type: "text",
			label: $t("label.firstname"),
			zodSchema: zod.string({ message: $t("form.rule.required") })
				.min(2, $t("form.rule.minLength", { value: 2 }))
				.max(255, $t("form.rule.maxLength", { value: 255 })),
		},
		dateOfBirth: {
			type: "date",
			label: $t("label.birthDate"),
			zodSchema: zod.coerce.date({ message: $t("form.rule.required") })
				.refine(
					(userDateOfBirth) => Date.now() - userDateOfBirth.getTime() >= timestamp18year, 
					{ message: $t("form.rule.minAge") }
				)
		},
		address: computed(() => ({
			type: "combo",
			items: addresses.value.map(v => ({ label: v, identifier: v })),
			placeholder: $t("placeholder.address"),
			emptyLabel: $t("label.empty"),
			label: $t("label.address"),
			zodSchema: zod.object(
				{ label: zod.string() }, 
				{ message: $t("form.rule.required") }
			).transform(item => item.label),
			textButton: $t("button.add"),
			onUpdateSearchTerm: searchAddresses
		})),
		emailNotifcationsNewsletter: {
			type: "checkbox",
			desc: $t("label.newsletter"),
			zodSchema: zod.boolean().optional(),
		},
		terms: {
			type: "custom",
			defaultValue: false,
			zodSchema: zod.literal(true, { message: $t("form.rule.required") }),
		}
	});

	return {
		SignUpForm: Form,
		checkSignUpForm: checkForm,
	};
}
