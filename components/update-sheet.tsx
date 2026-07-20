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
import { Label } from "@/components/ui/label";
import { useId, useState } from "react";
import { toast } from "sonner";
import { TAward, updateAward } from "@/app/actions/award";
import { DropdownMenuItem } from "./ui/dropdown-menu";

// Огноог DB-д "2026.06.22" хэлбэрээр хадгална.
// <input type="date"> нь "2026-06-22" хэлбэр шаарддаг тул хооронд нь хөрвүүлнэ.
const toInputDate = (value: string | null) => {
  const match = (value ?? "").trim().match(/^(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})$/);
  if (!match) return "";
  const [, year, month, day] = match;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

const fromInputDate = (value: string) => value.replaceAll("-", ".");

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "date";
}) {
  const id = useId();

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

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
    <Sheet
      open={open}
      onOpenChange={(next) => {
        // Sheet-ийг дахин нээхэд хамгийн сүүлийн утгыг харуулна.
        if (next) setForm(award);
        setOpen(next);
      }}
    >
      <SheetTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Засах
        </DropdownMenuItem>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Шагнал засах</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 px-4 pb-6">
          <Field
            label="Овог"
            value={form.lastName}
            onChange={(v) => onChange("lastName", v)}
          />
          <Field
            label="Нэр"
            value={form.firstName}
            onChange={(v) => onChange("firstName", v)}
          />
          <Field
            label="Регистрийн дугаар"
            value={form.register}
            onChange={(v) => onChange("register", v)}
          />
          <Field
            label="Ямар шагналд тодорхойлогдсон"
            value={form.awardName}
            onChange={(v) => onChange("awardName", v)}
          />
          <Field
            label="НИТХ-ын Тогтоолын огноо"
            type="date"
            value={toInputDate(form.date)}
            onChange={(v) => onChange("date", fromInputDate(v))}
          />
          <Field
            label="НИТХ-ын тогтоолын дугаар"
            value={form.nitxCode}
            onChange={(v) => onChange("nitxCode", v)}
          />
          <Field
            label="Цол, одон, медалийн дугаарлалт"
            value={form.awardOrder ?? ""}
            onChange={(v) => onChange("awardOrder", v)}
          />
          <Field
            label="Хуудасны дугаар"
            value={form.pageNumber ?? ""}
            onChange={(v) => onChange("pageNumber", v)}
          />
          <Field
            label="Төлөв"
            value={form.status}
            onChange={(v) => onChange("status", v)}
          />
          <Field
            label="Шагнагдсан огноо"
            type="date"
            value={toInputDate(form.awardedDate)}
            onChange={(v) => onChange("awardedDate", fromInputDate(v))}
          />
          <Field
            label="Одон медалийн дугаар"
            value={form.medalNumber ?? ""}
            onChange={(v) => onChange("medalNumber", v)}
          />
          <Field
            label="Шагнагдсан мэдээлэл"
            value={form.details ?? ""}
            onChange={(v) => onChange("details", v)}
          />
          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? "Шинэчилж байна..." : "Шинэчлэх"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
