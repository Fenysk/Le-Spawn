-- DropForeignKey
ALTER TABLE "statistics" DROP CONSTRAINT "statistics_user_id_fkey";

-- AlterTable
ALTER TABLE "statistics" ALTER COLUMN "value" DROP NOT NULL,
ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "statistics" ADD CONSTRAINT "statistics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
