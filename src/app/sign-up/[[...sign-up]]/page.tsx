import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { FIRM_NAME } from "@/lib/constants";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-800 px-6 py-12">
      <Link href="/" className="mb-6 text-xl font-bold text-white">
        {FIRM_NAME}
      </Link>
      <p className="mb-6 max-w-sm text-center text-sm text-brand-100">
        Nach der Registrierung prüft unsere Kanzlei Ihren Zugang und schaltet ihn
        frei. Sie erhalten anschließend Zugriff auf Ihre Dokumente.
      </p>
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: "bg-brand-700 hover:bg-brand-800",
          },
        }}
      />
    </div>
  );
}
