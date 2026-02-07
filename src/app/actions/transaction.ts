'use server';

import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { createNotification } from './notifications';

export async function acceptRequest(requestId: string) {
    const { userId } = await auth();
    if (!userId) {
        return { message: 'Unauthorized', success: false };
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('User not found');

        const request = await prisma.request.findUnique({
            where: { id: requestId },
            include: {
                post: true,
                receiver: { select: { id: true, name: true, email: true } }
            }
        });

        if (!request) return { message: 'Request not found', success: false };

        // Verify the current user is the donor
        if (request.post.donorId !== user.id) {
            return { message: 'Unauthorized action.', success: false };
        }

        // Check if post is still available
        if (request.post.status !== 'ACTIVE') {
            return { message: 'This food post is no longer available', success: false };
        }

        // Start transaction to ensure data integrity
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transaction = await prisma.$transaction(async (tx: any) => {
            // 1. Update request status to ACCEPTED
            await tx.request.update({
                where: { id: requestId },
                data: { status: 'ACCEPTED' }
            });

            // 2. Reject all other pending requests for this post
            await tx.request.updateMany({
                where: {
                    postId: request.postId,
                    id: { not: requestId },
                    status: 'PENDING'
                },
                data: { status: 'REJECTED' }
            });

            // 3. Mark food post as RESERVED
            await tx.foodPost.update({
                where: { id: request.postId },
                data: { status: 'RESERVED' }
            });

            // 4. Create Transaction Record with unique chatRoomId
            const newTx = await tx.transaction.create({
                data: {
                    postId: request.postId,
                    donorId: user.id,
                    receiverId: request.receiverId,
                    status: 'IN_PROGRESS',
                    chatRoomId: `chat-${Date.now()}-${request.postId}`, // Unique chat room
                }
            });

            return newTx;
        });

        // Revalidate all relevant paths
        revalidatePath('/dashboard/donor/requests');
        revalidatePath('/dashboard/messages');
        revalidatePath('/dashboard/receiver/pickups');
        revalidatePath('/dashboard/receiver/feed');

        return {
            success: true,
            transactionId: transaction.id,
            chatRoomId: transaction.chatRoomId,
            message: 'Request accepted! Chat room created.'
        };

    } catch (e) {
        console.error('Accept request error:', e);
        return { message: 'Failed to accept request. Please try again.', success: false };
    }
}

export async function markAsPickedUp(transactionId: string) {
    const { userId } = await auth();
    if (!userId) return { message: 'Unauthorized', success: false };

    try {
        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId }
        });

        if (!transaction) return { message: 'Transaction not found', success: false };

        if (transaction.receiverId !== userId) {
            return { message: 'Only the receiver can mark as picked up', success: false };
        }

        // Update transaction status
        const updatedTx = await prisma.transaction.update({
            where: { id: transactionId },
            data: { status: 'WAITING_APPROVAL' },
            include: { post: true, receiver: true }
        });

        // Notify Donor (non-blocking)
        try {
            await createNotification(
                updatedTx.donorId,
                'INFO',
                `${updatedTx.receiver.name || 'Receiver'} has picked up "${updatedTx.post.title}". Please approve completion.`,
                '/dashboard/donor/my-posts'
            );
        } catch (notifyError) {
            console.error('Failed to send notification for pickup:', notifyError);
        }

        revalidatePath('/dashboard/receiver/pickups');
        revalidatePath('/dashboard/donor/my-posts');
        return { success: true, message: 'Marked as picked up. Waiting for donor approval.' };
    } catch (e) {
        console.error('Mark pickup error:', e);
        return { message: 'Failed to update status', success: false };
    }
}

export async function approveTransaction(transactionId: string) {
    const { userId } = await auth();
    if (!userId) return { message: 'Unauthorized', success: false };

    try {
        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId }
        });

        if (!transaction) return { message: 'Transaction not found', success: false };

        if (transaction.donorId !== userId) {
            return { message: 'Only the donor can approve completion', success: false };
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await prisma.$transaction(async (tx: any) => {
            await tx.transaction.update({
                where: { id: transactionId },
                data: {
                    status: 'COMPLETED',
                    completedAt: new Date()
                }
            });

            await tx.foodPost.update({
                where: { id: transaction.postId },
                data: { status: 'COMPLETED' }
            });
        });

        // Fetch post details for notification
        const post = await prisma.foodPost.findUnique({
            where: { id: transaction.postId },
            select: { title: true }
        });

        // Notify Receiver
        if (post) {
            await createNotification(
                transaction.receiverId,
                'SUCCESS',
                `Your pickup for "${post.title}" has been approved by the donor!`,
                `/dashboard/messages/${transaction.chatRoomId}`
            );
        }

        revalidatePath('/dashboard/donor/my-posts');
        revalidatePath('/dashboard/receiver/pickups');
        revalidatePath('/dashboard/history');

        return { success: true, message: 'Transaction approved and completed!' };
    } catch (e) {
        console.error('Approve transaction error:', e);
        return { message: 'Failed to approve transaction', success: false };
    }
}
