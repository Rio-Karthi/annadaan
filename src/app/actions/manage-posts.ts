'use server';

import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updatePost(postId: string, prevState: any, formData: FormData) {
    const { userId } = await auth();
    if (!userId) {
        return { message: 'Unauthorized', success: false };
    }

    try {
        // Verify ownership
        const post = await prisma.foodPost.findUnique({
            where: { id: postId },
            select: { donorId: true, status: true }
        });

        if (!post || post.donorId !== userId) {
            return { message: 'Unauthorized', success: false };
        }

        // Can't edit if already reserved/completed
        if (post.status !== 'ACTIVE') {
            return { message: 'Cannot edit posts that are reserved or completed', success: false };
        }

        const showExactLocation = formData.get('showExactLocation') === 'on';

        await prisma.foodPost.update({
            where: { id: postId },
            data: {
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                foodType: formData.get('foodType') as 'VEG' | 'NON_VEG' | 'BOTH',
                quantity: formData.get('quantity') as string,
                expiryTime: new Date(formData.get('expiryTime') as string),
                pickupAddress: formData.get('address') as string,
                showExactMap: showExactLocation,
            }
        });

        revalidatePath('/dashboard/donor/my-posts');
        revalidatePath('/dashboard/receiver/feed');
        return { message: 'Post updated successfully!', success: true };

    } catch (e) {
        console.error('Update post error:', e);
        return { message: 'Failed to update post', success: false };
    }
}

export async function deletePost(postId: string) {
    const { userId } = await auth();
    if (!userId) {
        return { message: 'Unauthorized', success: false };
    }

    try {
        const post = await prisma.foodPost.findUnique({
            where: { id: postId },
            select: { donorId: true, status: true },
            include: {
                requests: { where: { status: 'ACCEPTED' } },
                transaction: true
            }
        });

        if (!post || post.donorId !== userId) {
            return { message: 'Unauthorized', success: false };
        }

        // Can't delete if it has an active transaction
        if (post.transaction) {
            return { message: 'Cannot delete posts with active pickups', success: false };
        }

        // Delete all pending requests first
        await prisma.request.deleteMany({
            where: { postId }
        });

        // Delete the post
        await prisma.foodPost.delete({
            where: { id: postId }
        });

        revalidatePath('/dashboard/donor/my-posts');
        revalidatePath('/dashboard/receiver/feed');
        return { message: 'Post deleted successfully!', success: true };

    } catch (e) {
        console.error('Delete post error:', e);
        return { message: 'Failed to delete post', success: false };
    }
}

export async function togglePostStatus(postId: string) {
    const { userId } = await auth();
    if (!userId) {
        return { message: 'Unauthorized', success: false };
    }

    try {
        const post = await prisma.foodPost.findUnique({
            where: { id: postId },
            select: { donorId: true, status: true }
        });

        if (!post || post.donorId !== userId) {
            return { message: 'Unauthorized', success: false };
        }

        // Can only toggle between ACTIVE and INACTIVE (not RESERVED/COMPLETED)
        if (post.status === 'RESERVED' || post.status === 'COMPLETED') {
            return { message: 'Cannot toggle status of reserved or completed posts', success: false };
        }

        const newStatus = post.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

        await prisma.foodPost.update({
            where: { id: postId },
            data: { status: newStatus }
        });

        revalidatePath('/dashboard/donor/my-posts');
        revalidatePath('/dashboard/receiver/feed');
        return { message: `Post marked as ${newStatus.toLowerCase()}!`, success: true };

    } catch (e) {
        console.error('Toggle status error:', e);
        return { message: 'Failed to update status', success: false };
    }
}
