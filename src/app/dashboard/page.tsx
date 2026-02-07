import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { Badge } from '@/components/ui/badge';

export default async function DashboardPage() {
    const user = await currentUser();
    if (!user) return <div>Unauthorized</div>;

    // Get user stats
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });

    let myPosts = 0;
    let pendingRequests = 0;
    let myRequests = 0;
    let activePickups = 0;

    try {
        [myPosts, pendingRequests, myRequests, activePickups] = await Promise.all([
            prisma.foodPost.count({ where: { donorId: user.id, status: 'ACTIVE' } }),
            prisma.request.count({
                where: {
                    post: { donorId: user.id },
                    status: 'PENDING'
                }
            }),
            prisma.request.count({
                where: {
                    receiverId: user.id,
                    status: 'PENDING'
                }
            }),
            prisma.transaction.count({
                where: {
                    receiverId: user.id,
                    status: 'IN_PROGRESS'
                }
            })
        ]);
    } catch (error) {
        console.error('Dashboard stats fetch failed:', error);
        // Continue rendering with 0s
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, {user.firstName || user.emailAddresses[0].emailAddress}!</p>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Posts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{myPosts}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingRequests}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">My Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{myRequests}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Pickups</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activePickups}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Action Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Link href="/dashboard/donor/create">
                    <Card className="hover:bg-orange-50 transition cursor-pointer h-full border-orange-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span>➕</span> Donate Food
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>Got surplus food? Share it now.</CardDescription>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/dashboard/donor/my-posts">
                    <Card className="hover:bg-blue-50 transition cursor-pointer h-full border-blue-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span>📋</span> My Posts
                                {myPosts > 0 && <Badge variant="secondary">{myPosts}</Badge>}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>Manage your food donations.</CardDescription>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/dashboard/donor/requests">
                    <Card className="hover:bg-purple-50 transition cursor-pointer h-full border-purple-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span>📨</span> Incoming Requests
                                {pendingRequests > 0 && <Badge variant="destructive">{pendingRequests}</Badge>}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>Review and accept requests.</CardDescription>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/dashboard/receiver/feed">
                    <Card className="hover:bg-green-50 transition cursor-pointer h-full border-green-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span>🔍</span> Find Food
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>Browse available food near you.</CardDescription>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/dashboard/receiver/my-requests">
                    <Card className="hover:bg-yellow-50 transition cursor-pointer h-full border-yellow-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span>📤</span> My Requests
                                {myRequests > 0 && <Badge variant="secondary">{myRequests}</Badge>}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>Track your food requests.</CardDescription>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/dashboard/receiver/pickups">
                    <Card className="hover:bg-teal-50 transition cursor-pointer h-full border-teal-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span>📦</span> My Pickups
                                {activePickups > 0 && <Badge variant="destructive">{activePickups}</Badge>}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>Active pickup coordination.</CardDescription>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/dashboard/messages">
                    <Card className="hover:bg-indigo-50 transition cursor-pointer h-full border-indigo-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span>💬</span> Messages
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>Chat with donors/receivers.</CardDescription>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/dashboard/history">
                    <Card className="hover:bg-gray-50 transition cursor-pointer h-full border-gray-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span>📊</span> History
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>View completed transactions.</CardDescription>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
