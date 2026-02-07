import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import MyPostsList from '@/components/donor/my-posts-list';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function MyPostsPage() {
    const { userId } = await auth();
    if (!userId) return <div>Unauthorized</div>;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    const posts = await prisma.foodPost.findMany({
        where: {
            donorId: user?.id
        },
        include: {
            requests: {
                where: { status: 'PENDING' },
                select: { id: true }
            },
            transaction: {
                select: {
                    id: true,
                    status: true,
                    receiver: { select: { name: true, email: true, phone: true } }
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">My Food Posts</h1>
                    <p className="text-muted-foreground mt-1">Manage all your food donations</p>
                </div>
                <Link href="/dashboard/donor/create">
                    <Button>➕ Create New Post</Button>
                </Link>
            </div>
            <MyPostsList posts={posts} />
        </div>
    );
}
