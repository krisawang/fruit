ALTER TABLE "User"
  ADD COLUMN "phone" TEXT,
  ADD COLUMN "permissions" JSONB;

CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
