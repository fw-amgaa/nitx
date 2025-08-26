"use client";

import { deleteFile } from "@/app/actions/file";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { IconTrash } from "@tabler/icons-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function DeleteFileDialog({ id }: { id: number }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const { error } = await deleteFile(id);

        if (error) {
          toast.error(error);
          return;
        }

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
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          variant="destructive"
        >
          <IconTrash className="mr-2 h-4 w-4" />
          <span>Устгах</span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Та итгэлтэй байна уу?</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-muted-foreground">
          Энэ мэдээллийг бүр мөсөн устгах болно.
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
