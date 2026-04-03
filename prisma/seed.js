import { PrismaClient } from '../src/generated/prisma/index.js';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@zorvyn.com' },
    update: {},
    create: {
      email: 'admin@zorvyn.com',
      name: 'Admin Satyajit',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // Create 20 Random Records across 4 months
  const categories = ['Salary', 'Freelance', 'Rent', 'Groceries', 'Investments'];
  for (let i = 0; i < 20; i++) {
    await prisma.financialRecord.create({
      data: {
        amount: Math.floor(Math.random() * 5000) + 100,
        type: i % 3 === 0 ? 'INCOME' : 'EXPENSE',
        category: categories[Math.floor(Math.random() * categories.length)],
        createdBy: admin.id,
        date: new Date(2026, Math.floor(Math.random() * 4), Math.floor(Math.random() * 28)),
      }
    });
  }
  console.log('✅ Seed data injected successfully!');
}

main().catch(e => console.error(e)).finally(async () => await prisma.$disconnect());