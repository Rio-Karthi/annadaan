'use server';

import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getNotifications() {
    const { userId } = await auth();
    if (!userId) return [];

    try {
        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        return notifications;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
}

export async function markAsRead(id: string) {
    const { userId } = await auth();
    if (!userId) return;

    try {
        await prisma.notification.update({
            where: { id, userId },
            data: { read: true },
        });
        revalidatePath('/dashboard/notifications');
    } catch (error) {
        console.error('Error marking notification as read:', error);
    }
}

export async function markAllAsRead() {
    const { userId } = await auth();
    if (!userId) return;

    try {
        await prisma.notification.updateMany({
            where: { userId, read: false },
            data: { read: true },
        });
        revalidatePath('/dashboard/notifications');
        revalidatePath('/dashboard'); // Update sidebar badge
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
    }
}

export async function createNotification(userId: string, type: 'INFO' | 'SUCCESS' | 'WARNING', message: string, link?: string) {
    try {
        await prisma.notification.create({
            data: {
                userId,
                type,
                message,
                link,
            }
        });
    } catch (error) {
        console.error('Error creating notification:', error);
    }
}

export async function getUnreadCount() {
    const { userId } = await auth();
    if (!userId) return 0;

    try {
        return await prisma.notification.count({
            where: {
                userId,
                read: false,
            }
        });
    } catch (error) {
        return 0;
    }
}
