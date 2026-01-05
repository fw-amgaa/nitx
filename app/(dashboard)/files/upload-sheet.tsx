"use client";

import { uploadFile } from "@/app/actions/file";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UploadButton } from "@/lib/upload-thing";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

export function UploadFile() {
  const [open, setOpen] = React.useState(false);
  const [file, setFile] = React.useState({
    name: "",
    url: "",
    size: "",
    key: "",
  });
  const [nitxCode, setNitxCode] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    if (!file.key) {
      toast.error("Файл оруулаагүй байна.");
      return;
    }

    if (!nitxCode) {
      toast.error("Тогтоолын дугаар оруулна уу.");
      return;
    }

    setLoading(true);
    const { error } = await uploadFile({
      name: file.name,
      url: file.url,
      size: file.size,
      key: file.key,
      nitxCode,
      uploadedAt: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setLoading(false);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success("Файл амжилттай хадгаллаа!");
    setFile({ name: "", url: "", size: "", key: "" });
    setNitxCode("");
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size={"sm"}>
          <PlusIcon /> Файл оруулах
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Файл оруулах</SheetTitle>
          <SheetDescription>
            Файл оруулахдаа тогтоолын дугаарыг заавал оруулна уу.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label>Тогтоолын дугаар</Label>
            <Input
              value={nitxCode}
              onChange={(e) => setNitxCode(e.target.value)}
              placeholder="Тогтоолын дугаар"
            />
          </div>
          <div className="grid gap-3">
            <Label>Файл</Label>
            {file.key ? (
              <Input disabled readOnly value={file.name} />
            ) : (
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res?.[0]) {
                    setFile({
                      name: res[0].name,
                      url: res[0].ufsUrl,
                      size: res[0].size.toString(),
                      key: res[0].key,
                    });

                    toast.success("Файл амжилттай орууллаа!");
                    return;
                  }

                  toast.error("Файл оруулахад алдаа гарлаа.");
                }}
                onUploadError={(error: Error) => {
                  toast.error(`ERROR! ${error.message}`);
                }}
              />
            )}
          </div>
          {file.key && (
            <>
              <div className="grid gap-3">
                <Label>Хэмжээ</Label>
                <Input
                  disabled
                  readOnly
                  value={file.size}
                  placeholder="Хэмжээ"
                />
              </div>
              <div className="grid gap-3">
                <Label>Link</Label>
                <Link href={file.url} target="_blank" rel="noreferrer">
                  <Input
                    disabled
                    readOnly
                    value={file.url}
                    placeholder="Link"
                  />
                </Link>
              </div>

              <Button
                size={"sm"}
                variant="outline"
                onClick={() => {
                  setFile({ name: "", url: "", size: "", key: "" });
                }}
              >
                Файл устгах
              </Button>
            </>
          )}
        </div>
        <SheetFooter>
          <Button disabled={loading} onClick={handleSubmit}>
            {loading ? "Хадгалж байна..." : "Хадгалах"}
          </Button>
          <SheetClose asChild>
            <Button variant="outline">Хаах</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
