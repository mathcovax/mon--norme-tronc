import { createRouter, createWebHistory } from "vue-router";
import edito, { notFound } from "@/domains/edito/router";
import auth from "@/domains/auth/router";
import product from "@/domains/product/router";
import admin from "@/domains/admin/router";
import content from "@/domains/content/router";
import organization from "@/domains/organization/router";
import payment from "@/domains/payment/router";
import { loaderPush, type LoaderItem } from "@/lib/loader";
import user from "@/domains/user/router";
import moderator from "@/domains/moderator/router";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			component: () => import("@/layouts/BaseLayout.vue"),
			children: [
				...edito(),
				...product(),
				...auth(),
				...user(),
				...payment(),
			]
		},
		...organization(),
		...content(),
		...organization(),
		...admin(),
		...organization(),
		...moderator(),
		notFound(),
	],
});

export default router;

let loaderItem: LoaderItem | undefined;

router.beforeEach((to, form, next) => {
	if (to.fullPath === "/") {
		return next();
	}

	loaderItem = loaderPush();
	duploTo.get(`/entry${to.fullPath}`)
		.info("entry.accepted", () => next())
		.e(() => {
			loaderItem?.close();
			loaderItem = undefined;
			next("/");
		})
		.catch(() => {
			loaderItem?.close();
			loaderItem = undefined;
			next("/");
		});
});

router.afterEach(() => {
	loaderItem?.close();
	loaderItem = undefined;
});
