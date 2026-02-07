import CircleLoader from '@/components/ui/circle-loader';

export default function Loading() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <CircleLoader />
        </div>
    );
}
