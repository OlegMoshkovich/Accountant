import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { FIRM_NAME } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  title: FIRM_NAME,
  description:
    "Wirtschaftsprüfung & Steuerberatung – secure client portal for tax returns and documents.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
