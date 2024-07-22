import DuploTo from "@duplojs/to";
import type { EnrichedDuploTo } from "./EnrichedDuploTo";
import { loaderPush, type LoaderItem } from "../loader";

declare global {
	//@ts-expect-error useless error
	export type { GetDef, GetResponseByCode, GetResponseByInfo } from "./EnrichedDuploTo";
}

interface InterceptorParams {
	disabledLoader?: boolean
	loaderItem?: LoaderItem
	disabledToast?: boolean | string[]
}

export const duploTo = new DuploTo<
	InterceptorParams, 
	EnrichedDuploTo<InterceptorParams>
>({
	prefix: "api"
});

duploTo.setDefaultHeaders({
	get authorization() {
		const accessToken = useUserStore().accessToken;
		return accessToken ? `Bearer ${accessToken}` : undefined;
	}
});

duploTo.setRequestInterceptor(
	(requestObject, params) => {
		if (params.disabledLoader !== true) {
			params.loaderItem = loaderPush();
		}
		return requestObject;
	}
);

duploTo.setResponseInterceptor(
	(responseObject, requestObject, params) => {
		if (
			params.disabledToast !== true && 
			responseObject.success && 
			responseObject.info &&
			i18n.global.te(`response.${responseObject.info}`)
		) {
			if (!params.disabledToast || !params.disabledToast.includes(responseObject.info)) {
				if (responseObject.response.ok) {
					successToast($t(`response.${responseObject.info}`));
				}
				else {
					errorToast($t(`response.${responseObject.info}`));
				}
			}
		}

		if (params.loaderItem) {
			params.loaderItem.close();
		}
		
		return responseObject;
	}
);

duploTo.addHookCode(400, (req, res) => {
	if (res.success && res.info?.startsWith("TYPE_ERROR")) {
		errorToast($t("response.TYPE_ERROR"));
	}
});

duploTo.addHookInfo("NOTFOUND", () => {
	errorToast($t("response.NOTFOUND"));
});

duploTo.addHookInfo("INTERNAL_SERVER_ERROR", () => {
	errorToast($t("response.INTERNAL_SERVER_ERROR"));
});

duploTo.addHookInfo("WHAT_WAS_SENT_ERROR", () => {
	errorToast($t("response.WHAT_WAS_SENT_ERROR"));
});
