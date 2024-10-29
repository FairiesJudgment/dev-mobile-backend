// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { uuid } from 'uuidv4';

const prisma = new PrismaClient();

async function main() {
  const saltRounds = 10;
  const salt = uuid();
  const password = '123456789';
  const hashedPassword = await bcrypt.hash(password + salt, 10);

  const manager = await prisma.manager.create({
    data: {
      username: 'Alex',
      password: hashedPassword,
      password_salt: salt,
      firstname: 'Alexandre',
      lastname: 'Fleury',
      email: 'alexx97354@gmail.com',
      phone: '0785698002',
      address: '45 rue Esculape',
      is_admin: true,
    },
  });

  console.log('Manager created:', manager);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
