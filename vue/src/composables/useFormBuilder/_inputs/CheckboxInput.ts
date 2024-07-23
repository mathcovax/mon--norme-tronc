/* eslint-disable vue/require-prop-types */
import { effect } from "vue";
import type { BaseInputDef, InputProps } from "../types";
import TheCheckbox from "@/components/ui/checkbox/TheCheckbox.vue";

export interface CheckboxInputProps extends InputProps<boolean>{
	desc?: string
	reverse?: boolean
	formId: string
}

export interface CheckboxInputDef extends BaseInputDef {
	type: "checkbox"
	defaultValue?: boolean
	desc?: string
	reverse?: boolean
}

export const CheckboxInput = defineComponent({
	props: [
		"label", "modelValue", "zodSchema", "name", "desc", "reverse", "formId", "inputProps"
	],
	setup(props: CheckboxInputProps, { expose, emit }) {
		const toValidated = ref(false);
		const errorMessage = ref("");

		async function submit() {
			if (props.zodSchema) {
				const result = await props.zodSchema.safeParseAsync(props.modelValue);
				if (!result.success) {
					toValidated.value = true;
					throw new Error(result.error.issues[0].message);
				}
				else {
					return result.data;
				}
			}
			return props.modelValue;
		}

		expose({ submit });

		effect(async () => {
			if (toValidated.value && props.zodSchema) {
				const result = await props.zodSchema.safeParseAsync(props.modelValue);
				if (!result.success) {
					errorMessage.value = result.error.issues[0].message;
					return;
				}
			}
			toValidated.value = false;
			errorMessage.value = "";
		});
	
		return () => h(
			"div",
			{
				class: "flex flex-col"
			},
			[
				props.label
					? h(
						"label", 
						{
							class: "cursor-pointer",
							for: `${props.name}-${props.formId}`,
						},
						props.label
					)
					: null,
				h(
					"div", 
					{
						class: `flex gap-2 items-center ${props.reverse ? "flex-row-reverse" : ""}`
					},
					[
						h(
							TheCheckbox, 
							{
								...props.inputProps,
								name: `${props.name}-${props.formId}`,
								id: `${props.name}-${props.formId}`,
								checked: props.modelValue,
								"onUpdate:checked": (value: unknown) => {
									emit("update:modelValue", value);
								},
							}
						),
						props.desc
							? h(
								"label", 
								{
									class: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 hover:cursor-pointer",
									for: `${props.name}-${props.formId}`,
								},
								props.desc
							)
							: null,
					]
				),
				props.zodSchema
					? h(
						"div", 
						{
							class: "h-6"
						},
						[
							h(
								"small", 
								{
									class: "text-invalide"
								},
								errorMessage.value
							)
						]
					)
					: null,
			]
		);
	}
});

