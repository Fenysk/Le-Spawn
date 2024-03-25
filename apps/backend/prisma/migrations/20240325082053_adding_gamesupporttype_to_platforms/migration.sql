-- CreateEnum
CREATE TYPE "GameSupportType" AS ENUM ('CD', 'CATRIDGE', 'DIGITAL');

-- AlterTable to add column
ALTER TABLE "platforms" ADD COLUMN "game_support_type" "GameSupportType";

-- Update the column with the default value
UPDATE "platforms" SET "game_support_type" = 'CD' WHERE "game_support_type" IS NULL;

-- AlterTable to set NOT NULL
ALTER TABLE "platforms" ALTER COLUMN "game_support_type" SET NOT NULL;
