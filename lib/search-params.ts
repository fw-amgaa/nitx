import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";
import { PER_PAGE_DEFAULT } from "./constants";

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(PER_PAGE_DEFAULT),
  firstName: parseAsString.withDefault(""),
  lastName: parseAsString.withDefault(""),
  register: parseAsString.withDefault(""),
  awardName: parseAsString.withDefault(""),
});

export type GetFilters = Awaited<ReturnType<typeof searchParamsCache.parse>>;
