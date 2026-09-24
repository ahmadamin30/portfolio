import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export const testConnection = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Successfully connected to MySQL database via Prisma');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
};

export default prisma;
