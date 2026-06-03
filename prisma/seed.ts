import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { computeGrade } from "../src/lib/grading";
import type { ResultStatus } from "../src/lib/constants";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

type SeedItem = {
  category: string;
  text: string;
  weight: number;
  critical?: boolean;
};

const RESTAURANT_ITEMS: SeedItem[] = [
  { category: "Temperature Control", text: "Cold holding at or below 41°F", weight: 5, critical: true },
  { category: "Temperature Control", text: "Hot holding at or above 135°F", weight: 5, critical: true },
  { category: "Temperature Control", text: "Cooling logs completed correctly", weight: 3 },
  { category: "Hygiene", text: "Handwashing stations stocked and accessible", weight: 4, critical: true },
  { category: "Hygiene", text: "Employees wearing clean uniforms / gloves", weight: 2 },
  { category: "Hygiene", text: "No bare-hand contact with ready-to-eat food", weight: 3 },
  { category: "Documentation", text: "Allergen menu labeling present and accurate", weight: 3 },
  { category: "Documentation", text: "Food handler certifications current", weight: 2 },
  { category: "Facility", text: "Pest control log current", weight: 3 },
  { category: "Facility", text: "Surfaces and equipment sanitized", weight: 3 },
];

const WAREHOUSE_ITEMS: SeedItem[] = [
  { category: "Cold Chain", text: "Freezer temperature ≤ 0°F", weight: 5, critical: true },
  { category: "Cold Chain", text: "Cooler temperature ≤ 41°F", weight: 5, critical: true },
  { category: "Cold Chain", text: "Continuous temperature monitoring active", weight: 4 },
  { category: "Storage", text: "Products stored off the floor", weight: 2 },
  { category: "Storage", text: "FIFO rotation followed", weight: 3 },
  { category: "Storage", text: "Allergen segregation maintained", weight: 3, critical: true },
  { category: "Sanitation", text: "Loading dock clean and sealed", weight: 2 },
  { category: "Sanitation", text: "Pest control program documented", weight: 3 },
];

async function reset() {
  await prisma.inspectionResult.deleteMany();
  await prisma.inspection.deleteMany();
  await prisma.checklistItem.deleteMany();
  await prisma.checklistTemplate.deleteMany();
  await prisma.facility.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();
}

async function main() {
  await reset();

  const org = await prisma.organization.create({
    data: { name: "Grade A Foods Demo", slug: "demo" },
  });

  const demo = await prisma.user.create({
    data: {
      name: "Dana Inspector",
      email: "demo@gradeafoods.com",
      passwordHash: await bcrypt.hash("demo1234", 10),
      role: "ADMIN",
      organizationId: org.id,
    },
  });

  const restaurantTemplate = await prisma.checklistTemplate.create({
    data: {
      name: "Restaurant Health Inspection",
      description: "Standard health-code inspection for food-service establishments.",
      organizationId: org.id,
      items: {
        create: RESTAURANT_ITEMS.map((it, i) => ({ ...it, order: i, critical: !!it.critical })),
      },
    },
    include: { items: { orderBy: { order: "asc" } } },
  });

  const warehouseTemplate = await prisma.checklistTemplate.create({
    data: {
      name: "Cold Chain Warehouse Audit",
      description: "Temperature and storage audit for cold-storage facilities.",
      organizationId: org.id,
      items: {
        create: WAREHOUSE_ITEMS.map((it, i) => ({ ...it, order: i, critical: !!it.critical })),
      },
    },
    include: { items: { orderBy: { order: "asc" } } },
  });

  const facilities = await Promise.all(
    [
      { name: "Riverside Kitchen", type: "RESTAURANT", address: "120 Market St", contactName: "Lena Ortiz", contactEmail: "lena@riverside.example" },
      { name: "Harbor Cold Storage", type: "WAREHOUSE", address: "8 Dockside Rd", contactName: "Marcus Webb", contactEmail: "ops@harborcold.example" },
      { name: "Sunburst Farms", type: "FARM", address: "Rural Route 5", contactName: "Priya Anand", contactEmail: "priya@sunburst.example" },
      { name: "Metro Grocery #14", type: "RETAIL", address: "455 Central Ave", contactName: "Tom Riley", contactEmail: "store14@metro.example" },
      { name: "Apex Processing", type: "PROCESSOR", address: "9 Industrial Pkwy", contactName: "Sofia Khan", contactEmail: "qa@apexfoods.example" },
    ].map((f) =>
      prisma.facility.create({ data: { ...f, organizationId: org.id } }),
    ),
  );

  const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

  async function createInspection(
    facilityId: string,
    template: typeof restaurantTemplate,
    statuses: ResultStatus[],
    conductedAt: Date,
    notes?: string,
  ) {
    const gradeable = template.items.map((item, i) => ({
      status: statuses[i] ?? "PASS",
      weight: item.weight,
      critical: item.critical,
    }));
    const outcome = computeGrade(gradeable);

    await prisma.inspection.create({
      data: {
        facilityId,
        templateId: template.id,
        inspectorId: demo.id,
        organizationId: org.id,
        status: "COMPLETED",
        scorePercent: outcome.scorePercent,
        grade: outcome.grade,
        notes: notes ?? null,
        conductedAt,
        results: {
          create: template.items.map((item, i) => ({
            itemId: item.id,
            status: statuses[i] ?? "PASS",
          })),
        },
      },
    });
  }

  const allPass = (n: number): ResultStatus[] => Array(n).fill("PASS");

  // Riverside Kitchen — strong A, then a B
  await createInspection(facilities[0].id, restaurantTemplate, allPass(RESTAURANT_ITEMS.length), daysAgo(60));
  await createInspection(
    facilities[0].id,
    restaurantTemplate,
    ["PASS", "PASS", "FAIL", "PASS", "FAIL", "PASS", "PASS", "PASS", "PASS", "FAIL"],
    daysAgo(7),
    "Minor cooling-log gaps; corrective action requested within 14 days.",
  );

  // Harbor Cold Storage — A on warehouse audit
  await createInspection(facilities[1].id, warehouseTemplate, allPass(WAREHOUSE_ITEMS.length), daysAgo(20));

  // Sunburst Farms — C grade
  await createInspection(
    facilities[2].id,
    restaurantTemplate,
    ["PASS", "PASS", "FAIL", "PASS", "FAIL", "FAIL", "FAIL", "PASS", "FAIL", "PASS"],
    daysAgo(14),
    "Several documentation and hygiene findings.",
  );

  // Metro Grocery — critical failure => F
  await createInspection(
    facilities[3].id,
    restaurantTemplate,
    ["FAIL", "PASS", "PASS", "PASS", "PASS", "PASS", "PASS", "PASS", "PASS", "PASS"],
    daysAgo(3),
    "Cold-holding temperature out of range — critical violation. Re-inspection required.",
  );

  // Apex Processing — warehouse audit, B
  await createInspection(
    facilities[4].id,
    warehouseTemplate,
    ["PASS", "PASS", "FAIL", "PASS", "FAIL", "PASS", "PASS", "PASS"],
    daysAgo(30),
  );

  // A draft in progress on Apex
  await prisma.inspection.create({
    data: {
      facilityId: facilities[4].id,
      templateId: warehouseTemplate.id,
      inspectorId: demo.id,
      organizationId: org.id,
      status: "DRAFT",
      conductedAt: daysAgo(0),
      results: {
        create: warehouseTemplate.items.map((item) => ({
          itemId: item.id,
          status: "PASS",
        })),
      },
    },
  });

  console.log("Seed complete:");
  console.log(`  Organization: ${org.name}`);
  console.log(`  Login: demo@gradeafoods.com / demo1234`);
  console.log(`  Facilities: ${facilities.length}, Templates: 2`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
