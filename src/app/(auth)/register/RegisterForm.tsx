"use client";

import { useActionState } from "react";
import { Field } from "@/components/Field";
import { SubmitButton } from "@/components/SubmitButton";
import { registerAction, type AuthState } from "../actions";

const initialState: AuthState = { error: null };

export function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <Field label="Your name" name="name" placeholder="Jane Inspector" autoComplete="name" />
      <Field
        label="Organization name"
        name="organizationName"
        placeholder="Acme Foods Inc."
        autoComplete="organization"
      />
      <Field
        label="Email"
        name="email"
        type="email"
        placeholder="you@company.com"
        autoComplete="email"
      />
      <Field
        label="Password"
        name="password"
        type="password"
        placeholder="At least 8 characters"
        autoComplete="new-password"
      />
      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <SubmitButton className="w-full">Create account</SubmitButton>
    </form>
  );
}
