/*
  Warnings:

  - The values [CREDIT_CARD,CASH,CHECK] on the enum `PaymentMethod` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `amount` to the `DepositTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentMethod_new" AS ENUM ('credit_card', 'cash', 'check');
ALTER TABLE "SaleTransaction" ALTER COLUMN "payment_method" TYPE "PaymentMethod_new" USING ("payment_method"::text::"PaymentMethod_new");
ALTER TYPE "PaymentMethod" RENAME TO "PaymentMethod_old";
ALTER TYPE "PaymentMethod_new" RENAME TO "PaymentMethod";
DROP TYPE "PaymentMethod_old";
COMMIT;

-- AlterTable
ALTER TABLE "DepositTransaction" ADD COLUMN     "amount" DECIMAL(65,30) NOT NULL;
