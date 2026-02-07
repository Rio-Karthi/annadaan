import { getUnreadCount } from '@/app/actions/notifications';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/navbar';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import PageTransition from '@/components/ui/page-transition';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { userId } = await auth();
    if (!userId) {
        redirect('/');
    }

    const unreadCount = await getUnreadCount();

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-64 border-r bg-gray-50/40 hidden md:block">
                    <div className="p-4 space-y-4">
                        <h3 className="font-semibold px-2 mb-2 text-sm text-gray-500 uppercase tracking-wider">Menu</h3>
                        <nav className="flex flex-col space-y-1">
                            {/* ... existing links ... */}
                            <Link href="/dashboard" className="flex items-center gap-2 px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
                                <span className="text-xl">🏠</span> Dashboard
                            </Link>

                            <div className="pt-2 pb-1">
                                <p className="px-2 text-xs font-semibold text-gray-400 uppercase">Donor</p>
                            </div>
                            <Link href="/dashboard/donor/create" className="flex items-center gap-2 px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
                                <span className="text-xl">➕</span> Donate Food
                            </Link>
                            <Link href="/dashboard/donor/my-posts" className="flex items-center gap-2 px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
                                <span className="text-xl">📋</span> My Posts
                            </Link>
                            <Link href="/dashboard/donor/requests" className="flex items-center gap-2 px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
                                <span className="text-xl">📨</span> Incoming Requests
                            </Link>

                            <div className="pt-2 pb-1">
                                <p className="px-2 text-xs font-semibold text-gray-400 uppercase">Receiver</p>
                            </div>
                            <Link href="/dashboard/receiver/feed" className="flex items-center gap-2 px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
                                <span className="text-xl">🔍</span> Find Food
                            </Link>
                            <Link href="/dashboard/receiver/my-requests" className="flex items-center gap-2 px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
                                <span className="text-xl">📤</span> My Requests
                            </Link>
                            <Link href="/dashboard/receiver/pickups" className="flex items-center gap-2 px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
                                <span className="text-xl">📦</span> My Pickups
                            </Link>

                            <div className="pt-2 pb-1">
                                <p className="px-2 text-xs font-semibold text-gray-400 uppercase">Other</p>
                            </div>
                            <Link href="/dashboard/messages" className="flex items-center gap-2 px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
                                <span className="text-xl">💬</span> Messages
                            </Link>
                            <Link href="/dashboard/notifications" className="flex items-center gap-2 px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100 justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">🔔</span> Notifications
                                </div>
                                {unreadCount > 0 && (
                                    <Badge variant="destructive" className="ml-auto w-6 h-6 flex items-center justify-center rounded-full p-0 text-xs">
                                        {unreadCount}
                                    </Badge>
                                )}
                            </Link>
                            <Link href="/dashboard/history" className="flex items-center gap-2 px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
                                <span className="text-xl">📊</span> History
                            </Link>
                            <Link href="/dashboard/profile" className="flex items-center gap-2 px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
                                <span className="text-xl">👤</span> Profile
                            </Link>
                        </nav>
                    </div>
                </aside>

                <main className="flex-1 p-6 md:p-8">
                    <PageTransition>
                        {children}
                    </PageTransition>
                </main>
            </div>
        </div>
    );
}
