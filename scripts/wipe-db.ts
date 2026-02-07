
import 'dotenv/config';
import prisma from '../src/lib/prisma';

async function main() {
    console.log('Starting DATABASE cleanup...');

    try {
        console.log('Deleting records...');
        // Delete in order of dependency
        await prisma.notification.deleteMany({});
        console.log('- Notifications cleared');

        await prisma.chatMessage.deleteMany({});
        console.log('- Chat Messages cleared');

        await prisma.transaction.deleteMany({});
        console.log('- Transactions cleared');

        await prisma.request.deleteMany({});
        console.log('- Requests cleared');

        await prisma.foodPost.deleteMany({});
        console.log('- Food Posts cleared');

        await prisma.user.deleteMany({});
        console.log('- Users cleared');

        console.log('✅ Database successfully wiped!');
    } catch (error) {
        console.error('❌ Error cleaning up database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
