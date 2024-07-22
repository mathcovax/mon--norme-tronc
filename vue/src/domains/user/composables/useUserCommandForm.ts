export function useUserCommandForm() {
	const userStore = useUserStore();
	const { searchAddresses, addresses } = useSearchAddresses();
	const { Form, checkForm, values } = useFormBuilder({
		lastname: {
			cols: 6,
			type: "text",
			label: $t("label.lastname"),
			zodSchema: zod.string({ message: $t("form.rule.required") })
				.min(2, $t("form.rule.minLength", { value: 2 }))
				.max(255, $t("form.rule.maxLength", { value: 255 })),
		},
		firstname: {
			cols: 6,
			type: "text",
			label: $t("label.firstname"),
			zodSchema: zod.string({ message: $t("form.rule.required") })
				.min(2, $t("form.rule.minLength", { value: 2 }))
				.max(255, $t("form.rule.maxLength", { value: 255 })),
		},
		address: computed(() => ({
			type: "combo",
			items: addresses.value.map(v => ({ label: v, identifier: v })),
			placeholder: $t("placeholder.address"),
			emptyLabel: $t("label.empty"),
			label: $t("label.delivreryAddress"),
			zodSchema: zod.object(
				{ label: zod.string() }, 
				{ message: $t("form.rule.required") }
			).transform(item => item.label),
			textButton: $t("button.add"),
			onUpdateSearchTerm: searchAddresses
		})),
	});

	userStore.getPromiseFetching()?.then((data) => {
		values.lastname.value = data.lastname;
		values.firstname.value = data.firstname;
		values.address.value = { label: data.address, identifier: data.address };
	});

	return {
		UserCommandForm: Form,
		checkUserCommandForm: checkForm,
		valuesUserCommandForm: values,
	};
}
