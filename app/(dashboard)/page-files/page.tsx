import { pageFilesList } from "@/app/actions/page-file";
import { PageFilesTable } from "./page-files-table";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { data } = await pageFilesList();

  return (
    <Suspense>
      <PageFilesTable data={data} totalCount={data.length} />
    </Suspense>
  );
}
