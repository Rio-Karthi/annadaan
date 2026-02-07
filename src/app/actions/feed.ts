'use server';

import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function getFeedPosts() {
    const { userId } = await auth();
    if (!userId) return [];

    try {
        const posts = await prisma.foodPost.findMany({
            where: {
                status: 'ACTIVE',
                expiryTime: {
                    gt: new Date(),
                },
            },
            include: {
                donor: {
                    select: {
                        name: true,
                        organization: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return posts;
    } catch (error) {
        console.error('Error fetching feed:', error);
        return [];
    }
}
