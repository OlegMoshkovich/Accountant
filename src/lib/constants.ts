export const FIRM_NAME =
  process.env.NEXT_PUBLIC_FIRM_NAME ?? "VOM HAU – Treuhand GmbH";

export const DOCUMENT_CATEGORIES = [
  "Tax Return",
  "Annual Report",
  "VAT Filing",
  "Payroll",
  "Invoice",
  "Correspondence",
  "Other",
] as const;

export type DocumentCategory = (typeof DOCUMENT_CATEGORIES)[number];
