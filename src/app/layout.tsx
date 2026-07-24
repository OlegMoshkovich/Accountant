import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { FIRM_NAME } from "@/lib/constants";
import { getLocale } from "@/lib/i18n";
import "./globals.css";

export const metadata: Metadata = {
  title: FIRM_NAME,
  description: "",
  openGraph: {
    title: FIRM_NAME,
    description: "",
    siteName: FIRM_NAME,
  },
  twitter: {
    title: FIRM_NAME,
    description: "",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  return (
    <ClerkProvider
      appearance={{
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
        variables: {
          borderRadius: "0",
        },
        elements: {
          formButtonPrimary: "rounded-none bg-brand-700 hover:bg-brand-800",
          card: "rounded-none shadow-none",
          footer: "hidden",
          footerAction: "hidden",
          footerPages: "hidden",
          logoBox: "hidden",
          spinner: "circular-loader",
          userButtonPopoverCard: "mt-3 rounded-none shadow-none",
          userButtonPopoverFooter: "hidden",
        },
      }}
    >
      <html lang={locale}>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
