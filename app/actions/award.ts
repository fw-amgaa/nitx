"use server";

import { and, count, eq, ilike } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { db } from "../db/client";
import { awards } from "../db/schema";
import { unstable_cache } from "@/lib/unstable-cache";

interface UpdateAwardParams {
  id: number;
  firstName: string;
  lastName: string;
  register: string;
  awardName: string;
  pageNumber: string | null;
  nitxCode: string;
  date: string;
  status: string;
}

interface AwardFilters {
  perPage?: number;
  page?: number;
  firstName?: string;
  lastName?: string;
  register?: string;
  awardName?: string;
}

export type TAward = Awaited<ReturnType<typeof awardsList>>["data"][number];

export const awardsList = async (filters: AwardFilters) => {
  return await unstable_cache(
    async () => {
      const whereConditions = [];

      if (filters.firstName) {
        whereConditions.push(ilike(awards.firstName, `%${filters.firstName}%`));
      }

      if (filters.lastName) {
        whereConditions.push(ilike(awards.lastName, `%${filters.lastName}%`));
      }

      if (filters.register) {
        whereConditions.push(ilike(awards.register, `%${filters.register}%`));
      }

      if (filters.awardName) {
        whereConditions.push(ilike(awards.awardName, `%${filters.awardName}%`));
      }

      const where = whereConditions.length
        ? and(...whereConditions)
        : undefined;

      const total = await db
        .select({ count: count() })
        .from(awards)
        .where(where)
        .then((res) => Number(res[0]?.count ?? 0));

      const perPage = filters.perPage ?? 10;
      const page = filters.page ?? 1;
      const offset = (page - 1) * perPage;

      const results = await db.query.awards.findMany({
        where,
        limit: perPage,
        offset,
        orderBy: (awards, { desc }) => [desc(awards.id)],
      });

      const allFiles = await db.query.files.findMany();
      const allPageFiles = await db.query.pageFiles.findMany();

      results.forEach((award) => {
        const file = allFiles.find((file) => file.nitxCode === award.nitxCode);
        const pageFile = allPageFiles.find(
          (file) => file.pageNumber === award.pageNumber
        );

        if (file) award.url = file.url;
        if (pageFile) award.pageNumber = pageFile.url;
      });

      return {
        data: results,
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      };
    },
    [JSON.stringify(filters)],
    { revalidate: 3600, tags: ["awards"] }
  )();
};

export async function deleteAward(id: number) {
  if (!id || isNaN(id)) {
    throw new Error("ID буруу байна.");
  }

  try {
    await db.delete(awards).where(eq(awards.id, id));
    revalidateTag("awards");
  } catch (error) {
    console.error("❌ Устгах үед алдаа:", error);
    throw new Error("Устгах үед алдаа гарлаа.");
  }
}

export async function updateAward(data: UpdateAwardParams) {
  try {
    await db
      .update(awards)
      .set({
        firstName: data.firstName,
        lastName: data.lastName,
        register: data.register,
        awardName: data.awardName,
        pageNumber: data.pageNumber,
        nitxCode: data.nitxCode,
        date: data.date,
        status: data.status,
      })
      .where(eq(awards.id, data.id));

    revalidateTag("awards");
    return { success: true, message: "Амжилттай шинэчиллээ." };
  } catch {
    return { success: false, message: "Алдаа гарлаа. Дахин оролдоно уу." };
  }
}
