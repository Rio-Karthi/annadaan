import { UserButton, SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from './ui/button';

export default function Navbar() {
    return (
        <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold gradient-text">
                    Annadaan Connect
                </Link>

                <div className="flex items-center gap-6">
                    <SignedIn>
                        <Link href="/dashboard" className="text-sm font-medium hover:text-primary">
                            Dashboard
                        </Link>
                        <Link href="/dashboard/messages" className="text-sm font-medium hover:text-primary">
                            Messages
                        </Link>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>

                    <SignedOut>
                        <SignInButton mode="modal">
                            <Button>Sign In</Button>
                        </SignInButton>
                    </SignedOut>
                </div>
            </div>
        </nav>
    );
}
