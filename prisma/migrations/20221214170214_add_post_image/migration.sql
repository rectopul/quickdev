-- CreateTable
CREATE TABLE "post_image" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "post_image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "post_image" ADD CONSTRAINT "post_image_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
