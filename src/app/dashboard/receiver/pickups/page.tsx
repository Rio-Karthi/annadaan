import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import PickupsPageClient from '@/components/receiver/pickups-list';

export default async function PickupsPage() {
    const { userId } = await auth();
    if (!userId) return <div>Unauthorized</div>;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    const transactions = await prisma.transaction.findMany({
        where: {
            receiverId: user?.id,
            status: 'IN_PROGRESS'
        },
        include: {
            post: true,
            donor: {
                select: {
                    name: true,
                    email: true,
                    phone: true,
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">My Pickups</h1>
                    <p className="text-muted-foreground mt-1">Active food pickups and coordination</p>
                </div>
            </div>
            <PickupsPageClient transactions={transactions} />
        </div>
    );
}
