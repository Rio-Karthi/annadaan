import { getMessages } from '@/app/actions/chat';
import ChatWindow from '@/components/chat/chat-window';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

export default async function ChatPage({ params }: { params: { chatRoomId: string } }) {
    const { userId } = await auth();
    if (!userId) return <div>Unauthorized</div>;

    const chatRoomId = params.chatRoomId;

    const transaction = await prisma.transaction.findUnique({
        where: { chatRoomId },
        include: {
            donor: true,
            receiver: true,
            post: { select: { title: true } }
        }
    });

    if (!transaction) return notFound();

    // Verify user is part of this transaction
    if (transaction.donorId !== userId && transaction.receiverId !== userId) {
        return <div className="text-center py-12">
            <h3 className="text-lg font-medium text-red-600">Unauthorized</h3>
            <p className="text-sm text-gray-500">You don&apos;t have access to this chat.</p>
        </div>;
    }

    const initialMessages = await getMessages(chatRoomId);

    const otherPartyName = userId === transaction.donorId ? transaction.receiver.name : transaction.donor.name;

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-4">
                <h2 className="text-2xl font-bold">{transaction.post.title}</h2>
                <p className="text-sm text-muted-foreground">Chat with {otherPartyName || 'Anonymous'}</p>
            </div>
            <ChatWindow
                chatRoomId={chatRoomId}
                initialMessages={initialMessages}
                otherPartyName={otherPartyName || 'Anonymous'}
                currentUserId={userId}
            />
        </div>
    );
}
