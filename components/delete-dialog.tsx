"use client";

import { useTransition, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { IconTrash } from "@tabler/icons-react";
import { toast } from "sonner";
import { deleteAward } from "@/app/actions/query";

export function DeleteAwardDialog({ id }: { id: number }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteAward(id);
        toast.success("Амжилттай устгалаа.");
        setOpen(false);
        // Optionally: trigger a refresh here if you're using SWR or useRouter().refresh()
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
