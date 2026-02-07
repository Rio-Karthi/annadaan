'use client';

import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { createRequest } from '@/app/actions/request';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

function SubmitButton() {
    const { pending } = useFormStatus();
    return <Button type="submit" disabled={pending}>{pending ? 'Sending...' : 'Send Request'}</Button>;
}

export default function RequestModal({ postId }: { postId: string }) {
    const [open, setOpen] = useState(false);
    const [state, dispatch] = useFormState(createRequest, { message: '', success: false });

    useEffect(() => {
        if (state?.success) {
            toast.success('Request sent successfully!');
            setOpen(false);
        } else if (state?.message && !state?.success) {
            toast.error(state.message);
        }
    }, [state]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full">Request This Food</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Request Food</DialogTitle>
                    <DialogDescription>
                        Send a message to the donor with your pickup details
                    </DialogDescription>
                </DialogHeader>
                <form action={dispatch} className="space-y-4">
                    <input type="hidden" name="postId" value={postId} />
                    <div className="space-y-2">
                        <Label htmlFor="message">Your Message</Label>
                        <Textarea
                            id="message"
                            name="message"
                            placeholder="E.g., I can pick up in 30 minutes. I represent XYZ Foundation..."
                            rows={4}
                            required
                        />
                    </div>
                    <DialogFooter>
                        <SubmitButton />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
