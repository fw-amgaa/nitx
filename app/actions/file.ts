"use server";

import { revalidatePath } from "next/cache";
import { db } from "../db/client";
import { files } from "../db/schema";
import { eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export type TFile = Awaited<ReturnType<typeof filesList>>["data"][number];

export async function filesList() {
  const files = (await db.query.files.findMany()).toSorted(
    (a, b) =>
      new Date(b.uploadedAt).valueOf() - new Date(a.uploadedAt).valueOf()
  );

  return { data: files, total: files.length };
}

export async function uploadFile(file: Omit<TFile, "id">) {
  const response = await db.insert(files).values(file).returning();

  if (!response || response.length === 0) {
    return { data: null, error: "Файл бичилт дээр алдаа гарлаа" };
  }

  revalidatePath("/files");
  revalidatePath("/(dashboard)/files");
  return { data: response[0], error: null };
}

export async function deleteFile(id: number) {
  if (!id || isNaN(id)) {
    return { data: null, error: "ID буруу байна." };
  }

  const file = await db.query.files.findFirst({
    where: eq(files.id, id),
  });

  if (!file) {
    return { data: null, error: "Файл олдсонгүй." };
  }

  try {
    await utapi.deleteFiles(file.url.split("/").pop() || "");
    await db.delete(files).where(eq(files.id, id));
    revalidatePath("/files");

    return { data: file, error: null };
  } catch {
    return { data: null, error: "Файл устгахад алдаа гарлаа." };
  }
}
