'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { markAsPickedUp } from '@/app/actions/transaction';
import { toast } from 'sonner';
import LocationMap from '@/components/maps/location-map';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PickupsPageClient({ transactions }: { transactions: any[] }) {
    const handleComplete = async (transactionId: string) => {
        const result = await markAsPickedUp(transactionId);
        if (result.success) {
            toast.success(result.message, {
                description: 'Waiting for donor approval to finalize.',
                action: {
                    label: 'Refresh',
                    onClick: () => window.location.reload(),
                },
            });
            // Auto reload after short delay to let toast be seen, or just rely on state update if we had it. 
            // For now, keeping reload.
            setTimeout(() => window.location.reload(), 1500);
        } else {
            toast.error(result.message);
        }
    };

    if (transactions.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg border border-dashed">
                <h3 className="text-lg font-medium text-gray-900">No active pickups</h3>
                <p className="mt-1 text-sm text-gray-500">Request food to see your pickups here.</p>
                <Link href="/dashboard/receiver/feed" className="mt-4 inline-block">
                    <Button>Browse Available Food</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {transactions.map((tx: any) => (
                <div key={tx.id} className="space-y-4">
                    <Card className="border-green-200 bg-green-50/20">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle>{tx.post.title}</CardTitle>
                                <Badge variant="default">{tx.status}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Donor:</span>
                                    <p className="font-medium">{tx.donor.name || tx.donor.email || 'Donor'}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Contact:</span>
                                    <p className="font-medium">{tx.donor.email}</p>
                                    {tx.donor.phone && <p className="text-xs text-muted-foreground">{tx.donor.phone}</p>}
                                    {tx.post.contactPhone && <p className="text-xs text-muted-foreground">Post Contact: {tx.post.contactPhone}</p>}
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Quantity:</span>
                                    <p className="font-medium">{tx.post.quantity}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Type:</span>
                                    <p className="font-medium">{tx.post.foodType}</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-2">
                            <div className="flex gap-2 w-full">
                                <Link href={`/dashboard/messages/${tx.chatRoomId}`} className="flex-1">
                                    <Button className="w-full" variant="default">💬 Chat with Donor</Button>
                                </Link>
                                {tx.status === 'IN_PROGRESS' && (
                                    <Button
                                        variant="secondary"
                                        className="flex-1"
                                        onClick={() => handleComplete(tx.id)}
                                    >
                                        ✓ Mark as Received
                                    </Button>
                                )}
                                {tx.status === 'WAITING_APPROVAL' && (
                                    <Button variant="outline" disabled className="flex-1 text-yellow-600 border-yellow-200 bg-yellow-50">
                                        ⏳ Waiting Approval
                                    </Button>
                                )}
                            </div>
                        </CardFooter>
                    </Card>

                    {/* Embedded Map */}
                    <LocationMap
                        lat={tx.post.pickupLat}
                        lng={tx.post.pickupLng}
                        address={tx.post.pickupAddress}
                        title={tx.post.title}
                    />
                </div>
            ))}
        </div>
    );
}
