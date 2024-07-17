import { facetType, type Facet, type FacetType } from "@/lib/utils";
import { useGetWarehouses } from "./useGetWarehouses";

interface ItemMultiComBox {
	label: string,
	value: string | number
}

export interface ItemImage {
	id: string
	url: string
}
export interface ItemImageNew {
	blob: Blob
	url: string
}

export interface FacetItem{
	type: FacetType | undefined
	value: string | undefined
}

export function useProductSheetForm(organizationId: string, productSheetId?: string) {
	const $pt = usePageTranslate();
	const suggestedCategories = ref<ItemMultiComBox[]>([]);
	const { getWarehouses, warehouses } = useGetWarehouses(organizationId);
	
	function onSearchCategories(categoryName?: string) {
		duploTo.enriched.
			get("/categories", { query: { name: categoryName, withDisabled: true } })
			.s((categories) => {
				suggestedCategories.value = categories.map(
					(category) => ({ label: category.name, value: category.name })
				);
			});
	}
	onSearchCategories();

	const { Form, checkForm, resetForm, values } = useFormBuilder({
		ref: {
			type: "text",
			label: $t("label.ref"),
			cols: 12,
			defaultValue: "",
			inputProps: {
				disabled: !!productSheetId,
			},
			zodSchema: zod.string({ message: $t("form.rule.required") })
				.max(20, { message: $t("form.rule.maxLength", { value: 20 }) })
				.min(5, { message: $t("form.rule.minLength", { value: 5 }) })
		},
		name: {
			type: "text",
			label: $t("label.lastname"),
			cols: 6,
			defaultValue: "",
			zodSchema: zod.string({ message: $t("form.rule.required") })
				.max(255, { message: $t("form.rule.maxLength", { value: 255 }) })
				.min(3, { message: $t("form.rule.minLength", { value: 3 }) })
		},
		price: {
			type: "number",
			label: $pt("price"),
			cols: 6,
			defaultValue: 0,
			inputProps: {
				step: "0.01"
			},
			zodSchema: zod.number({ message: $t("form.rule.required") })
				.min(0.01, { message: $t("form.rule.minLength", { value: 0.01 }) })
		},
		categories: {
			type: "custom",
			label: $t("label.categories"),
			defaultValue: [] as ItemMultiComBox[] | undefined,
			zodSchema: zod.object({
				value: zod.string()
			}).array().max(5, { message: $t("form.rule.maxItems", { value: 5 }) })
		},
		oldCategories: {
			type: "custom",
			defaultValue: undefined as ItemMultiComBox[] | undefined,
		},
		shortDescription: {
			type: "text",
			label: $pt("shortDescription"),
			defaultValue: "",
			zodSchema: zod.string({ message: $t("form.rule.required") })
				.max(255, { message: $t("form.rule.maxLength", { value: 255 }) })
				.min(3, { message: $t("form.rule.minLength", { value: 3 }) })
		},
		description: {
			type: "custom",
			label: $t("label.description"),
			defaultValue: "",
		},
		oldFacets: {
			type: "custom",
			defaultValue: undefined as Pick<Facet, "type" | "value">[] | undefined,
		},
		facets: {
			type: "custom",
			defaultValue: [] as FacetItem[],
			zodSchema: zod.object({
				type: zod.enum(facetType, { message: $t("form.rule.required") }),
				value: zod.string({ message: $t("form.rule.required") })
					.min(2, { message: $t("form.rule.minLength", { value: 2 }) })
					.max(50, { message: $t("form.rule.maxLength", { value: 50 }) }),
			}).array()
		},
		oldImages: {
			type: "custom",
			defaultValue: undefined as ItemImage[] | undefined,
		},
		images: {
			type: "custom",
			label: $pt("form.image"),
			defaultValue: [] as (ItemImage | ItemImageNew)[],
			zodSchema: zod.object({
				blob: zod.instanceof(Blob)
					.refine((blob) => blob.size <= 5000000, { message: $t("form.rule.blobToLarge", { value: "5 Mo" }) })
					.optional(),
				id: zod.string().optional()
			}).array().min(1, { message: $t("form.rule.minItems", { value: 1 }) })
		},
		variationGroup: {
			type: "text",
			label: $pt("form.variationGroup"),
			cols: 6,
			zodSchema: zod.string()
				.max(30, { message: $t("form.rule.maxLength", { value: 30 }) })
				.min(3, { message: $t("form.rule.minLength", { value: 3 }) })
				.optional(),
		},
		variationName: {
			type: "text",
			label: $pt("form.variationName"),
			cols: 6,
			zodSchema: zod.string()
				.max(30, { message: $t("form.rule.maxLength", { value: 30 }) })
				.min(3, { message: $t("form.rule.minLength", { value: 3 }) })
				.optional(),
		},
		warehouse: computed(() => ({
			type: "combo",
			items: warehouses.value.map(v => ({ label: v.name, identifier: v.id })),
			placeholder: $pt("form.warehousePlaceholder"),
			emptyLabel: $t("label.empty"),
			label: $pt("form.warehouseLabel"),
			zodSchema: zod.object(
				{ identifier: zod.string() }, 
				{ message: $t("form.rule.required") }
			).transform(item => item.identifier),
			textButton: $t("button.add"),
			onUpdateSearchTerm: (name: string) => getWarehouses(undefined, name),
		})),
	});

	if (productSheetId) {
		duploTo.enriched
			.get(
				"/product-sheet/{productSheetId}",
				{ params: { productSheetId } }
			)
			.info("productSheet.found", (data) => {
				values.name.value = data.name;
				values.description.value = data.description;
				values.shortDescription.value = data.shortDescription;
				values.price.value = data.price;
				values.ref.value = data.ref;
				values.variationGroup.value = data.variationGroup ?? undefined;
				values.variationName.value = data.variationName ?? undefined;
			});

		duploTo.enriched
			.get(
				"/product-sheet/{productSheetId}/warehouse",
				{ params: { productSheetId } }
			)
			.info("productSheet.warehouse", (data) => {
				values.warehouse.value = { label: data.name, identifier: data.id };
			});
	
		duploTo.enriched
			.get(
				"/product-sheet/{productSheetId}/categories",
				{ params: { productSheetId } }
			)
			.info("productSheet.categories", (data) => {
				const categoriesItems = data.map(c => ({ label: c.name, value: c.name }));
				values.categories.value = categoriesItems;
				values.oldCategories.value = categoriesItems;
			});
		
		duploTo.enriched
			.get(
				"/product-sheet/{productSheetId}/images",
				{ params: { productSheetId } }
			)
			.info("productSheet.images", (data) => {
				const itemImages = data.map(({ id, url }) => ({ id, url }));
				values.images.value = itemImages;
				values.oldImages.value = itemImages;
			});

		duploTo.enriched
			.get(
				"/product-sheet/{productSheetId}/facets",
				{ params: { productSheetId } }
			)
			.info("productSheet.facets", (data) => {
				const itemFacets = data.map(({ type, value }) => ({ type, value }));
				values.facets.value = itemFacets;
				values.oldFacets.value = itemFacets;
			});
	}

	return {
		ProductSheetForm: Form,
		checkProductSheetForm: checkForm,
		resetProductSheetForm: resetForm,
		ProductSheetValues: values,
		onSearchCategories,
		suggestedCategories
	};
}
