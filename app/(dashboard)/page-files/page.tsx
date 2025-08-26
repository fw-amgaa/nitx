import { pageFilesList } from "@/app/actions/page-file";
import { PageFilesTable } from "./page-files-table";

export default async function Page() {
  const { data } = await pageFilesList();

  return <PageFilesTable data={data} totalCount={data.length} />;
}
