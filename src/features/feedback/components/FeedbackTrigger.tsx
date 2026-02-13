import { useState, type ReactNode } from "react";
import { FeedbackDialog } from "./FeedbackDialog";

interface FeedbackTriggerProps {
  children: (open: () => void) => ReactNode;
}

export const FeedbackTrigger = ({ children }: FeedbackTriggerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {children(() => setIsOpen(true))}
      <FeedbackDialog open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
};
