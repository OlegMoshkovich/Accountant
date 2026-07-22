"use client";

import { useTransition } from "react";
import { deleteDocument } from "@/app/admin/actions";

export function DeleteDocButton({ documentId }: { documentId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        if (!confirm("Dieses Dokument wirklich löschen?")) return;
        startTransition(() => deleteDocument(documentId));
      }}
      disabled={pending}
      className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-700 disabled:opacity-60"
    >
      {pending ? "…" : "Löschen"}
    </button>
  );
}
