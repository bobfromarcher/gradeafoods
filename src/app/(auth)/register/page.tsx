import Link from "next/link";
import { redirect } from "next/navigation";
import { RegisterForm } from "./RegisterForm";
import { getSessionUser } from "@/lib/auth";

export default async function RegisterPage() {
  if (await getSessionUser()) redirect("/dashboard");

  return (
    <div>
      <h1 className="text-xl font-bold text-ink">Create your account</h1>
      <p className="mt-1 text-sm text-ink/60">
        Set up your organization and start grading facilities.
      </p>
      <div className="mt-6">
        <RegisterForm />
      </div>
      <p className="mt-6 text-center text-sm text-ink/60">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand-700 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
