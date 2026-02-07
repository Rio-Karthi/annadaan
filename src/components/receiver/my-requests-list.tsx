'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cancelRequest } from '@/app/actions/manage-requests';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function MyRequestsList({ requests }: { requests: any[] }) {
    const handleCancel = async (requestId: string) => {
        if (!confirm('Are you sure you want to cancel this request?')) return;

        const result = await cancelRequest(requestId);
        if (result.success) {
            toast.success(result.message);
            window.location.reload();
        } else {
            toast.error(result.message);
        }
    };

    if (requests.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg border border-dashed">
                <h3 className="text-lg font-medium text-gray-900">No requests yet</h3>
                <p className="mt-1 text-sm text-gray-500">Browse the feed and request food to see your requests here.</p>
                <Link href="/dashboard/receiver/feed" className="mt-4 inline-block">
                    <Button>Browse Available Food</Button>
                </Link>
            </div>
        );
    }

    // Separate by status
    const pending = requests.filter(r => r.status === 'PENDING');
    const accepted = requests.filter(r => r.status === 'ACCEPTED');
    const rejected = requests.filter(r => r.status === 'REJECTED');

    return (
        <div className="space-y-6">
            {/* Accepted Requests */}
            {accepted.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-green-700">✅ Accepted ({accepted.length})</h2>
                    <div className="grid gap-4">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {accepted.map((req: any) => (
                            <Card key={req.id} className="border-green-300 bg-green-50/20">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg">{req.post.title}</CardTitle>
                                        <Badge variant="default">ACCEPTED</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <span className="text-muted-foreground">Donor:</span>
                                            <p className="font-medium">{req.post.donor.name || 'Anonymous'}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Quantity:</span>
                                            <p className="font-medium">{req.post.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Requested {formatDistanceToNow(new Date(req.createdAt), { addSuffix: true })}
                                    </p>
                                </CardContent>
                                <CardFooter>
                                    <Link href="/dashboard/receiver/pickups" className="w-full">
                                        <Button className="w-full">View in My Pickups →</Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Pending Requests */}
            {pending.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-orange-700">⏳ Pending ({pending.length})</h2>
                    <div className="grid gap-4">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {pending.map((req: any) => (
                            <Card key={req.id} className="border-orange-300 bg-orange-50/20">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg">{req.post.title}</CardTitle>
                                        <Badge variant="secondary">PENDING</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="bg-white p-2 rounded text-sm">
                                        <p className="text-muted-foreground mb-1">Your message:</p>
                                        <p className="italic">&quot;{req.message}&quot;</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <span className="text-muted-foreground">Donor:</span>
                                            <p className="font-medium">{req.post.donor.name || 'Anonymous'}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Type:</span>
                                            <p className="font-medium">{req.post.foodType}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Requested {formatDistanceToNow(new Date(req.createdAt), { addSuffix: true })}
                                    </p>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        variant="destructive"
                                        className="w-full"
                                        onClick={() => handleCancel(req.id)}
                                    >
                                        ❌ Cancel Request
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Rejected Requests */}
            {rejected.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-red-700">❌ Rejected ({rejected.length})</h2>
                    <div className="grid gap-4">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {rejected.map((req: any) => (
                            <Card key={req.id} className="border-red-300 bg-red-50/20 opacity-75">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg">{req.post.title}</CardTitle>
                                        <Badge variant="destructive">REJECTED</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        The donor accepted another request for this food.
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Requested {formatDistanceToNow(new Date(req.createdAt), { addSuffix: true })}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
