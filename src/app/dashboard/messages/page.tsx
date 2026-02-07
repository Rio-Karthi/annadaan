import { getChats } from '@/app/actions/chat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default async function MessagesPage() {
    const chats = await getChats();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Messages</h1>
            {chats.length === 0 ? (
                <p className="text-muted-foreground">No active conversations yet.</p>
            ) : (
                <div className="grid gap-3">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {chats.map((chat: any) => (
                        <Link key={chat.id} href={`/dashboard/messages/${chat.chatRoomId}`}>
                            <Card className="hover:bg-gray-50 transition cursor-pointer">
                                <CardHeader className="pb-3">
                                    <div className="flex gap-3 items-center">
                                        <Avatar>
                                            <AvatarImage src={chat.otherPartyImage} />
                                            <AvatarFallback>{chat.otherPartyName[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <CardTitle className="text-base">{chat.otherPartyName}</CardTitle>
                                            <p className="text-xs text-muted-foreground">{chat.postTitle}</p>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(chat.lastMessageTime), { addSuffix: true })}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
