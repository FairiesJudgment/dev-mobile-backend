// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { uuid } from 'uuidv4';

const prisma = new PrismaClient();

async function main() {
  await prisma.manager.deleteMany();
  const saltRounds = 10;
  const salt = uuid();
  const password = '123456789';
  const hashedPassword = await bcrypt.hash(password + salt, 10);

  const manager = await prisma.manager.create({
    data: {
      username: 'Golden',
      password: hashedPassword,
      password_salt: salt,
      firstname: 'Gol',
      lastname: 'DEN',
      email: 'golden@gmail.com',
      phone: '0660266332',
      address: 'Polytech askip',
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
