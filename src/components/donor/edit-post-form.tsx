'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { updatePost } from '@/app/actions/manage-posts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

function SubmitButton() {
    const { pending } = useFormStatus();
    return <Button className="w-full" disabled={pending}>{pending ? 'Updating...' : 'Update Post'}</Button>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function EditPostForm({ post }: { post: any }) {
    const router = useRouter();
    const [state, dispatch] = useFormState(updatePost.bind(null, post.id), { message: '', success: false });

    useEffect(() => {
        if (state?.success) {
            toast.success('Post updated successfully!');
            router.push('/dashboard/donor/my-posts');
        } else if (state?.message && !state?.success) {
            toast.error(state.message);
        }
    }, [state, router]);

    // Format datetime for input
    const formatDateTimeLocal = (date: Date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Post Details</CardTitle>
            </CardHeader>
            <CardContent>
                <form action={dispatch} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Food Title</Label>
                        <Input
                            id="title"
                            name="title"
                            defaultValue={post.title}
                            placeholder="e.g., 20 Veg Meals from Wedding"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            defaultValue={post.description}
                            placeholder="Rice, Dal, Curd..."
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="foodType">Food Type</Label>
                            <select
                                id="foodType"
                                name="foodType"
                                defaultValue={post.foodType}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            >
                                <option value="VEG">Vegetarian</option>
                                <option value="NON_VEG">Non-Vegetarian</option>
                                <option value="BOTH">Both</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input
                                id="quantity"
                                name="quantity"
                                defaultValue={post.quantity}
                                placeholder="e.g., 50 people"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="expiryTime">Best Before / Expiry</Label>
                        <Input
                            id="expiryTime"
                            name="expiryTime"
                            type="datetime-local"
                            defaultValue={formatDateTimeLocal(post.expiryTime)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Pickup Address</Label>
                        <Input
                            id="address"
                            name="address"
                            defaultValue={post.pickupAddress}
                            placeholder="Full address"
                            required
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="showExactLocation"
                            name="showExactLocation"
                            defaultChecked={post.showExactMap}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor="showExactLocation">Show exact map location only after acceptance?</Label>
                    </div>

                    <div className="flex gap-2">
                        <SubmitButton />
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
