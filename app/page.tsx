import { AppSidebar } from "@/components/app-sidebar";
import { DataTable } from "@/components/data-table";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { awardsList } from "./actions/query";
import { PER_PAGE_DEFAULT } from "@/lib/constants";
import { SearchParams, searchParamsCache } from "@/lib/search-params";

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

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <DataTable data={data} totalCount={total} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
