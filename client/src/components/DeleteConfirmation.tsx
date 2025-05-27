import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isLoading?: boolean;
}

export default function DeleteConfirmation({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isLoading = false,
}: DeleteConfirmationProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
          <p className="text-slate-600 mb-6">{description}</p>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
