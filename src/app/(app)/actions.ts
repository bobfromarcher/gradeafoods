"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { computeGrade } from "@/lib/grading";
import { FACILITY_TYPES, RESULT_STATUSES, type ResultStatus } from "@/lib/constants";

export type FormState = { error: string | null };

/* ---------------------------- Facilities ---------------------------- */

const facilitySchema = z.object({
  name: z.string().min(1, "Facility name is required"),
  type: z.enum(FACILITY_TYPES),
  address: z.string().optional(),
  contactName: z.string().optional(),
  contactEmail: z
    .string()
    .email("Enter a valid contact email")
    .optional()
    .or(z.literal("")),
});

export async function createFacility(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const parsed = facilitySchema.safeParse({
    name: formData.get("name"),
    type: formData.get("type"),
    address: formData.get("address") ?? undefined,
    contactName: formData.get("contactName") ?? undefined,
    contactEmail: formData.get("contactEmail") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const facility = await prisma.facility.create({
    data: {
      name: parsed.data.name.trim(),
      type: parsed.data.type,
      address: parsed.data.address?.trim() || null,
      contactName: parsed.data.contactName?.trim() || null,
      contactEmail: parsed.data.contactEmail?.trim() || null,
      organizationId: user.organizationId,
    },
  });

  revalidatePath("/facilities");
  redirect(`/facilities/${facility.id}`);
}

/* ---------------------------- Templates ----------------------------- */

const templateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  description: z.string().optional(),
  items: z
    .array(
      z.object({
        category: z.string().min(1),
        text: z.string().min(1),
        weight: z.number().int().min(1).max(100),
        critical: z.boolean(),
      }),
    )
    .min(1, "Add at least one checklist item"),
});

export async function createTemplate(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();

  const raw = formData.get("payload");
  let payload: unknown;
  try {
    payload = JSON.parse(typeof raw === "string" ? raw : "null");
  } catch {
    return { error: "Could not read the checklist items" };
  }

  const parsed = templateSchema.safeParse(payload);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const template = await prisma.checklistTemplate.create({
    data: {
      name: parsed.data.name.trim(),
      description: parsed.data.description?.trim() || null,
      organizationId: user.organizationId,
      items: {
        create: parsed.data.items.map((item, index) => ({
          category: item.category.trim(),
          text: item.text.trim(),
          weight: item.weight,
          critical: item.critical,
          order: index,
        })),
      },
    },
  });

  revalidatePath("/templates");
  redirect(`/templates/${template.id}`);
}

/* --------------------------- Inspections ---------------------------- */

export async function startInspection(formData: FormData): Promise<void> {
  const user = await requireUser();
  const facilityId = String(formData.get("facilityId") ?? "");
  const templateId = String(formData.get("templateId") ?? "");

  const [facility, template] = await Promise.all([
    prisma.facility.findFirst({
      where: { id: facilityId, organizationId: user.organizationId },
    }),
    prisma.checklistTemplate.findFirst({
      where: { id: templateId, organizationId: user.organizationId },
      include: { items: true },
    }),
  ]);

  if (!facility || !template) {
    throw new Error("Facility or checklist not found");
  }

  const inspection = await prisma.inspection.create({
    data: {
      facilityId: facility.id,
      templateId: template.id,
      inspectorId: user.id,
      organizationId: user.organizationId,
      status: "DRAFT",
      results: {
        create: template.items.map((item) => ({
          itemId: item.id,
          status: "PASS",
        })),
      },
    },
  });

  redirect(`/inspections/${inspection.id}`);
}

export async function saveInspection(formData: FormData): Promise<void> {
  const user = await requireUser();
  const inspectionId = String(formData.get("inspectionId") ?? "");
  const intent = String(formData.get("intent") ?? "save");

  const inspection = await prisma.inspection.findFirst({
    where: { id: inspectionId, organizationId: user.organizationId },
    include: { results: { include: { item: true } } },
  });
  if (!inspection) throw new Error("Inspection not found");

  const gradeable = inspection.results.map((result) => {
    const raw = String(formData.get(`status_${result.itemId}`) ?? result.status);
    const status: ResultStatus = (
      RESULT_STATUSES as readonly string[]
    ).includes(raw)
      ? (raw as ResultStatus)
      : "PASS";
    const note = String(formData.get(`note_${result.itemId}`) ?? "").trim();
    return {
      resultId: result.id,
      status,
      note,
      weight: result.item.weight,
      critical: result.item.critical,
    };
  });

  const outcome = computeGrade(gradeable);
  const notes = String(formData.get("notes") ?? "").trim();

  await prisma.$transaction([
    ...gradeable.map((g) =>
      prisma.inspectionResult.update({
        where: { id: g.resultId },
        data: { status: g.status, note: g.note || null },
      }),
    ),
    prisma.inspection.update({
      where: { id: inspection.id },
      data: {
        scorePercent: outcome.scorePercent,
        grade: outcome.grade,
        notes: notes || null,
        status: intent === "complete" ? "COMPLETED" : "DRAFT",
      },
    }),
  ]);

  revalidatePath(`/inspections/${inspection.id}`);
  revalidatePath("/inspections");
  revalidatePath("/dashboard");

  if (intent === "complete") {
    redirect(`/inspections/${inspection.id}/report`);
  }
  redirect(`/inspections/${inspection.id}`);
}

/* --------------------------- Email Capture -------------------------- */

const emailSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export async function captureEmail(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = emailSchema.safeParse({
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid email" };
  }
  // Placeholder: in production, send the report via email service
  console.log("Email captured:", parsed.data.email);
  return { error: null };
}
