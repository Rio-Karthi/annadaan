'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { markAsRead, markAllAsRead } from '@/app/actions/notifications';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { BellRing, Check, Info, AlertTriangle, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function NotificationsList({ notifications }: { notifications: any[] }) {
    const router = useRouter();

    const handleRead = async (id: string, link?: string) => {
        await markAsRead(id);
        if (link) {
            router.push(link);
        } else {
            router.refresh();
        }
    };

    const handleMarkAllRead = async () => {
        await markAllAsRead();
        toast.success("All notifications marked as read");
        router.refresh();
    };

    const hasUnread = notifications.some(n => !n.read);

    return (
        <div className="space-y-4">
            {notifications.length > 0 && hasUnread && (
                <div className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="gap-2">
                        <CheckCheck className="w-4 h-4" />
                        Mark all as read
                    </Button>
                </div>
            )}

            {notifications.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 bg-white rounded-lg border border-dashed"
                >
                    <BellRing className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
                    <p className="mt-1 text-sm text-gray-500">You&apos;re all caught up!</p>
                </motion.div>
            ) : (
                <AnimatePresence>
                    {notifications.map((n: any, index: number) => (
                        <motion.div
                            key={n.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card
                                className={`transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-[1.01] ${!n.read ? 'border-l-4 border-l-orange-500 bg-orange-50/10' : ''}`}
                                onClick={() => handleRead(n.id, n.link)}
                            >
                                <CardContent className="p-4 flex gap-4 items-start">
                                    <div className={`p-2 rounded-full mt-1 ${n.type === 'SUCCESS' ? 'bg-green-100 text-green-600' :
                                            n.type === 'WARNING' ? 'bg-red-100 text-red-600' :
                                                'bg-blue-100 text-blue-600'
                                        }`}>
                                        {n.type === 'SUCCESS' ? <Check size={18} /> :
                                            n.type === 'WARNING' ? <AlertTriangle size={18} /> :
                                                <Info size={18} />}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex justify-between items-start">
                                            <p className={`text-sm font-medium ${!n.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                                {n.message}
                                            </p>
                                            {!n.read && <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200 text-[10px]">NEW</Badge>}
                                        </div>
                                        <p className="text-xs text-gray-400">
                                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            )}
        </div>
    );
}
