import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import EditPostForm from '@/components/donor/edit-post-form';

export default async function EditPostPage({ params }: { params: { id: string } }) {
    const { userId } = await auth();
    if (!userId) redirect('/');

    const post = await prisma.foodPost.findUnique({
        where: { id: params.id },
    });

    if (!post) return notFound();

    // Verify ownership
    if (post.donorId !== userId) {
        return <div className="text-center py-12">
            <h3 className="text-lg font-medium text-red-600">Unauthorized</h3>
            <p className="text-sm text-gray-500">You can only edit your own posts.</p>
        </div>;
    }

    // Can't edit if reserved/completed
    if (post.status !== 'ACTIVE' && post.status !== 'INACTIVE') {
        redirect('/dashboard/donor/my-posts');
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Edit Food Post</h1>
                <p className="text-muted-foreground mt-1">Update your food donation details</p>
            </div>
            <EditPostForm post={post} />
        </div>
    );
}
