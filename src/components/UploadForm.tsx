"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { DOCUMENT_CATEGORIES } from "@/lib/constants";
import { uploadDocument } from "@/app/admin/actions";

type UploadLabels = {
  title: string;
  titlePlaceholder: string;
  category: string;
  year: string;
  file: string;
  uploading: string;
  submit: string;
  failed: string;
};

function SubmitButton({ labels }: { labels: UploadLabels }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-brand-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:opacity-60"
    >
      {pending ? labels.uploading : labels.submit}
    </button>
  );
}

export function UploadForm({
  ownerId,
  labels,
  categories,
}: {
  ownerId: string;
  labels: UploadLabels;
  categories: Record<string, string>;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);

  async function action(formData: FormData) {
    setError(null);
    try {
      await uploadDocument(formData);
      formRef.current?.reset();
    } catch (e) {
      setError(e instanceof Error ? e.message : labels.failed);
    }
  }

  return (
    <form
      ref={formRef}
      action={action}
      className="border border-slate-200 bg-white p-6 "
    >
      <input type="hidden" name="ownerId" value={ownerId} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            {labels.title}
          </label>
          <input
            name="title"
            required
            placeholder={labels.titlePlaceholder}
            className="w-full border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            {labels.category}
          </label>
          <div className="relative">
            <select
              name="category"
              defaultValue="Tax Return"
              className="w-full appearance-none border border-slate-300 bg-white px-3 py-2 pr-10 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {DOCUMENT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {categories[c] ?? c}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            {labels.year}
          </label>
          <input
            name="year"
            type="number"
            min="1990"
            max="2100"
            placeholder="2024"
            className="w-full border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            {labels.file}
          </label>
          <input
            name="file"
            type="file"
            required
            className="w-full border border-slate-300 px-3 py-2 text-sm file:mr-3 file:border-0 file:bg-brand-50 file:px-3 file:py-1 file:text-sm file:font-medium file:text-brand-700"
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-5">
        <SubmitButton labels={labels} />
      </div>
    </form>
  );
}
