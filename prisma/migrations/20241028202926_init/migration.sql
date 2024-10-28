/*
  Warnings:

  - You are about to drop the column `admin` on the `Manager` table. All the data in the column will be lost.
  - Added the required column `is_admin` to the `Manager` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone` on table `Manager` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Manager" DROP COLUMN "admin",
ADD COLUMN     "is_admin" BOOLEAN NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;
