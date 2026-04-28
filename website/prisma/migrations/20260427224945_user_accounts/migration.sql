-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "planId" TEXT,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "postalCode" TEXT,
    "city" TEXT,
    "country" TEXT DEFAULT 'Sverige',
    "sameBillingAsShipping" BOOLEAN NOT NULL DEFAULT true,
    "billingAddressLine1" TEXT,
    "billingPostalCode" TEXT,
    "billingCity" TEXT,
    "notifyShipmentEmail" BOOLEAN NOT NULL DEFAULT true,
    "notifyMarketingEmail" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT DEFAULT 'sv',
    "subscriptionPausedUntil" DATETIME,
    "deliveryNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
