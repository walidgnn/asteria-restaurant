/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `menu_categories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "menu_categories_name_key" ON "menu_categories"("name");
