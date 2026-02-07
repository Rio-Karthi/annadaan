'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { createNotification } from './notifications';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createRequest(prevState: any, formData: FormData) {
    const { userId } = await auth();
    if (!userId) {
        return { message: 'Unauthorized', success: false };
    }

    const postId = formData.get('postId') as string;
    const message = formData.get('message') as string;

    if (!postId || !message) {
        return { message: 'Missing fields', success: false };
    }

    try {
        // Get or create user
        const clerkUser = await currentUser();
        if (!clerkUser) return { message: 'Unauthorized', success: false };

        let user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    id: userId,
                    email: clerkUser.emailAddresses[0].emailAddress,
                    name: `${clerkUser.firstName} ${clerkUser.lastName}`.trim(),
                    phone: clerkUser.phoneNumbers[0]?.phoneNumber || null,
                    image: clerkUser.imageUrl,
                    role: 'RECEIVER',
                }
            });
        } else {
            // Update if missing name
            if (!user.name || !user.image) {
                user = await prisma.user.update({
                    where: { id: userId },
                    data: {
                        name: `${clerkUser.firstName} ${clerkUser.lastName}`.trim(),
                        image: clerkUser.imageUrl,
                    }
                });
            }
        }

        // Get the food post
        const post = await prisma.foodPost.findUnique({
            where: { id: postId },
            select: { donorId: true, status: true }
        });

        if (!post) {
            return { message: 'Food post not found', success: false };
        }

        // ✅ PREVENT SELF-REQUESTS
        if (post.donorId === user.id) {
            return { message: 'You cannot request your own food post!', success: false };
        }

        // Check if post is still available
        if (post.status !== 'ACTIVE') {
            return { message: 'This food is no longer available', success: false };
        }

        // Check if already requested
        const existingRequest = await prisma.request.findFirst({
            where: {
                postId,
                receiverId: user.id,
            }
        });

        if (existingRequest) {
            return { message: 'You have already requested this item.', success: false };
        }

        await prisma.request.create({
            data: {
                postId,
                receiverId: user.id,
                message,
                status: 'PENDING',
            }
        });

        // Notify Donor
        await createNotification(
            post.donorId,
            'INFO',
            `New request for "${post.title}" from ${user.name || 'a user'}!`,
            '/dashboard/donor/requests'
        );

        revalidatePath('/dashboard/receiver/feed');
        return { message: 'Request sent successfully!', success: true };

    } catch (e) {
        console.error(e);
        return { message: 'Failed to send request.', success: false };
    }
}
