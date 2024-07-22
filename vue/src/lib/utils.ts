import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { GetDef, GetResponseByInfo } from "./duploTo/EnrichedDuploTo";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function promiseWithResolvers<T = void>() {
	let resolve: (value: T) => void = () => undefined;
	let reject: (error?: unknown) => void = () => undefined;

	const promise = new Promise<T>((res, rej) => {
		resolve = res;
		reject = rej;
	});

	return { promise, resolve, reject };
}

declare global {
  type UnionToIntersection<U> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never;
  type LastOf<T> = UnionToIntersection<
    T extends unknown ? () => T : never
  > extends () => infer R
    ? R
    : never;
  type Push<T extends unknown[], V> = [...T, V];
  export type TuplifyUnion<
    T,
    L = LastOf<T>,
    N = [T] extends [never] ? true : false
  > = true extends N ? [] : Push<TuplifyUnion<Exclude<T, L>>, L>;
}

export type Organization = GetResponseByInfo<
  GetDef<"GET", "/organizations">,
  "organizations"
>["body"][number];

export type SelfUser = GetResponseByInfo<
	GetDef<"GET", "/user">,
	"user"
>["body"]

export type User = GetResponseByInfo<
	GetDef<"GET", "/users">,
	"users"
>["body"][number]

export type PrimordialRole = SelfUser["primordialRole"];

export const primordialRoles: TuplifyUnion<PrimordialRole> = [
	"CUSTOMER",
	"MODERATOR",
	"CONTENTS_MASTER",
	"ADMIN",
];

export type Notifications = GetResponseByInfo<
	GetDef<"GET", "/product-notifications">,
	"notifications"
>["body"][number];

export type FullNotification = GetResponseByInfo<
	GetDef<"GET", "/user/notifications">,
	"userNotifications"
>["body"][number];

export type FullProductSheet = GetResponseByInfo<
    GetDef<"GET", "/full-product-sheets">,
    "fullProductSheets"
>["body"][number];

export type Category = GetResponseByInfo<
  GetDef<"GET", "/categories">,
  "categories"
>["body"][number];

export type ParentCategory = GetResponseByInfo<
  GetDef<"GET", "/parent-categories">,
  "parentCategories"
>["body"][number];

export type Newsletter = GetResponseByInfo<
  GetDef<"GET", "/newsletters">,
  "newsletters"
>["body"][number];

export type OrganizationUser = GetResponseByInfo<
  GetDef<"GET", "/organization/{organizationId}/users">,
  "organization.users"
>["body"][number];

export type OrganizationRole = OrganizationUser["organizationRole"];

export const organizationRoles: TuplifyUnion<OrganizationRole> = [
	"STORE_KEEPER",
	"PRODUCT_SHEET_MANAGER",
	"ACCOUNTANT",
	"OWNER"
];

export type Warehouse = GetResponseByInfo<
	GetDef<"GET", "/organization/{organizationId}/warehouses">,
	"warehouses.found"
>["body"][number];

export type NavigationItem = GetResponseByInfo<
	GetDef<"GET", "/navigation-items">,
	"navigationItems"
>["body"][number];


export type NavigationItemType = NavigationItem["type"];

export const navigationItemType: TuplifyUnion<NavigationItemType> = [
	"PARENT_CATEGORY",
	"CATEGORY",
	"LINK"
];

export type Product = GetResponseByInfo<
	GetDef<"GET", "/organization/{organizationId}/products">,
	"products.found"
>["body"][number]

export type Promotion = GetResponseByInfo<
	GetDef<"GET", "/organization/{organizationId}/promotions">,
	"organization.promotions"
>["body"][number]

export type ProductStatus = Product["status"]

export const productStatus: TuplifyUnion<ProductStatus> = ["WRONG", "SOLD", "IN_STOCK"];

export type ProductSheet = GetResponseByInfo<
	GetDef<"GET", "/organization/{organizationId}/product-sheets">,
	"productSheets.found"
>["body"][number]

export type NavigationBar = GetResponseByInfo<
	GetDef<"GET", "/navigation-bar">,
	"navigationBar"
>["body"]

export type Facet = GetResponseByInfo<
	GetDef<"GET", "/product-sheet/{productSheetId}/facets">,
	"productSheet.facets"
>["body"][number]

export type FacetType = Facet["type"];

export const facetType: TuplifyUnion<FacetType> = [
	"ACCESSORY",
	"COLOR",
	"SIZE",
	"DIAMETER",
	"TARGET",
	"MATERIAL",
	"STIMULATION",
];

export type Cart = GetResponseByInfo<
	GetDef<"GET", "/cart">,
	"cart.fetched"
>["body"]

export type Command = GetResponseByInfo<
	GetDef<"GET", "/commands">,
	"userCommands"
>["body"][number]

export type CommandStatus = Command["status"];

export const commandStatus: TuplifyUnion<CommandStatus> = [
	"DONE", 
	"CANCELED", 
	"WAITING_PAYMENT", 
	"IN_PROGRESS", 
	"IN_DELIVERY"
];

export type FullCommand = GetResponseByInfo<
	GetDef<"GET", "/commands/{commandId}">,
	"command.found"
>["body"]

export type ComputedFilter = GetResponseByInfo<
GetDef<"GET", "/computed-filters">,
"filters"
>["body"][number]

export type QueryFilters = Exclude<
	GetDef<"GET", "/computed-filters">["parameters"]["query"], 
	undefined
>

export type OrganizationCommandCollection = GetResponseByInfo<
	GetDef<"GET", "/organization/{organizationId}/commands">,
	"organizationCommandCollection"
>["body"]

export type OrganizationCommandDetailes = GetResponseByInfo<
	GetDef<"GET", "/organization/{organizationId}/commands/{commandId}/details">,
	"organizationCommandDetailes"
>["body"]

export type Bundle = GetResponseByInfo<
	GetDef<"GET", "/bundles/{bundleId}">,
	"bundle"
>["body"]

export type BundleCollection = GetResponseByInfo<
	GetDef<"GET", "/commands/{commandId}/bundles">,
	"bundles.found"
>["body"]

export type CarrierName = Bundle["carrierName"]

export type ProductReturn = GetResponseByInfo<
	GetDef<"GET",  "/organization/{organizationId}/product-returns">,
	"productReturns"
>["body"][number]

export type ProductStockStory = GetResponseByInfo<
	GetDef<"GET", "/product-sheet/{productSheetId}/stock-story">,
	"product.stockStory"
>["body"]

export type ProductSheetReview = GetResponseByInfo<
	GetDef<"GET",  "/product-sheet/{productSheetId}/reviews">,
	"productSheetReviews"
>["body"][number]

export type WidgetStat = GetResponseByInfo<
	GetDef<"GET", "/organization/{organizationId}/grid">,
	"gridStatCommand.found"
>["body"][number]

export type WidgetParam = WidgetStat["params"];

export type WidgetResult = GetResponseByInfo<
	GetDef<"POST", "/organization/{organizationId}/make-stat">,
	"widget.found"
>["body"]

export const widgetType: TuplifyUnion<WidgetParam["type"]> = [
	"line",
	"bar",
	"pie",
	"donut",
	"area",
	"top",
	"value"
];

export type Facets = GetResponseByInfo<
	GetDef<"GET", "/organization/{organizationId}/facets">,
	"productSheet.facets"
>["body"][number]
