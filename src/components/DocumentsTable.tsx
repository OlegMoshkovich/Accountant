"use client";

import { useCallback, useEffect, useState } from "react";
import { DeleteDocButton } from "@/components/DeleteDocButton";
import type { Locale } from "@/lib/i18n/dictionaries";

export type DocumentListItem = {
  id: string;
  title: string;
  category: string;
  year: number | null;
  file_name: string | null;
  size_bytes?: number | null;
  created_at: string;
};

type Labels = {
  colDocument: string;
  colCategory: string;
  colYear: string;
  colDate: string;
  colAction: string;
  download: string;
  preview: string;
  close: string;
  loading: string;
  unsupported: string;
  openInNewTab: string;
};

function formatBytes(bytes: number | null | undefined): string {
  if (!bytes) return "";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  return `${value.toFixed(value < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

type PreviewState = {
  id: string;
  title: string;
  fileName: string | null;
  url: string;
  kind: "pdf" | "image" | "office" | "other";
} | null;

function DownloadButton({
  id,
  label,
  className,
}: {
  id: string;
  label: string;
  className?: string;
}) {
  return (
    <a
      href={`/api/documents/${id}/download`}
      className={
        className ??
        "inline-flex items-center justify-center gap-1.5 bg-brand-700 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-brand-800"
      }
    >
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
        <path d="M10 2a1 1 0 011 1v7.6l2.3-2.3a1 1 0 111.4 1.4l-4 4a1 1 0 01-1.4 0l-4-4a1 1 0 011.4-1.4L9 10.6V3a1 1 0 011-1z" />
        <path d="M4 15a1 1 0 011 1v1h10v-1a1 1 0 112 0v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1a1 1 0 011-1z" />
      </svg>
      {label}
    </a>
  );
}

export function DocumentsTable({
  docs,
  categories,
  labels,
  locale,
  deleteLabels,
}: {
  docs: DocumentListItem[];
  categories: Record<string, string>;
  labels: Labels;
  locale: Locale;
  /** When provided, render a delete button per row (admin view). */
  deleteLabels?: { confirmDelete: string; delete: string };
}) {
  const [preview, setPreview] = useState<PreviewState>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(locale === "de" ? "de-DE" : "en-GB");

  const close = useCallback(() => {
    setPreview(null);
    setError(null);
  }, []);

  useEffect(() => {
    if (!preview) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preview, close]);

  async function openPreview(doc: DocumentListItem) {
    setLoadingId(doc.id);
    setError(null);
    try {
      const res = await fetch(`/api/documents/${doc.id}/preview`);
      if (!res.ok) {
        throw new Error(labels.unsupported);
      }
      const data = (await res.json()) as {
        url: string;
        fileName: string | null;
        title: string;
        kind: "pdf" | "image" | "office" | "other";
      };
      setPreview({
        id: doc.id,
        title: data.title,
        fileName: data.fileName,
        url: data.url,
        kind: data.kind,
      });
    } catch {
      setError(labels.unsupported);
      setPreview({
        id: doc.id,
        title: doc.title,
        fileName: doc.file_name,
        url: "",
        kind: "other",
      });
    } finally {
      setLoadingId(null);
    }
  }

  const officeEmbedUrl = preview?.url
    ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(preview.url)}`
    : "";

  return (
    <>
      {/* Mobile: stacked cards */}
      <div className="space-y-3 md:hidden">
        {docs.map((d) => (
          <div
            key={d.id}
            role="button"
            tabIndex={0}
            onClick={() => openPreview(d)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openPreview(d);
              }
            }}
            className="w-full cursor-pointer border border-slate-200 bg-white p-4 text-left transition hover:border-brand-300"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="font-medium text-slate-800">{d.title}</div>
                {d.file_name && (
                  <div className="mt-0.5 break-all text-xs text-slate-400">
                    {d.file_name}
                    {d.size_bytes ? ` · ${formatBytes(d.size_bytes)}` : ""}
                    {loadingId === d.id ? ` · ${labels.loading}` : ""}
                  </div>
                )}
              </div>
              <span className="shrink-0 bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700">
                {categories[d.category] ?? d.category}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
              <span>
                {labels.colYear}: {d.year ?? "—"}
              </span>
              <span>
                {labels.colDate}: {formatDate(d.created_at)}
              </span>
            </div>
            <div
              className="mt-3 flex flex-wrap gap-2"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <DownloadButton
                id={d.id}
                label={labels.download}
                className="inline-flex flex-1 items-center justify-center gap-1.5 bg-brand-700 px-3 py-2 text-xs font-medium text-white transition hover:bg-brand-800"
              />
              {deleteLabels && (
                <DeleteDocButton documentId={d.id} labels={deleteLabels} />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden overflow-x-auto border border-slate-200 bg-white md:block">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-slate-50 text-xs tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3 font-medium">{labels.colDocument}</th>
              <th className="px-5 py-3 font-medium">{labels.colCategory}</th>
              <th className="px-5 py-3 font-medium">{labels.colYear}</th>
              <th className="px-5 py-3 font-medium">{labels.colDate}</th>
              <th className="px-5 py-3 text-right font-medium">
                {labels.colAction}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {docs.map((d) => (
              <tr
                key={d.id}
                className="cursor-pointer hover:bg-slate-50"
                onClick={() => openPreview(d)}
              >
                <td className="px-5 py-4">
                  <div className="font-medium text-slate-800">{d.title}</div>
                  {d.file_name && (
                    <div className="text-xs text-slate-400">
                      {d.file_name}
                      {d.size_bytes ? ` · ${formatBytes(d.size_bytes)}` : ""}
                      {loadingId === d.id ? ` · ${labels.loading}` : ""}
                    </div>
                  )}
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
                    {categories[d.category] ?? d.category}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-600">{d.year ?? "—"}</td>
                <td className="px-5 py-4 text-slate-600">
                  {formatDate(d.created_at)}
                </td>
                <td className="px-5 py-4 text-right">
                  <div
                    className="flex justify-end gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DownloadButton id={d.id} label={labels.download} />
                    {deleteLabels && (
                      <DeleteDocButton documentId={d.id} labels={deleteLabels} />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={labels.preview}
          onClick={close}
        >
          <div
            className="flex h-[92vh] w-full max-w-5xl flex-col border border-slate-200 bg-white sm:h-auto sm:max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 sm:px-5">
              <div className="min-w-0">
                <h2 className="truncate text-base font-semibold text-brand-800">
                  {preview.title}
                </h2>
                {preview.fileName && (
                  <p className="truncate text-xs text-slate-400">
                    {preview.fileName}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <a
                  href={`/api/documents/${preview.id}/download`}
                  className="hidden border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 sm:inline-flex"
                >
                  {labels.download}
                </a>
                <button
                  type="button"
                  onClick={close}
                  className="bg-brand-800 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-brand-700"
                >
                  {labels.close}
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-auto bg-slate-100">
              {error || preview.kind === "other" || !preview.url ? (
                <div className="flex h-64 flex-col items-center justify-center gap-3 px-6 text-center text-sm text-slate-600">
                  <p>{error ?? labels.unsupported}</p>
                  <DownloadButton id={preview.id} label={labels.download} />
                </div>
              ) : preview.kind === "image" ? (
                <div className="flex items-center justify-center p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview.url}
                    alt={preview.title}
                    className="max-h-[70vh] max-w-full object-contain"
                  />
                </div>
              ) : preview.kind === "pdf" ? (
                <iframe
                  src={preview.url}
                  title={preview.title}
                  className="h-full min-h-[60vh] w-full border-0 bg-white sm:h-[75vh]"
                />
              ) : (
                <div className="flex h-full min-h-[60vh] flex-col sm:h-[75vh]">
                  <iframe
                    src={officeEmbedUrl}
                    title={preview.title}
                    className="h-full w-full flex-1 border-0 bg-white"
                  />
                  <p className="border-t border-slate-200 bg-white px-4 py-2 text-center text-xs text-slate-500">
                    <a
                      href={officeEmbedUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-brand-700 underline"
                    >
                      {labels.openInNewTab}
                    </a>
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 p-3 sm:hidden">
              <DownloadButton
                id={preview.id}
                label={labels.download}
                className="inline-flex w-full items-center justify-center gap-1.5 bg-brand-700 px-3 py-2.5 text-xs font-medium text-white"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
