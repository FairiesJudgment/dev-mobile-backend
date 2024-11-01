import { Decimal } from "@prisma/client/runtime/library";

export const depositedGameMock = {
    tag: '23aaf884-03ad-4932-8bce-7f2974bc2fc2',
    price: new Decimal(19.99),
    sold: false,
    for_sale: true,
    id_session: 1,
    id_seller: '123e4567-e89b-12d3-a456-426614174000',
    id_game: 1,
}