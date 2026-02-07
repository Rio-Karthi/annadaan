const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    console.log('Starting COMPLETE cleanup (DB + Clerk)...');

    try {
        // 1. Clean Database
        console.log('Cleaning Database...');
        await prisma.notification.deleteMany({});
        await prisma.chatMessage.deleteMany({});
        await prisma.transaction.deleteMany({});
        await prisma.request.deleteMany({});
        await prisma.foodPost.deleteMany({});
        await prisma.user.deleteMany({}); // Delete users from DB
        console.log('Database cleared.');

        // 2. Clean Clerk Users
        if (process.env.CLERK_SECRET_KEY) {
            console.log('Fetching Clerk users...');
            const response = await fetch('https://api.clerk.com/v1/users?limit=100', {
                headers: {
                    'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch Clerk users: ${response.statusText}`);
            }

            const users = await response.json();
            console.log(`Found ${users.length} users in Clerk. Deleting...`);

            for (const user of users) {
                const deleteRes = await fetch(`https://api.clerk.com/v1/users/${user.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (deleteRes.ok) {
                    console.log(`Deleted Clerk user: ${user.id}`);
                } else {
                    console.error(`Failed to delete Clerk user ${user.id}: ${deleteRes.statusText}`);
                }
            }
        } else {
            console.warn('CLERK_SECRET_KEY not found. Skipping Clerk user deletion.');
        }

        console.log('Cleanup complete!');
    } catch (error) {
        console.error('Error cleaning up:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
