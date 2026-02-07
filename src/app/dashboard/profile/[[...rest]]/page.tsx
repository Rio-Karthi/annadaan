import { UserProfile } from '@clerk/nextjs';

export default function ProfilePage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Profile</h1>
            <div className="flex justify-center">
                <UserProfile
                    appearance={{
                        elements: {
                            rootBox: "w-full",
                            card: "shadow-none"
                        }
                    }}
                />
            </div>
        </div>
    );
}
