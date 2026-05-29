"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import {
  createSession,
  destroySession,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";

export type AuthState = { error: string | null };

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

const registerSchema = z.object({
  name: z.string().min(1, "Your name is required"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  organizationName: z.string().min(1, "Organization name is required"),
});

export async function registerAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    organizationName: formData.get("organizationName"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { name, email, password, organizationName } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (existing) {
    return { error: "An account with that email already exists" };
  }

  let slug = slugify(organizationName) || "org";
  while (await prisma.organization.findUnique({ where: { slug } })) {
    slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
  }

  const user = await prisma.$transaction(async (tx) => {
    const org = await tx.organization.create({
      data: { name: organizationName.trim(), slug },
    });
    return tx.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash: await hashPassword(password),
        role: "ADMIN",
        organizationId: org.id,
      },
    });
  });

  await createSession(user.id);
  redirect("/dashboard");
}

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function loginAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const normalizedEmail = parsed.data.email.toLowerCase().trim();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return { error: "Invalid email or password" };
  }

  await createSession(user.id);
  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/login");
}
