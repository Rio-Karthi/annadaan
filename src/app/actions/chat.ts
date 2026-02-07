'use server';

import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { createNotification } from './notifications';

export async function getChats() {
    const { userId } = await auth();
    if (!userId) return [];

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    try {
        const transactions = await prisma.transaction.findMany({
            where: {
                OR: [
                    { donorId: user.id },
                    { receiverId: user.id }
                ]
            },
            include: {
                post: true,
                donor: { select: { name: true, image: true } },
                receiver: { select: { name: true, image: true } },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return transactions.map((tx: any) => {
            const isDonor = tx.donorId === user.id;
            const otherParty = isDonor ? tx.receiver : tx.donor;
            return {
                id: tx.id,
                chatRoomId: tx.chatRoomId,
                postTitle: tx.post.title,
                otherPartyName: otherParty.name || 'Anonymous',
                otherPartyImage: otherParty.image,
                lastMessage: tx.messages[0]?.message || 'Start chatting...',
                lastMessageTime: tx.messages[0]?.createdAt || tx.createdAt,
                status: tx.status,
            };
        });
    } catch (e) {
        console.error("Failed to fetch chats:", e);
        return [];
    }
}

export async function getMessages(chatRoomId: string) {
    const { userId } = await auth();
    if (!userId) return [];

    try {
        return await prisma.chatMessage.findMany({
            where: { transaction: { chatRoomId } },
            orderBy: { createdAt: 'asc' },
            include: {
                sender: { select: { name: true, id: true } }
            }
        });
    } catch (e) {
        console.error("Failed to fetch messages:", e);
        return [];
    }
}

export async function sendMessage(chatRoomId: string, message: string) {
    const { userId } = await auth();
    if (!userId || !message.trim()) return { success: false };

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { success: false };

    const transaction = await prisma.transaction.findUnique({
        where: { chatRoomId }
    });

    if (!transaction) return { success: false };

    await prisma.chatMessage.create({
        data: {
            transactionId: transaction.id,
            senderId: user.id,
            message: message.trim(),
        }
    });

    // Determine receiver (the one who is NOT the current user)
    const receiverId = transaction.donorId === userId ? transaction.receiverId : transaction.donorId;

    // Notify Receiver
    if (receiverId) {
        await createNotification(
            receiverId,
            'INFO',
            `New message from ${user.name}`,
            `/dashboard/messages/${chatRoomId}`
        );
    }

    revalidatePath(`/dashboard/messages/${chatRoomId}`);
    return { success: true, message: 'Message sent' };
}
