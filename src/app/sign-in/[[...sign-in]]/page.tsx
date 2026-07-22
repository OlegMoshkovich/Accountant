import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { FIRM_NAME } from "@/lib/constants";
import { getLocale } from "@/lib/i18n";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";

export default async function SignInPage() {
  const locale = await getLocale();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-800 px-6 py-12">
      <div className="mb-8 flex flex-col items-center gap-4">
        <Link href="/" className="text-xl font-bold text-white">
          {FIRM_NAME}
        </Link>
        <LocaleSwitcher locale={locale} tone="dark" />
      </div>
      <SignIn />
    </div>
  );
}
