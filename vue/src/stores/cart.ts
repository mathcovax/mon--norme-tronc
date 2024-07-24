import { useGetCart } from "@/domains/user/composables/useGetCart";
import type { Cart } from "@/lib/utils";
import { defineStore } from "pinia";

interface AddedArticle {
	productSheetId: string
	description: string
	shortDescription: string
	name: string
	imageUrl: string
	price: number
}

const KEY_OFFLINE_CART_LOCAL_STORAGE = "offline-cart";

export const useCartStore = defineStore(
	"cart",
	() => {
		const userStore = useUserStore();
		const { cart: onlineCart, getCart } = useGetCart();
		const offlineCart = ref<Cart>(
			JSON.parse(localStorage.getItem(KEY_OFFLINE_CART_LOCAL_STORAGE) ?? "[]")
		);

		const cart = computed(
			() => userStore.isConnected
				? onlineCart.value
				: offlineCart.value
		);

		watch(
			offlineCart,
			() => {
				localStorage.setItem(
					KEY_OFFLINE_CART_LOCAL_STORAGE, 
					JSON.stringify(offlineCart.value)
				);
			},
			{ deep: true }
		);

		watch(
			() => userStore.isConnected,
			async () => {
				if (userStore.isConnected) {
					if (offlineCart.value.length) {
						await Promise.all(
							offlineCart.value.map(
								({ quantity, ...restArticle }) => addArticle(restArticle, quantity, true)
							)
						);
						offlineCart.value = [];
					}
					getCart();
				}
			}
		);

		function addArticle(addedArticle: AddedArticle, quantity: number, disabledToast?: string[] | boolean) {
			if (userStore.isConnected) {
				return duploTo.enriched
					.post(
						"/articles",
						{ 
							productSheetId: addedArticle.productSheetId,
							quantity: quantity,
						},
						undefined,
						{ disabledToast: disabledToast }
					)
					.then(getCart)
					.result;
			}
			else {
				if (offlineCart.value.length === 10) {
					return;
				}
				
				const article = offlineCart.value.find(
					article => article.productSheetId === addedArticle.productSheetId
				);
	
				if (!article) {
					offlineCart.value.push({
						...addedArticle,
						quantity
					});
					successToast($t("response.article.created"));
				}
				else {
					if (article.quantity + quantity > 15) {
						return;
					}
					article.quantity += quantity; 
				}
			}
		}

		function removeArticle(productSheetId: string) {
			if (userStore.isConnected) {
				duploTo.enriched
					.delete(
						"/articles/{productSheetId}",
						{ params: { productSheetId } }
					)
					.then(getCart);
			}
			else {
				const article = offlineCart.value.find(
					article => article.productSheetId === productSheetId
				);
	
				if (!article) {
					return; 
				}
	
				article.quantity--;
				
				if (article.quantity === 0) {
					offlineCart.value = offlineCart.value.filter(
						article => article.productSheetId !== productSheetId
					);
				}
			}
		}

		return {
			cart,
			addArticle,
			removeArticle,
		};
	}
);
