"use client";

import { useState, useEffect } from "react";
import { WaitlistConfirmationModal } from "./waitlist-confirmation-modal";

interface WaitlistConfirmationTriggerProps {
  waitlisted: boolean;
  alreadyOnList?: boolean;
}

export function WaitlistConfirmationTrigger({ waitlisted, alreadyOnList = false }: WaitlistConfirmationTriggerProps) {
  const [open, setOpen] = useState(waitlisted);

  useEffect(() => {
    if (waitlisted) setOpen(true);
  }, [waitlisted]);

  return <WaitlistConfirmationModal open={open} onClose={() => setOpen(false)} alreadyOnList={alreadyOnList} />;
}
