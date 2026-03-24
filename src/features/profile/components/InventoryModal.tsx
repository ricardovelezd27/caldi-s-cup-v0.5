import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InventoryTable } from "./InventoryTable";

interface InventoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InventoryModal({ open, onOpenChange }: InventoryModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-bangers text-xl">My Inventory 📦</DialogTitle>
        </DialogHeader>
        <InventoryTable />
      </DialogContent>
    </Dialog>
  );
}
