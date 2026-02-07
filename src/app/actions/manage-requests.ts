'use server';

import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function cancelRequest(requestId: string) {
    const { userId } = await auth();
    if (!userId) {
        return { message: 'Unauthorized', success: false };
    }

    try {
        const request = await prisma.request.findUnique({
            where: { id: requestId },
            include: { post: true }
        });

        if (!request) {
            return { message: 'Request not found', success: false };
        }

        // Verify the current user is the receiver who made the request
        if (request.receiverId !== userId) {
            return { message: 'Unauthorized action', success: false };
        }

        // Can't cancel if already accepted
        if (request.status === 'ACCEPTED') {
            return { message: 'Cannot cancel accepted requests. Please coordinate with the donor.', success: false };
        }

        // Delete the request
        await prisma.request.delete({
            where: { id: requestId }
        });

        revalidatePath('/dashboard/receiver/my-requests');
        revalidatePath('/dashboard/donor/requests');

        return { message: 'Request cancelled successfully!', success: true };

    } catch (e) {
        console.error('Cancel request error:', e);
        return { message: 'Failed to cancel request', success: false };
    }
}

export async function getMyRequests() {
    const { userId } = await auth();
    if (!userId) return [];

    try {
        const requests = await prisma.request.findMany({
            where: {
                receiverId: userId
            },
            include: {
                post: {
                    include: {
                        donor: {
                            select: { name: true, email: true, organization: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return requests;
    } catch (e) {
        console.error('Get requests error:', e);
        return [];
    }
}
