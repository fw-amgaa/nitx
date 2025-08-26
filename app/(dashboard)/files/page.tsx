import { filesList } from "@/app/actions/file";
import { FilesTable } from "./files-table";

export default async function Page() {
  const { data } = await filesList();

  return <FilesTable data={data} totalCount={data.length} />;
}
