-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'INSPECTOR',
    "organizationId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Facility" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'RESTAURANT',
    "address" TEXT,
    "contactName" TEXT,
    "contactEmail" TEXT,
    "organizationId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Facility_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChecklistTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "organizationId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChecklistTemplate_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChecklistItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "templateId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "critical" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ChecklistItem_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ChecklistTemplate" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Inspection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "facilityId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "inspectorId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "scorePercent" REAL NOT NULL DEFAULT 0,
    "grade" TEXT NOT NULL DEFAULT 'NA',
    "notes" TEXT,
    "conductedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Inspection_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Inspection_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ChecklistTemplate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Inspection_inspectorId_fkey" FOREIGN KEY ("inspectorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Inspection_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InspectionResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "inspectionId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PASS',
    "note" TEXT,
    CONSTRAINT "InspectionResult_inspectionId_fkey" FOREIGN KEY ("inspectionId") REFERENCES "Inspection" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "InspectionResult_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ChecklistItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "InspectionResult_inspectionId_itemId_key" ON "InspectionResult"("inspectionId", "itemId");
