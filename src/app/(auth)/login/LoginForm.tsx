"use client";

import { useActionState } from "react";
import { Field } from "@/components/Field";
import { SubmitButton } from "@/components/SubmitButton";
import { loginAction, type AuthState } from "../actions";

const initialState: AuthState = { error: null };

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <Field
        label="Email"
        name="email"
        type="email"
        placeholder="you@company.com"
        autoComplete="email"
        defaultValue="demo@gradeafoods.com"
      />
      <Field
        label="Password"
        name="password"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        defaultValue="demo1234"
      />
      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <SubmitButton className="w-full">Sign in</SubmitButton>
    </form>
  );
}
