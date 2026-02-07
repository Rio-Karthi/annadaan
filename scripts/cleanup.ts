
import 'dotenv/config';
import prisma from '../src/lib/prisma';

async function main() {
    console.log('Starting cleanup...');

    try {
        // Delete in order of dependency
        await prisma.chatMessage.deleteMany({});
        console.log('Deleted ChatMessages');

        await prisma.transaction.deleteMany({});
        console.log('Deleted Transactions');

        await prisma.request.deleteMany({});
        console.log('Deleted Requests');

        await prisma.foodPost.deleteMany({});
        console.log('Deleted FoodPosts');

        console.log('Cleanup complete! Users were preserved.');
    } catch (error) {
        console.error('Error cleaning up:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
