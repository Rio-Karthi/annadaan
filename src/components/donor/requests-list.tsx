'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { acceptRequest } from '@/app/actions/transaction';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function RequestsPageClient({ requests }: { requests: any[] }) {
    const handleAccept = async (requestId: string) => {
        const result = await acceptRequest(requestId);
        if (result.success) {
            toast.success(result.message || 'Request accepted!', {
                description: 'You can now chat with the receiver.',
                action: {
                    label: 'Refresh',
                    onClick: () => window.location.reload(),
                }
            });
            setTimeout(() => window.location.reload(), 1500);
        } else {
            toast.error(result.message || 'Failed to accept request');
        }
    };

    if (requests.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg border border-dashed">
                <h3 className="text-lg font-medium text-gray-900">No pending requests</h3>
                <p className="mt-1 text-sm text-gray-500">Requests will appear here when receivers request your food.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {requests.map((req: any) => (
                <Card key={req.id} className="border-l-4 border-l-orange-500">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle>Request for: {req.post.title}</CardTitle>
                                <CardDescription>
                                    From: {req.receiver.name || req.receiver.email || 'Receiver'} • {formatDistanceToNow(new Date(req.createdAt), { addSuffix: true })}
                                </CardDescription>
                            </div>
                            <Badge variant="outline">{req.post.foodType}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm font-semibold text-gray-500 mb-1">Receiver&apos;s Message:</p>
                            <p className="text-sm italic">&quot;{req.message || 'No message provided'}&quot;</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="text-muted-foreground">Quantity:</span>
                                <span className="font-medium ml-2">{req.post.quantity}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Expiry:</span>
                                <span className="font-medium ml-2">
                                    {formatDistanceToNow(new Date(req.post.expiryTime), { addSuffix: true })}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-2 justify-end pt-2">
                            <Button onClick={() => handleAccept(req.id)} variant="default">
                                ✅ Accept Request
                            </Button>
                            <Button variant="outline">❌ Ignore</Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
