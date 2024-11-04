/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_session` to the `DepositTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_session` to the `RecoverTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_session` to the `SaleTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DepositTransaction" ADD COLUMN     "id_session" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "RecoverTransaction" ADD COLUMN     "id_session" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SaleTransaction" ADD COLUMN     "id_session" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Session_name_key" ON "Session"("name");

-- AddForeignKey
ALTER TABLE "SaleTransaction" ADD CONSTRAINT "SaleTransaction_id_session_fkey" FOREIGN KEY ("id_session") REFERENCES "Session"("id_session") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecoverTransaction" ADD CONSTRAINT "RecoverTransaction_id_session_fkey" FOREIGN KEY ("id_session") REFERENCES "Session"("id_session") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepositTransaction" ADD CONSTRAINT "DepositTransaction_id_session_fkey" FOREIGN KEY ("id_session") REFERENCES "Session"("id_session") ON DELETE CASCADE ON UPDATE CASCADE;
