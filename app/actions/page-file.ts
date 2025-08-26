"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";
import { db } from "../db/client";
import { pageFiles } from "../db/schema";

const utapi = new UTApi();

export type TPageFile = Awaited<
  ReturnType<typeof pageFilesList>
>["data"][number];

export async function pageFilesList() {
  const files = (await db.query.pageFiles.findMany()).toSorted(
    (a, b) =>
      new Date(b.uploadedAt).valueOf() - new Date(a.uploadedAt).valueOf()
  );

  return { data: files, total: files.length };
}

export async function uploadPageFile(file: Omit<TPageFile, "id">) {
  const response = await db.insert(pageFiles).values(file).returning();

  if (!response || response.length === 0) {
    return { data: null, error: "Файл бичилт дээр алдаа гарлаа" };
  }

  revalidatePath("/page-files");
  return { data: response[0], error: null };
}

export async function deletePageFile(id: number) {
  if (!id || isNaN(id)) {
    return { data: null, error: "ID буруу байна." };
  }

  const file = await db.query.pageFiles.findFirst({
    where: eq(pageFiles.id, id),
  });

  if (!file) {
    return { data: null, error: "Файл олдсонгүй." };
  }

  try {
    await utapi.deleteFiles(file.url.split("/").pop() || "");
    await db.delete(pageFiles).where(eq(pageFiles.id, id));
    revalidatePath("/page-files");

    return { data: file, error: null };
  } catch {
    return { data: null, error: "Файл устгахад алдаа гарлаа." };
  }
}
