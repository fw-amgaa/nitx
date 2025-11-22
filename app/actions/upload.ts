"use server";

import { revalidateTag } from "next/cache";
import { db } from "../db/client";
import { awards } from "../db/schema";

const BATCH_SIZE = 500;

export type UploadAwardsInput = {
  firstName: string;
  lastName: string;
  register: string;
  awardName: string;
  nitxCode: string;
  date: string;
  status: string;
  awardOrder?: string;
  awardedDate?: string;
  medalNumber?: string;
  pageNumber?: string;
  details?: string;
  url?: string;
};

export type UploadAwardsResult =
  | {
    success: true;
    insertedCount: number;
    message: string;
  }
  | {
    success: false;
    message: string;
  };

export async function uploadAwards(
  data: UploadAwardsInput[]
): Promise<UploadAwardsResult> {
  try {
    if (!Array.isArray(data)) {
      return {
        success: false,
        message: "Илгээсэн өгөгдөл буруу байна.",
      };
    }

    if (data.length === 0) {
      return {
        success: false,
        message: "Хоосон эсвэл бүрэн бус мөр байна. Шалгана уу.",
      };
    }

    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      const chunk = data.slice(i, i + BATCH_SIZE);
      await db.insert(awards).values(chunk);
    }

    revalidateTag("awards", 'max');

    return {
      success: true,
      insertedCount: data.length,
      message: `${data.length} мөр амжилттай хадгалагдлаа.`,
    };
  } catch (err) {
    console.error("❌ Шагналын өгөгдөл хадгалах үед алдаа гарлаа:", err);
    return {
      success: false,
      message: "Өгөгдөл хадгалах үед алдаа гарлаа. Та дахин оролдоно уу.",
    };
  }
}
