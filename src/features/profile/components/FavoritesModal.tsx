import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FavoritesTable } from "./FavoritesTable";

interface FavoritesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FavoritesModal({ open, onOpenChange }: FavoritesModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-bangers text-xl">My Favorites ❤️</DialogTitle>
        </DialogHeader>
        <FavoritesTable />
      </DialogContent>
    </Dialog>
  );
}
