import dotenv from 'dotenv';
dotenv.config();

import prisma from '../config/db';
import { hashPassword } from '../utils/password';

async function seedAdmin(): Promise<void> {
  const email = (process.env.ADMIN_EMAIL || 'ahmadalamin2004@gmail.com').trim().toLowerCase();
  const name = 'Ahmad Alamin';
  const rawPassword = process.env.ADMIN_PASSWORD || 'ahmad12345';

  try {
    const hashedPassword = await hashPassword(rawPassword);

    const existing = await prisma.admin.findUnique({
      where: { email },
    });

    if (existing) {
      const updated = await prisma.admin.update({
        where: { email },
        data: {
          password: hashedPassword,
          name,
        },
      });
      console.log(`✅ Admin account (${email}) password updated successfully!`);
      console.log(`👤 Name:     ${updated.name}`);
      console.log(`📧 Email:    ${updated.email}`);
      console.log(`🔑 Password: ${rawPassword}`);
      process.exit(0);
    }

    const admin = await prisma.admin.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    console.log('✅ Admin account seeded successfully!');
    console.log(`👤 Name:     ${admin.name}`);
    console.log(`📧 Email:    ${admin.email}`);
    console.log(`🔑 Password: ${rawPassword}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during admin seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

void seedAdmin();
