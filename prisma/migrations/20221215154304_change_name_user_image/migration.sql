/*
  Warnings:

  - You are about to drop the column `url` on the `user_image` table. All the data in the column will be lost.
  - Added the required column `name` to the `user_image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_image" DROP COLUMN "url",
ADD COLUMN     "name" TEXT NOT NULL;
