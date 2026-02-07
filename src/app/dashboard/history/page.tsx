import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

export default async function HistoryPage() {
    const { userId } = await auth();
    if (!userId) return <div>Unauthorized</div>;

    if (!userId) return <div>Unauthorized</div>;

    const transactions = await prisma.transaction.findMany({
        where: {
            OR: [
                { donorId: userId },
                { receiverId: userId }
            ]
        },
        include: {
            post: true,
            donor: true,
            receiver: true
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Transaction History</h1>
            <div className="grid gap-4">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {transactions.map((tx: any) => (
                    <Card key={tx.id}>
                        <CardHeader>
                            <CardTitle className="text-lg">{tx.post.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Status:</span>
                                    <span className="font-semibold ml-2">{tx.status}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Date:</span>
                                    <span className="font-semibold ml-2">{formatDistanceToNow(new Date(tx.createdAt), { addSuffix: true })}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Role:</span>
                                    <span className="font-semibold ml-2">{tx.donorId === userId ? 'Donor' : 'Receiver'}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Other Party:</span>
                                    <span className="font-semibold ml-2">{tx.donorId === userId ? tx.receiver.name : tx.donor.name}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {transactions.length === 0 && <p className="text-muted-foreground">No history yet.</p>}
            </div>
        </div>
    );
}
