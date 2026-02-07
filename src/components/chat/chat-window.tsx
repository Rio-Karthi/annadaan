'use client';

import { useState, useEffect, useRef } from 'react';
import { getMessages, sendMessage } from '@/app/actions/chat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ChatWindow({ chatRoomId, initialMessages, otherPartyName, currentUserId }: any) {
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);

    // Poll for messages
    useEffect(() => {
        const interval = setInterval(async () => {
            const freshMessages = await getMessages(chatRoomId);
            setMessages(freshMessages);
        }, 3000);
        return () => clearInterval(interval);
    }, [chatRoomId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        await sendMessage(chatRoomId, newMessage);
        setNewMessage('');
        const fresh = await getMessages(chatRoomId);
        setMessages(fresh);
    };

    return (
        <Card className="flex flex-col h-[600px]">
            <CardHeader className="border-b px-4 py-3 bg-white/80 backdrop-blur">
                <CardTitle className="text-lg font-medium">Chat with {otherPartyName}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {messages.map((msg: any) => {
                    const isMe = msg.senderId === currentUserId;
                    return (
                        <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            <div className={`p-3 rounded-lg max-w-[80%] ${isMe ? 'bg-primary text-primary-foreground' : 'bg-white border text-foreground'}`}>
                                <p className="text-sm">{msg.message}</p>
                            </div>
                            <span className="text-[10px] text-gray-400 mt-1 px-1">
                                {isMe ? 'You' : msg.sender.name}
                            </span>
                        </div>
                    )
                })}
                <div ref={bottomRef} />
            </CardContent>
            <CardFooter className="border-t p-3 bg-white">
                <form onSubmit={handleSend} className="flex w-full gap-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1"
                    />
                    <Button type="submit">Send</Button>
                </form>
            </CardFooter>
        </Card>
    );
}
