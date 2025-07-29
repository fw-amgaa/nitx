"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";

import { IconCirclePlusFilled } from "@tabler/icons-react";
import { toast } from "sonner";
import { uploadAwards, UploadAwardsInput } from "@/app/actions/upload";
import { SidebarMenuButton } from "./ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";

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
      const res = await uploadAwards(fileData);
      if (res.success) {
        toast.success(res.message);
        setOpen(false);
        setFileData([]);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
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
      <DialogContent className="max-w-md">
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
          <p className="text-sm text-muted-foreground">Уншиж байна...</p>
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

// --- Excel parsing utility
async function parseExcel(file: File): Promise<UploadAwardsInput[]> {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const json: Record<string, string | number>[] =
    XLSX.utils.sheet_to_json(sheet);

  const parsed: UploadAwardsInput[] = json.map((row) => ({
    lastName: String(row["Овог"] || ""),
    firstName: String(row["Нэр"] || ""),
    register: String(row["Регистрийн дугаар"] || ""),
    awardName: String(row["Нэр дэвшиж буй шагналын нэр"] || ""),
    nitxCode: String(row["НИТХ-ын тогтоолын дугаар"] || "").slice(0, 3),
    date: String(row["Огноо"] || ""),
    status: String(row["Төлөв"] || ""),
  }));

  return parsed;
}
