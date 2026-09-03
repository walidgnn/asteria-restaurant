/*
  Warnings:

  - A unique constraint covering the columns `[categoryId,name]` on the table `dishes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "dishes_categoryId_name_key" ON "dishes"("categoryId", "name");
