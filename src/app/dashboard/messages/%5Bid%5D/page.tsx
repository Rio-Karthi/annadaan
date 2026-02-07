import { getMessages } from '@/app/actions/chat';
import ChatWindow from '@/components/chat/chat-window';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

export default async function ChatPage({ params }: { params: { id: string } }) {
    const { userId } = await auth();
    if (!userId) return <div>Unauthorized</div>;

    const chatRoomId = params.id;

    const transaction = await prisma.transaction.findUnique({
        where: { chatRoomId },
        include: {
            donor: true,
            receiver: true
        }
    });

    if (!transaction) return notFound();

    const initialMessages = await getMessages(chatRoomId);

    const otherPartyName = userId === transaction.donorId ? transaction.receiver.name : transaction.donor.name;

    return (
        <div className="max-w-3xl mx-auto">
            <ChatWindow
                chatRoomId={chatRoomId}
                initialMessages={initialMessages}
                otherPartyName={otherPartyName || 'Anonymous'}
                currentUserId={userId}
            />
        </div>
    );
}
