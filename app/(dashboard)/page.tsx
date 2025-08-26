import { DataTable } from "@/components/data-table";
import { PER_PAGE_DEFAULT } from "@/lib/constants";
import { SearchParams, searchParamsCache } from "@/lib/search-params";
import { awardsList } from "../actions/award";

interface Props {
  searchParams: Promise<SearchParams>;
}

export default async function Page({ searchParams }: Props) {
  const search = await searchParamsCache.parse(searchParams);

  const { data, total } = await awardsList({
    page: search?.page ? Number(search.page) : 1,
    perPage: search?.perPage ? Number(search.perPage) : PER_PAGE_DEFAULT,
    firstName: search?.firstName as string | undefined,
    lastName: search?.lastName as string | undefined,
    register: search?.register as string | undefined,
    awardName: search?.awardName as string | undefined,
  });

  return <DataTable data={data} totalCount={total} />;
}
