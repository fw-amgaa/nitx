"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";

import { uploadAwards, UploadAwardsInput } from "@/app/actions/upload";
import { IconCirclePlusFilled } from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { SidebarMenuButton } from "./ui/sidebar";
import { cn } from "@/lib/utils";

export default function UploadAwardsDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileData, setFileData] = useState<UploadAwardsInput[]>([]);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const parsed = await parseExcel(file);
      setFileData(parsed);
      toast.success(`${parsed.length} мөр уншигдлаа.`);
    } catch (err) {
      console.error(err);
      toast.error("Excel файл уншихад алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload() {
    setLoading(true);
    try {
      const chunks = chunkArray(fileData, 500);

      for (let i = 0; i < chunks.length; i++) {
        const res = await uploadAwards(chunks[i]);

        if (!res.success) {
          toast.error(`Batch ${i + 1}/${chunks.length} failed: ${res.message}`);
          return;
        }
      }

      toast.success("Бүх өгөгдөл амжилттай илгээгдлээ.");
      setOpen(false);
      setFileData([]);
    } catch (err) {
      console.error(err);
      toast.error("Өгөгдөл илгээх үед алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SidebarMenuButton
          tooltip="Quick Create"
          className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
        >
          <IconCirclePlusFilled />
          <span>Шагнал оруулах</span>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent
        onPointerDownOutside={loading ? (e) => e.preventDefault() : undefined}
        onEscapeKeyDown={loading ? (e) => e.preventDefault() : undefined}
        className={cn("max-w-md", loading && "[&>button]:hidden")}
      >
        <DialogHeader>
          <DialogTitle>Excel файл оруулах</DialogTitle>
        </DialogHeader>

        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="file-input border rounded-md w-full p-4"
        />

        {loading && (
          <p className="text-sm text-muted-foreground">
            Мэдээлэл хадгалж байх үед энэ цонхыг хааж болохгүйг анхаарна уу!
          </p>
        )}

        {fileData.length > 0 && (
          <div className="text-sm text-muted-foreground">
            <p>
              Нийт мөр: <span className="font-medium">{fileData.length}</span>
            </p>
            <Button onClick={handleUpload} disabled={loading} className="mt-4">
              {loading ? "Хадгалж байна..." : "Мэдээлэл хадгалах"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

async function parseExcel(file: File): Promise<UploadAwardsInput[]> {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const json = XLSX.utils.sheet_to_json<Record<string, string | number>>(
    sheet,
    {
      range: 2,
      defval: "",
    }
  );

  const parsed: UploadAwardsInput[] = json.map((row) => ({
    lastName: String(row["Овог"] || ""),
    firstName: String(row["Нэр"] || ""),
    register: String(row["Регистрийн дугаар"] || ""),
    awardName: String(row["Ямар шагналд тодорхойлогдсон"] || ""),
    nitxCode: String(row["Тогтоолын дугаар"] || ""),
    date: String(row["НИТХ-ын Тогтоолын огноо"] || ""),
    awardOrder: String(
      row["Хавсралт дахь Цол, одон, медалийн дугаарлалт"] || ""
    ),
    pageNumber: String(
      row["Хавсралтад орсон нэртэй хэсгийн хуудасны дугаар"] || ""
    ),
    status: String(row["Төлөв"] || ""),
    awardedDate: String(row["Шагнагдсан огноо"] || ""),
    medalNumber: String(row["Одон медалийн дугаар"] || ""),
    details: String(row["Шагнагдсан мэдээлэл"] || ""),
  }));

  return parsed;
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
