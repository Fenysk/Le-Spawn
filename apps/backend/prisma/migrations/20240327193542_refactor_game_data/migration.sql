/*
  Warnings:

  - You are about to drop the `video_game_boxes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `video_game_games` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `state_box` to the `video_games` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state_game` to the `video_games` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "video_game_boxes" DROP CONSTRAINT "video_game_boxes_video_game_id_fkey";

-- DropForeignKey
ALTER TABLE "video_game_games" DROP CONSTRAINT "video_game_games_video_game_id_fkey";

-- AlterTable
ALTER TABLE "video_game_extra_contents" ADD COLUMN     "photos" TEXT[];

-- AlterTable
ALTER TABLE "video_games"
ADD COLUMN     "photos_box" TEXT[],
ADD COLUMN     "photos_game" TEXT[],
ADD COLUMN     "state_box" "State",
ADD COLUMN     "state_game" "State";

-- DropTable
DROP TABLE "video_game_boxes";

-- DropTable
DROP TABLE "video_game_games";
