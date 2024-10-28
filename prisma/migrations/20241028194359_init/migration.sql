-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT_CARD', 'CASH', 'CHECK');

-- CreateTable
CREATE TABLE "Manager" (
    "id_manager" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" VARCHAR(200) NOT NULL,
    "password_salt" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "admin" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Manager_pkey" PRIMARY KEY ("id_manager")
);

-- CreateTable
CREATE TABLE "Seller" (
    "id_seller" TEXT NOT NULL,
    "username" TEXT,
    "password" TEXT,
    "password_salt" TEXT,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Seller_pkey" PRIMARY KEY ("id_seller")
);

-- CreateTable
CREATE TABLE "Client" (
    "id_client" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id_client")
);

-- CreateTable
CREATE TABLE "GameCategory" (
    "id_category" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "GameCategory_pkey" PRIMARY KEY ("id_category")
);

-- CreateTable
CREATE TABLE "GameEditor" (
    "id_editor" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "GameEditor_pkey" PRIMARY KEY ("id_editor")
);

-- CreateTable
CREATE TABLE "Game" (
    "id_game" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "min_players" INTEGER NOT NULL,
    "max_players" INTEGER NOT NULL,
    "min_age" INTEGER NOT NULL,
    "max_age" INTEGER NOT NULL,
    "id_editor" INTEGER NOT NULL,
    "id_category" INTEGER NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id_game")
);

-- CreateTable
CREATE TABLE "Session" (
    "id_session" SERIAL NOT NULL,
    "date_begin" TIMESTAMP(3) NOT NULL,
    "date_end" TIMESTAMP(3) NOT NULL,
    "deposit_fees" DECIMAL(65,30) NOT NULL,
    "discount" DECIMAL(65,30) NOT NULL,
    "comission_fees" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id_session")
);

-- CreateTable
CREATE TABLE "DepositedGame" (
    "tag" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "sold" BOOLEAN NOT NULL,
    "for_sale" BOOLEAN NOT NULL,
    "id_session" INTEGER NOT NULL,
    "id_seller" TEXT NOT NULL,
    "id_game" INTEGER NOT NULL,

    CONSTRAINT "DepositedGame_pkey" PRIMARY KEY ("tag")
);

-- CreateTable
CREATE TABLE "SaleTransaction" (
    "id_sale" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DECIMAL(65,30) NOT NULL,
    "comission" DECIMAL(65,30) NOT NULL,
    "payment_method" "PaymentMethod" NOT NULL,
    "id_seller" TEXT NOT NULL,
    "id_client" INTEGER NOT NULL,
    "id_manager" TEXT NOT NULL,

    CONSTRAINT "SaleTransaction_pkey" PRIMARY KEY ("id_sale")
);

-- CreateTable
CREATE TABLE "RecoverTransaction" (
    "id_recover" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DECIMAL(65,30) NOT NULL,
    "id_seller" TEXT NOT NULL,
    "id_manager" TEXT NOT NULL,

    CONSTRAINT "RecoverTransaction_pkey" PRIMARY KEY ("id_recover")
);

-- CreateTable
CREATE TABLE "DepositTransaction" (
    "id_deposit" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fees" DECIMAL(65,30) NOT NULL,
    "discount" DECIMAL(65,30) NOT NULL,
    "id_seller" TEXT NOT NULL,
    "id_manager" TEXT NOT NULL,

    CONSTRAINT "DepositTransaction_pkey" PRIMARY KEY ("id_deposit")
);

-- CreateTable
CREATE TABLE "GameInSaleTransaction" (
    "id_sale" TEXT NOT NULL,
    "id_game" INTEGER NOT NULL,
    "tags" TEXT[],
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "GameInSaleTransaction_pkey" PRIMARY KEY ("id_sale","id_game")
);

-- CreateTable
CREATE TABLE "GameInRecoverTransaction" (
    "id_recover" TEXT NOT NULL,
    "id_game" INTEGER NOT NULL,
    "tags" TEXT[],
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "GameInRecoverTransaction_pkey" PRIMARY KEY ("id_game","id_recover")
);

-- CreateTable
CREATE TABLE "GameInDepositTransaction" (
    "id_deposit" TEXT NOT NULL,
    "id_game" INTEGER NOT NULL,
    "tags" TEXT[],
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "GameInDepositTransaction_pkey" PRIMARY KEY ("id_deposit","id_game")
);

-- CreateIndex
CREATE UNIQUE INDEX "Manager_username_key" ON "Manager"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Manager_email_key" ON "Manager"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Manager_phone_key" ON "Manager"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Manager_address_key" ON "Manager"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_username_key" ON "Seller"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_email_key" ON "Seller"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_phone_key" ON "Seller"("phone");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_id_editor_fkey" FOREIGN KEY ("id_editor") REFERENCES "GameEditor"("id_editor") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_id_category_fkey" FOREIGN KEY ("id_category") REFERENCES "GameCategory"("id_category") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepositedGame" ADD CONSTRAINT "DepositedGame_id_session_fkey" FOREIGN KEY ("id_session") REFERENCES "Session"("id_session") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepositedGame" ADD CONSTRAINT "DepositedGame_id_game_fkey" FOREIGN KEY ("id_game") REFERENCES "Game"("id_game") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepositedGame" ADD CONSTRAINT "DepositedGame_id_seller_fkey" FOREIGN KEY ("id_seller") REFERENCES "Seller"("id_seller") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleTransaction" ADD CONSTRAINT "SaleTransaction_id_seller_fkey" FOREIGN KEY ("id_seller") REFERENCES "Seller"("id_seller") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleTransaction" ADD CONSTRAINT "SaleTransaction_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "Client"("id_client") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleTransaction" ADD CONSTRAINT "SaleTransaction_id_manager_fkey" FOREIGN KEY ("id_manager") REFERENCES "Manager"("id_manager") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecoverTransaction" ADD CONSTRAINT "RecoverTransaction_id_seller_fkey" FOREIGN KEY ("id_seller") REFERENCES "Seller"("id_seller") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecoverTransaction" ADD CONSTRAINT "RecoverTransaction_id_manager_fkey" FOREIGN KEY ("id_manager") REFERENCES "Manager"("id_manager") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepositTransaction" ADD CONSTRAINT "DepositTransaction_id_seller_fkey" FOREIGN KEY ("id_seller") REFERENCES "Seller"("id_seller") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepositTransaction" ADD CONSTRAINT "DepositTransaction_id_manager_fkey" FOREIGN KEY ("id_manager") REFERENCES "Manager"("id_manager") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameInSaleTransaction" ADD CONSTRAINT "GameInSaleTransaction_id_sale_fkey" FOREIGN KEY ("id_sale") REFERENCES "SaleTransaction"("id_sale") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameInSaleTransaction" ADD CONSTRAINT "GameInSaleTransaction_id_game_fkey" FOREIGN KEY ("id_game") REFERENCES "Game"("id_game") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameInRecoverTransaction" ADD CONSTRAINT "GameInRecoverTransaction_id_recover_fkey" FOREIGN KEY ("id_recover") REFERENCES "RecoverTransaction"("id_recover") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameInRecoverTransaction" ADD CONSTRAINT "GameInRecoverTransaction_id_game_fkey" FOREIGN KEY ("id_game") REFERENCES "Game"("id_game") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameInDepositTransaction" ADD CONSTRAINT "GameInDepositTransaction_id_deposit_fkey" FOREIGN KEY ("id_deposit") REFERENCES "DepositTransaction"("id_deposit") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameInDepositTransaction" ADD CONSTRAINT "GameInDepositTransaction_id_game_fkey" FOREIGN KEY ("id_game") REFERENCES "Game"("id_game") ON DELETE CASCADE ON UPDATE CASCADE;
