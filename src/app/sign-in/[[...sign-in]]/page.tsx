import { ClerkLoaded, ClerkLoading, SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { FIRM_NAME } from "@/lib/constants";
import { getDict } from "@/lib/i18n";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { CircularLoader } from "@/components/CircularLoader";

export default async function SignInPage() {
  const { locale, t } = await getDict();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-800 px-6 py-12">
      <div className="mb-8 flex flex-col items-center gap-4">
        <Link href="/" className="text-xl font-bold text-white">
          {FIRM_NAME}
        </Link>
        <LocaleSwitcher locale={locale} tone="dark" />
      </div>
      <ClerkLoading>
        <CircularLoader />
      </ClerkLoading>
      <ClerkLoaded>
        <SignIn
          appearance={{
            elements: {
              footer: "hidden",
              spinner: "circular-loader",
            },
          }}
        />
      </ClerkLoaded>
      <p className="mt-6 text-sm text-brand-100">
        {t.auth.noAccount}{" "}
        <Link href="/sign-up" className="font-semibold text-white underline">
          {t.auth.signUp}
        </Link>
      </p>
    </div>
  );
}
