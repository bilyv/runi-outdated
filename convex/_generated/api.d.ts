/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as customers from "../customers.js";
import type * as dashboard from "../dashboard.js";
import type * as expenses from "../expenses.js";
import type * as http from "../http.js";
import type * as products from "../products.js";
import type * as router from "../router.js";
import type * as sales from "../sales.js";
import type * as settings from "../settings.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  customers: typeof customers;
  dashboard: typeof dashboard;
  expenses: typeof expenses;
  http: typeof http;
  products: typeof products;
  router: typeof router;
  sales: typeof sales;
  settings: typeof settings;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
