import { routerPageNameAdminPanel } from "@/domains/admin/router";
import { routerPageNameAuth } from "@/domains/auth/router";
import { routerPageNameContentPanel } from "@/domains/content/router";
import { routerPageNameEdito } from "@/domains/edito/router";
import { routerPageNameOrganization } from "@/domains/organization/router";
import { routerPageNameUser } from "@/domains/user/router";
import { routerPageNameCategory } from "@/domains/product/router";
import { routerPageNamePayment } from "@/domains/payment/router";
import { routerPageNameModeratorPanel } from "@/domains/moderator/router";

export const routerPageName = Object.freeze({
	...routerPageNameAdminPanel,
	...routerPageNameAuth,
	...routerPageNameEdito,
	...routerPageNameContentPanel,
	...routerPageNameOrganization,
	...routerPageNameUser,
	...routerPageNameCategory,
	...routerPageNamePayment,
	...routerPageNameModeratorPanel,
});
