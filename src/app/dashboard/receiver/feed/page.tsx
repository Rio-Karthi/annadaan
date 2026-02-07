import { getFeedPosts } from '@/app/actions/feed';
import { FoodCard } from '@/components/receiver/food-card';

export default async function FeedPage() {
    const posts = await getFeedPosts();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Available Food</h1>
                {/* Filters could go here */}
            </div>

            {posts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-dashed">
                    <h3 className="text-lg font-medium text-gray-900">No food available right now</h3>
                    <p className="mt-1 text-sm text-gray-500">Check back later or try changing your filters.</p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {posts.map((post: any) => (
                        <FoodCard key={post.id} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
}
