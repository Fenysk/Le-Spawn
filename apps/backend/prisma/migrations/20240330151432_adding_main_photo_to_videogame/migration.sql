/*
  Warnings:

  - Added the required column `main_photo` to the `video_games` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "video_games" ADD COLUMN "main_photo" Text NOT NULL DEFAULT 'tempory_value';
ALTER TABLE "video_games" ALTER COLUMN "main_photo" DROP DEFAULT;
