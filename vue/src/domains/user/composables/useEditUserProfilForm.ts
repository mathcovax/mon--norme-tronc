export function useEditUserProfilForm(userId?: string) {
	const { searchAddresses, addresses } = useSearchAddresses();
	const { Form, checkForm, values } = useFormBuilder({
		lastname: {
			cols: 6,
			type: "text",
			label: $t("label.lastname"),
			zodSchema: zod.string({ message: $t("form.rule.required") })
				.min(2, $t("form.rules.minLength", { value: 2 }))
				.max(255, $t("form.rules.maxLength", { value: 255 })),
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
			label: $t("label.address"),
			zodSchema: zod.object(
				{ label: zod.string() }, 
				{ message: $t("form.rule.required") }
			).transform(item => item.label),
			textButton: $t("button.add"),
			onUpdateSearchTerm: searchAddresses
		})),
		emailNotifcationsNewsletter: {
			cols: 6,
			type: "checkbox",
			label: $t("label.newsletter"),
			zodSchema: zod.boolean().optional(),
		},
		emailNotifcationsProductStock: {
			cols: 6,
			type: "checkbox",
			label: $t("label.productStock"),
			zodSchema: zod.boolean().optional(),
		},
		emailNotifcationsPromotion: {
			cols: 6,
			type: "checkbox",
			label: $t("label.promotions"),
			zodSchema: zod.boolean().optional(),
		},
		emailNotifcationsNewProductsInCategory: {
			cols: 6,
			type: "checkbox",
			label: $t("label.newProductsInCategory"),
			zodSchema: zod.boolean().optional(),
		},
	});

	if (userId) {
		duploTo.enriched
			.get("/user")
			.info("user", (data) => {
				const address = { label: data.address, identifier: data.address }; 

				values.lastname.value = data.lastname;
				values.firstname.value = data.firstname;
				values.address.value = address;
				values.emailNotifcationsNewsletter.value = data.emailNotifcationsNewsletter;
				values.emailNotifcationsProductStock.value = data.emailNotifcationsProductStock;
				values.emailNotifcationsPromotion.value = data.emailNotifcationsPromotion;
				values.emailNotifcationsNewProductsInCategory.value = data.emailNotifcationsNewProductsInCategory;
			});
	}

	return {
		EditUserProfilForm: Form,
		checkEditUserProfilForm: checkForm,
		valuesEditUserProfilForm: values,
	};
}
