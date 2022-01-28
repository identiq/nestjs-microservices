import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

const prisma = new PrismaClient();

const main = async () => {
  dotenv.config();
  console.log('Seeding...');

  await prisma.webhook.create({
    data: {
      address: 'https://example.org',
      topic: 'article-publish',
    },
  });
};

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
