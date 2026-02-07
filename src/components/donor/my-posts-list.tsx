'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { deletePost, togglePostStatus } from '@/app/actions/manage-posts';
import { approveTransaction } from '@/app/actions/transaction';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function MyPostsList({ posts }: { posts: any[] }) {
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (postId: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        setDeletingId(postId);
        const result = await deletePost(postId);
        setDeletingId(null);

        if (result.success) {
            toast.success(result.message);
            window.location.reload();
        } else {
            toast.error(result.message);
        }
    };

    const handleToggle = async (postId: string) => {
        const result = await togglePostStatus(postId);
        if (result.success) {
            toast.success(result.message);
            window.location.reload();
        } else {
            toast.error(result.message);
        }
    };

    const handleApprove = async (transactionId: string) => {
        const result = await approveTransaction(transactionId);
        if (result.success) {
            toast.success(result.message, {
                description: 'Transaction completed successfully.',
                action: {
                    label: 'Refresh',
                    onClick: () => window.location.reload(),
                }
            });
            setTimeout(() => window.location.reload(), 1500);
        } else {
            toast.error(result.message);
        }
    };

    if (posts.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg border border-dashed">
                <h3 className="text-lg font-medium text-gray-900">No posts yet</h3>
                <p className="mt-1 text-sm text-gray-500">Create your first food donation post!</p>
                <Link href="/dashboard/donor/create" className="mt-4 inline-block">
                    <Button>Create Post</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {posts.map((post: any) => {
                const isExpired = new Date(post.expiryTime) < new Date();
                const hasTransaction = !!post.transaction;
                const pendingRequests = post.requests.length;
                const txStatus = post.transaction?.status;

                return (
                    <Card key={post.id} className={`${post.status === 'COMPLETED' ? 'bg-gray-50' :
                        post.status === 'RESERVED' ? 'border-yellow-300 bg-yellow-50/20' :
                            post.status === 'INACTIVE' ? 'opacity-60' : ''
                        }`}>
                        <CardHeader>
                            <div className="flex justify-between items-start gap-2">
                                <CardTitle className="text-lg">{post.title}</CardTitle>
                                <div className="flex gap-2">
                                    <Badge variant={
                                        post.status === 'ACTIVE' ? 'default' :
                                            post.status === 'RESERVED' ? 'secondary' :
                                                post.status === 'COMPLETED' ? 'outline' : 'destructive'
                                    }>
                                        {post.status}
                                    </Badge>
                                    <Badge variant={post.foodType === 'VEG' ? 'default' : 'secondary'}>
                                        {post.foodType}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-sm text-muted-foreground line-clamp-2">{post.description}</p>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Quantity:</span>
                                    <span className="font-medium ml-2">{post.quantity}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Expiry:</span>
                                    <span className={`font-medium ml-2 ${isExpired ? 'text-red-500' : ''}`}>
                                        {isExpired ? 'Expired' : formatDistanceToNow(new Date(post.expiryTime), { addSuffix: true })}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Posted:</span>
                                    <span className="font-medium ml-2">{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Location:</span>
                                    <span className="font-medium ml-2">{post.pickupAddress.split(',')[0]}</span>
                                </div>
                            </div>

                            {pendingRequests > 0 && (
                                <div className="bg-blue-50 p-2 rounded text-sm text-blue-700">
                                    📨 {pendingRequests} pending request{pendingRequests > 1 ? 's' : ''}
                                </div>
                            )}

                            {hasTransaction && (
                                <div className="bg-green-50 p-3 rounded text-sm space-y-1">
                                    <div className="font-semibold text-green-800">
                                        Receiver: {post.transaction.receiver.name || 'Anonymous'}
                                    </div>
                                    <div className="text-green-700">
                                        📞 {post.transaction.receiver.phone || 'No phone'}
                                    </div>
                                    {txStatus === 'WAITING_APPROVAL' && (
                                        <div className="pt-2">
                                            <p className="text-yellow-700 font-medium mb-2">Receiver marked as picked up. Please approve.</p>
                                            <Button
                                                className="w-full bg-green-600 hover:bg-green-700"
                                                onClick={() => handleApprove(post.transaction.id)}
                                            >
                                                ✅ Approve Completion
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex gap-2">
                            {post.status === 'ACTIVE' && !isExpired && (
                                <Link href={`/dashboard/donor/my-posts/edit/${post.id}`} className="flex-1">
                                    <Button variant="outline" className="w-full">✏️ Edit</Button>
                                </Link>
                            )}

                            {pendingRequests > 0 && post.status === 'ACTIVE' && (
                                <Link href="/dashboard/donor/requests" className="flex-1">
                                    <Button variant="default" className="w-full">View Requests ({pendingRequests})</Button>
                                </Link>
                            )}

                            {!hasTransaction && post.status !== 'COMPLETED' && (
                                <Button
                                    variant="destructive"
                                    onClick={() => handleDelete(post.id)}
                                    disabled={deletingId === post.id}
                                >
                                    {deletingId === post.id ? 'Deleting...' : '🗑️ Delete'}
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
}
