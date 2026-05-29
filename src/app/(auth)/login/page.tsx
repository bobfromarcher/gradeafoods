import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "./LoginForm";
import { getSessionUser } from "@/lib/auth";

export default async function LoginPage() {
  if (await getSessionUser()) redirect("/dashboard");

  return (
    <div>
      <h1 className="text-xl font-bold text-ink">Sign in</h1>
      <p className="mt-1 text-sm text-ink/60">
        Welcome back. Sign in to continue grading.
      </p>
      <div className="mt-6">
        <LoginForm />
      </div>
      <p className="mt-6 text-center text-sm text-ink/60">
        New to Grade A Foods?{" "}
        <Link href="/register" className="font-medium text-brand-700 hover:underline">
          Create an account
        </Link>
      </p>
      <div className="mt-4 rounded-lg bg-brand-50 p-3 text-center text-xs text-brand-800">
        Demo login — <strong>demo@gradeafoods.com</strong> / <strong>demo1234</strong>
      </div>
    </div>
  );
}
