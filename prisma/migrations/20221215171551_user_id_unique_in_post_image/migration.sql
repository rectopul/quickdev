/*
  Warnings:

  - A unique constraint covering the columns `[post_id]` on the table `post_image` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "post_image_post_id_key" ON "post_image"("post_id");
