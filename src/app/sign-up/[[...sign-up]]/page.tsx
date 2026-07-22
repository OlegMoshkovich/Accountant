import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { FIRM_NAME } from "@/lib/constants";
import { getDict } from "@/lib/i18n";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";

export default async function SignUpPage() {
  const { locale, t } = await getDict();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-800 px-6 py-12">
      <div className="mb-6 flex flex-col items-center gap-4">
        <Link href="/" className="text-xl font-bold text-white">
          {FIRM_NAME}
        </Link>
        <LocaleSwitcher locale={locale} tone="dark" />
      </div>
      <p className="mb-6 max-w-sm text-center text-sm text-brand-100">
        {t.signUp.intro}
      </p>
      <SignUp
        appearance={{
          elements: {
            footer: "hidden",
          },
        }}
      />
      <p className="mt-6 text-sm text-brand-100">
        {t.auth.haveAccount}{" "}
        <Link href="/sign-in" className="font-semibold text-white underline">
          {t.auth.signIn}
        </Link>
      </p>
    </div>
  );
}
