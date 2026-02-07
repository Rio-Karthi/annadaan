'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import RequestModal from './request-modal';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@clerk/nextjs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function FoodCard({ post }: { post: any }) {
    const { userId } = useAuth();
    const isExpired = new Date(post.expiryTime) < new Date();
    const isOwnPost = post.donorId === userId;

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video relative bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={post.images[0] || '/placeholder.jpg'}
                    alt={post.title}
                    className="w-full h-full object-cover"
                />
                {isExpired && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="destructive">Expired</Badge>
                    </div>
                )}
            </div>
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                    <Badge variant={post.foodType === 'VEG' ? 'default' : 'secondary'}>
                        {post.foodType.replace('_', ' ')}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
                <p className="text-muted-foreground line-clamp-2">{post.description}</p>
                <div className="flex justify-between items-center pt-2">
                    <span className="font-medium">Quantity: {post.quantity}</span>
                    <span className={`text-xs ${isExpired ? 'text-red-500' : 'text-orange-500'}`}>
                        {isExpired ? 'Expired' : `Expires ${formatDistanceToNow(new Date(post.expiryTime), { addSuffix: true })}`}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <span>📍</span>
                    <span className="text-xs">
                        {post.showExactMap ? post.pickupAddress : `Near ${post.pickupAddress.split(',')[0]}`}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                        By: {post.donor.name || 'Anonymous'}
                        {post.donor.organization && ` (${post.donor.organization})`}
                    </span>
                </div>
            </CardContent>
            <CardFooter>
                {isOwnPost ? (
                    <Badge variant="outline" className="w-full justify-center">Your Post</Badge>
                ) : isExpired ? (
                    <Badge variant="destructive" className="w-full justify-center">Expired</Badge>
                ) : (
                    <RequestModal postId={post.id} />
                )}
            </CardFooter>
        </Card>
    );
}
