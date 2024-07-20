import { createI18n } from "vue-i18n";

export const i18n = createI18n({});

export const $t = i18n.global.t;

export async function setLocaleMessages(code: "fr") {
	const message = await import(`@/lib/i18n/languages/${code}.ts`);

	i18n.global.setLocaleMessage(code, message.default);

	await nextTick();

	i18n.global.locale = code;
}

setLocaleMessages("fr");
