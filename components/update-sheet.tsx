"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { TAward, updateAward } from "@/app/actions/award";
import { DropdownMenuItem } from "./ui/dropdown-menu";

export function UpdateAwardSheet({ award }: { award: TAward }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(award);
  const [loading, setLoading] = useState(false);

  const onChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const res = await updateAward(form);
    setLoading(false);

    if (res.success) {
      toast.success(res.message);
      setOpen(false);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Засах
        </DropdownMenuItem>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Шагнал засах</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-4 p-4">
          <Input
            value={form.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            placeholder="Овог"
          />
          <Input
            value={form.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            placeholder="Нэр"
          />
          <Input
            value={form.register}
            onChange={(e) => onChange("register", e.target.value)}
            placeholder="Регистр"
          />
          <Input
            value={form.awardName}
            onChange={(e) => onChange("awardName", e.target.value)}
            placeholder="Шагналын нэр"
          />
          <Input
            value={form.nitxCode}
            onChange={(e) => onChange("nitxCode", e.target.value)}
            placeholder="НИТХ дугаар"
          />
          <Input
            value={form.pageNumber || ""}
            onChange={(e) => onChange("pageNumber", e.target.value)}
            placeholder="Хуудасны дугаар"
          />
          <Input
            value={form.date}
            onChange={(e) => onChange("date", e.target.value)}
            placeholder="Огноо"
          />
          <Input
            value={form.status}
            onChange={(e) => onChange("status", e.target.value)}
            placeholder="Төлөв"
          />
          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? "Шинэчилж байна..." : "Шинэчлэх"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
