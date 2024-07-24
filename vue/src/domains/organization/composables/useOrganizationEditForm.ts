export interface ItemImage {
	blob?: Blob
	url: string
}

export function useOrganizationEditForm(organizationId: string) {
	const $pt = usePageTranslate();
	const { Form, checkForm, resetForm, values } = useFormBuilder({
		label: {
			type: "text",
			label: $pt("form.organizationLabel"),
			zodSchema: zod.string().max(36).optional()
		},
		emailSupport: {
			type: "text",
			label: $pt("form.emailSupport"),
			zodSchema: zod.string().max(255).optional()
		},
		logo: {
			type: "custom",
			label: $pt("form.logo"),
			defaultValue: undefined as undefined | ItemImage,
			zodSchema: zod.object({
				blob: zod.instanceof(Blob)
					.refine((blob) => blob.size <= 5000000, { message: $t("form.rule.blobToLarge", { value: "5 Mo" }) })
					.optional()
			}).optional()
		}
	});

	duploTo.enriched
		.get(
			"/organizations/{organizationId}",
			{ params: { organizationId } }
		)
		.info("organization.found", (data) => {
			values.label.value = data.label ?? undefined;
			values.logo.value = data.logoUrl ? { url: data.logoUrl } : undefined;
		});

	return {
		FormOrganizationEdit: Form,
		checkFormOrganizationEdit: checkForm,
		resetFormOrganizationEdit: resetForm,
		valuesFormOrganziationEdit: values,
	};
}
