'use server';

import prisma from '@/lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createPost(prevState: any, formData: FormData) {
    const user = await currentUser();
    const { userId } = await auth();

    if (!userId || !user) {
        return { message: 'Unauthorized', success: false };
    }

    const showExactLocation = formData.get('showExactLocation') === 'on';
    const imagesJson = formData.get('images') as string;

    console.log('Images JSON Received:', imagesJson);

    let images: string[] = [];
    try {
        images = imagesJson ? JSON.parse(imagesJson) : [];
    } catch {
        console.error('Failed to parse images JSON');
        images = [];
    }

    // Default image only if truly no images uploaded
    if (images.length === 0) {
        images = ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c'];
    }

    const quantityValue = formData.get('quantityValue');
    const quantityUnit = formData.get('quantityUnit');
    const quantity = quantityValue && quantityUnit ? `${quantityValue} ${quantityUnit}` : (formData.get('quantity') as string);

    const rawData = {
        title: formData.get('title'),
        description: formData.get('description'),
        foodType: formData.get('foodType'),
        quantity: quantity,
        expiryTime: formData.get('expiryTime'),
        pickupAddress: formData.get('address'),
        pickupLat: parseFloat(formData.get('lat') as string),
        pickupLng: parseFloat(formData.get('lng') as string),
        showExactLocation,
        contactPhone: formData.get('contactPhone'),
        images,
    };

    console.log('Create Post Raw Data:', rawData);

    const missingFields: string[] = [];
    if (!rawData.title) missingFields.push('Title');
    if (!rawData.description) missingFields.push('Description');
    if (!rawData.foodType) missingFields.push('Food Type');
    if (!rawData.quantity) missingFields.push('Quantity');
    if (!rawData.expiryTime) missingFields.push('Expiry Time');
    if (!rawData.pickupAddress) missingFields.push('Pickup Address');
    if (!rawData.contactPhone) missingFields.push('Contact Phone');

    if (missingFields.length > 0) {
        console.error('Missing fields:', missingFields);
        return { message: `Missing required fields: ${missingFields.join(', ')}`, success: false };
    }

    if (isNaN(rawData.pickupLat) || isNaN(rawData.pickupLng)) {
        return { message: 'Invalid coordinates', success: false };
    }

    const expiryDate = new Date(rawData.expiryTime as string);
    if (isNaN(expiryDate.getTime())) {
        return { message: 'Invalid expiry time format', success: false };
    }

    try {
        // Get or create user in database using Clerk ID
        let dbUser = await prisma.user.findUnique({ where: { id: userId } });

        if (!dbUser) {
            // Create user if doesn't exist
            dbUser = await prisma.user.create({
                data: {
                    id: userId,
                    email: user.emailAddresses[0].emailAddress,
                    name: `${user.firstName} ${user.lastName}`.trim(),
                    phone: user.phoneNumbers[0]?.phoneNumber || null,
                    image: user.imageUrl,
                    role: 'DONOR',
                }
            });
        } else {
            // Update existing user info if missing
            if (!dbUser.name || !dbUser.image) {
                dbUser = await prisma.user.update({
                    where: { id: userId },
                    data: {
                        name: `${user.firstName} ${user.lastName}`.trim(),
                        image: user.imageUrl,
                    }
                });
            }
        }

        await prisma.foodPost.create({
            data: {
                title: rawData.title as string,
                description: rawData.description as string,
                foodType: rawData.foodType as 'VEG' | 'NON_VEG' | 'BOTH',
                quantity: rawData.quantity as string,
                expiryTime: expiryDate,
                pickupAddress: rawData.pickupAddress as string,
                pickupLat: rawData.pickupLat,
                pickupLng: rawData.pickupLng,
                showExactMap: showExactLocation,
                contactPhone: rawData.contactPhone as string,
                donorId: dbUser.id,
                status: 'ACTIVE',
                images: rawData.images,
            }
        });

        revalidatePath('/dashboard');
        revalidatePath('/dashboard/receiver/feed');
        revalidatePath('/dashboard/donor/my-posts');
        return { message: 'Post created successfully!', success: true };

    } catch (e: any) {
        console.error('Post creation detailed error:', e);
        return { message: `Failed to create post: ${e.message}`, success: false };
    }
}
