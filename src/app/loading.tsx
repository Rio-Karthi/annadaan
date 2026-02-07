export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-4">
                <h1 className="text-4xl font-bold tracking-widest text-green-600 animate-pulse">LOADING</h1>
            </div>
        </div>
    );
}
