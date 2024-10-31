/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Game` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `GameCategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `GameEditor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Game_name_key" ON "Game"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GameCategory_name_key" ON "GameCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GameEditor_name_key" ON "GameEditor"("name");
