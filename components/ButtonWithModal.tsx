"use client";

import { useModalFlow } from "./ModalFlow";

interface ButtonWithModalProps {
  children: React.ReactNode;
  className?: string;
}

export function ButtonWithModal({ children, className }: ButtonWithModalProps) {
  const { openModal } = useModalFlow();

  return (
    <button onClick={openModal} className={className}>
      {children}
    </button>
  );
}
