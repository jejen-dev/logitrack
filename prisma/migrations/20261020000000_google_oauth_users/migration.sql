-- Google OAuth users do not have a local password.
ALTER TABLE "User" ALTER COLUMN "passwordHash" DROP NOT NULL;
