import { filesList } from "@/app/actions/file";
import { FilesTable } from "./files-table";
import { Suspense } from "react";

export default async function Page() {
  const { data } = await filesList();

  return (
    <Suspense>
      <FilesTable data={data} totalCount={data.length} />
    </Suspense>
  );
}
