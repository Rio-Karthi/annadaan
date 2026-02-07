import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import RequestsPageClient from '@/components/donor/requests-list';

export default async function RequestsPage() {
    const { userId } = await auth();
    if (!userId) return <div>Unauthorized</div>;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    // Fetch requests for posts created by this donor
    const requests = await prisma.request.findMany({
        where: {
            post: {
                donorId: user?.id
            },
            status: 'PENDING'
        },
        include: {
            post: true,
            receiver: {
                select: {
                    name: true,
                    email: true,
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Incoming Requests</h1>
                    <p className="text-muted-foreground mt-1">Review and accept food pickup requests</p>
                </div>
            </div>
            <RequestsPageClient requests={requests} />
        </div>
    );
}
