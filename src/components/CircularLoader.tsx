export function CircularLoader({
  className = "",
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const border =
    tone === "light"
      ? "border-white/30 border-t-white"
      : "border-brand-200 border-t-brand-800";

  return (
    <div
      className={`circular-loader h-10 w-10 animate-spin border-2 ${border} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
