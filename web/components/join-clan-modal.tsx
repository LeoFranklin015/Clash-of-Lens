"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface JoinClanModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAccept: () => void;
  clanName: string;
}

export function JoinClanModal({
  isOpen,
  onOpenChange,
  onAccept,
  clanName,
}: JoinClanModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black border-[#a3ff12] text-white">
        <DialogHeader>
          <DialogTitle className="text-[#a3ff12]">Join {clanName}?</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-gray-300">
          Do you want to join this clan?
        </DialogDescription>
        <DialogFooter className="gap-2 sm:justify-end">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="border-[#a3ff12] text-[#a3ff12] hover:bg-[#a3ff12] hover:bg-opacity-10"
            >
              Reject
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={onAccept}
            className="bg-[#a3ff12] text-black font-bold hover:bg-opacity-90"
          >
            Accept
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
