"use client";

import { filesList, TFile } from "@/app/actions/file";
import { uploadPageFile } from "@/app/actions/page-file";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";
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
  const [pageNumber, setPageNumber] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [options, setOptions] = React.useState<TFile[]>([]);

  const handleSubmit = async () => {
    if (!file.key) {
      toast.error("Файл оруулаагүй байна.");
      return;
    }

    if (!pageNumber) {
      toast.error("Хуудасны дугаар оруулна уу.");
      return;
    }

    setLoading(true);
    const { error } = await uploadPageFile({
      name: file.name,
      url: file.url,
      size: file.size,
      key: file.key,
      pageNumber,
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
    setPageNumber("");
    setOpen(false);
  };

  useEffect(() => {
    (async () => {
      const files = await filesList();
      setOptions(files.data);
    })();
  }, []);

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
            Файл оруулахдаа хуудасны дугаарыг заавал оруулна уу.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label>Тогтоол</Label>
            <Select onValueChange={(value) => setNitxCode(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Тогтоол сонгох" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Тогтоолууд</SelectLabel>
                  {options.map((option) => (
                    <SelectItem key={option.id} value={option.nitxCode}>
                      {option.nitxCode}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-3">
            <Label>Хуудасны дугаар</Label>
            <Input
              value={pageNumber}
              onChange={(e) => setPageNumber(e.target.value)}
              placeholder="Хуудасны дугаар"
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
