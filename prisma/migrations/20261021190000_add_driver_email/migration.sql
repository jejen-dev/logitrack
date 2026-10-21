ALTER TABLE "Driver" ADD COLUMN "email" TEXT;
CREATE UNIQUE INDEX "Driver_email_key" ON "Driver"("email");
