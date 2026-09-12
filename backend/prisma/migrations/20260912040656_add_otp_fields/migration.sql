-- AlterTable
ALTER TABLE "User" ADD COLUMN     "otp_attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "otp_expires_at" TIMESTAMP(3),
ADD COLUMN     "otp_hash" TEXT,
ADD COLUMN     "otp_last_sent_at" TIMESTAMP(3);
