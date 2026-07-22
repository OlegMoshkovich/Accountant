import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { FIRM_NAME } from "@/lib/constants";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-800 px-6 py-12">
      <Link href="/" className="mb-8 text-xl font-bold text-white">
        {FIRM_NAME}
      </Link>
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: "bg-brand-700 hover:bg-brand-800",
          },
        }}
      />
    </div>
  );
}
