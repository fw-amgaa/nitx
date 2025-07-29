"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { db } from "../db/client";
import { awards } from "../db/schema";

export type UploadAwardsInput = {
  firstName: string;
  lastName: string;
  register: string;
  awardName: string;
  nitxCode: string;
  date: string;
  status: string;
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

    const validData = data.filter(
      (row) =>
        row.firstName &&
        row.lastName &&
        row.register &&
        row.awardName &&
        row.nitxCode &&
        row.date &&
        row.status
    );

    if (validData.length === 0) {
      return {
        success: false,
        message: "Хоосон эсвэл бүрэн бус мөр байна. Шалгана уу.",
      };
    }

    await db.insert(awards).values(validData);

    revalidateTag("awards");

    return {
      success: true,
      insertedCount: validData.length,
      message: `${validData.length} мөр амжилттай хадгалагдлаа.`,
    };
  } catch (err) {
    console.error("❌ Шагналын өгөгдөл хадгалах үед алдаа гарлаа:", err);
    return {
      success: false,
      message: "Өгөгдөл хадгалах үед алдаа гарлаа. Та дахин оролдоно уу.",
    };
  }
}
