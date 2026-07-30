"use client";

import { Button } from "@/components/ui/Button";

export default function ConfirmDeleteForm({
  action,
  confirmMessage,
  label,
  className,
}: {
  action: (formData: FormData) => Promise<void>;
  confirmMessage: string;
  label: string;
  className?: string;
}) {
  return (
    <form
      action={action}
      className={className}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    >
      <Button type="submit" variant="danger">
        {label}
      </Button>
    </form>
  );
}
