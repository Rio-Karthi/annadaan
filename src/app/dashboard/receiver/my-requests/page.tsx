import { getMyRequests } from '@/app/actions/manage-requests';
import MyRequestsList from '@/components/receiver/my-requests-list';

export default async function MyRequestsPage() {
    const requests = await getMyRequests();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">My Requests</h1>
                <p className="text-muted-foreground mt-1">Track all your food requests</p>
            </div>
            <MyRequestsList requests={requests} />
        </div>
    );
}
