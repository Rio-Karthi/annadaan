import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prismaClientSingleton = () => {
    // For Prisma 7 with Accelerate, pass the connection URL via accelerateUrl
    const client = new PrismaClient({
        accelerateUrl: process.env.DATABASE_URL,
    });

    return client.$extends(withAccelerate());
};

declare global {
    // eslint-disable-next-line no-var
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
