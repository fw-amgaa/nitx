"use client";

import { deleteAllAward } from "@/app/actions/award";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IconTrash } from "@tabler/icons-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function DeleteAllAwardDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteAllAward();
        toast.success("Амжилттай устгалаа.");
        setOpen(false);
      } catch {
        toast.error("Устгах үед алдаа гарлаа.");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"sm"} variant="destructive">
          <IconTrash />
          <span>Бүх тогтоолыг устгах</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Та итгэлтэй байна уу?</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-muted-foreground">
          Бүх мэдээллийг бүр мөсөн устгах болно. Дахин сэргээх боломжгүй.
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Цуцлах
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Устгаж байна..." : "Устгах"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
