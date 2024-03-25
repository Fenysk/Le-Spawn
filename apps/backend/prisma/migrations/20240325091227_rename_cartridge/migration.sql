/*
  Warnings:

  - The values [CATRIDGE] on the enum `GameSupportType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GameSupportType_new" AS ENUM ('CD', 'CARTRIDGE', 'DIGITAL');
ALTER TABLE "platforms" ALTER COLUMN "game_support_type" TYPE "GameSupportType_new" USING ("game_support_type"::text::"GameSupportType_new");
ALTER TYPE "GameSupportType" RENAME TO "GameSupportType_old";
ALTER TYPE "GameSupportType_new" RENAME TO "GameSupportType";
DROP TYPE "GameSupportType_old";
COMMIT;
