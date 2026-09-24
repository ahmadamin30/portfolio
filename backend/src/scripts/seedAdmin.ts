import dotenv from 'dotenv';
dotenv.config();

import prisma from '../config/db';
import { hashPassword } from '../utils/password';

async function seedAdmin(): Promise<void> {
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const name = 'Admin';
  const rawPassword = process.env.ADMIN_PASSWORD || 'adminPassword123!';

  try {
    const existing = await prisma.admin.findUnique({
      where: { email },
    });

    if (existing) {
      console.log(`ℹ️ ‍Admin account (${email}) already exists. Skipping.`);
      process.exit(0);
    }

    const hashedPassword = await hashPassword(rawPassword);

    const admin = await prisma.admin.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    console.log('✅ Admin account seeded successfully!');
    console.log(`👤 Name:  ${admin.name}`);
    console.log(`📧 Email: ${admin.email}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during admin seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

void seedAdmin();
