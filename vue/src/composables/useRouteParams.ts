import type { ZodObject, ZodTypeAny, infer as zodInfer } from "zod";
import type { Ref } from "vue";

export function useRouteParams<
	T extends Record<string, ZodTypeAny>
>(objectSchemas: T): Ref<zodInfer<ZodObject<T>>>
{
	const route = useRoute();
	const router = useRouter();
	const currentRouteName = route.name;

	const params = computed(() => {
		const zodSchema = zod.object(objectSchemas);
		
		if (currentRouteName !== route.name) {
			throw new Error("Route change.");
		}

		const result = zodSchema.safeParse(route.params);
		
		if (!result.success) {
			router.push({ name: routerPageName.EDITO_HOME });
			
			throw new Error("Params is invalid.");
		}

		return result.data;
	});
	

	return params; 
}
