/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `user_image` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_image_user_id_key" ON "user_image"("user_id");
