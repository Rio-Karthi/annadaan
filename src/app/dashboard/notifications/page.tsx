import { getNotifications, markAsRead } from '@/app/actions/notifications';
import NotificationsList from '@/components/notifications/notifications-list';

export default async function NotificationsPage() {
    const notifications = await getNotifications();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Notifications</h1>
            <NotificationsList notifications={notifications} />
        </div>
    );
}
