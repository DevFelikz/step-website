-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN "navLogoUrl" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
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
    "banned" BOOLEAN NOT NULL DEFAULT false,
    "bannedAt" DATETIME,
    "banReason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("addressLine1", "addressLine2", "billingAddressLine1", "billingCity", "billingPostalCode", "city", "country", "createdAt", "deliveryNotes", "email", "id", "locale", "name", "notifyMarketingEmail", "notifyShipmentEmail", "passwordHash", "phone", "planId", "postalCode", "sameBillingAsShipping", "subscriptionPausedUntil", "updatedAt") SELECT "addressLine1", "addressLine2", "billingAddressLine1", "billingCity", "billingPostalCode", "city", "country", "createdAt", "deliveryNotes", "email", "id", "locale", "name", "notifyMarketingEmail", "notifyShipmentEmail", "passwordHash", "phone", "planId", "postalCode", "sameBillingAsShipping", "subscriptionPausedUntil", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
