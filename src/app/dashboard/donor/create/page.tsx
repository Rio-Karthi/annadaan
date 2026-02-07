'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createPost } from '@/app/actions/post';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { LocationSearch } from '@/components/ui/location-search';
import { Loader2, MapPin } from 'lucide-react';
import { useUploadThing } from '@/lib/uploadthing';



export default function CreatePostPage() {
    const [state, dispatch] = useFormState(createPost, { message: '', success: false });
    const [location, setLocation] = useState({ lat: 13.0827, lng: 80.2707 });
    const [gettingLocation, setGettingLocation] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);

    const { startUpload } = useUploadThing('foodImageUploader');

    const [address, setAddress] = useState('');
    const [useManualInput, setUseManualInput] = useState(false);

    useEffect(() => {
        if (state?.success) {
            toast.success('Food posted successfully!');
        } else if (state?.message && !state?.success) {
            toast.error(state.message);
        }
    }, [state]);

    const getLiveLocation = () => {
        setGettingLocation(true);
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({
                        lat: latitude,
                        lng: longitude
                    });

                    try {
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                        const data = await response.json();
                        if (data.display_name) {
                            setAddress(data.display_name);
                            toast.success('Location detected from GPS!');
                        } else {
                            setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
                            toast.success('Location detected!');
                        }
                    } catch (error) {
                        console.error('Reverse geocoding failed:', error);
                        setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
                    }
                    setGettingLocation(false);
                },
                (error) => {
                    toast.error('Failed to get location. Please allow permissions.');
                    setGettingLocation(false);
                }
            );
        } else {
            toast.error('Geolocation not supported');
            setGettingLocation(false);
        }
    };

    const handleLocationSelect = (loc: { lat: number; lng: number; displayName: string }) => {
        setLocation({ lat: loc.lat, lng: loc.lng });
        setAddress(loc.displayName);
        toast.success('Location updated!');
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        try {
            const uploaded = await startUpload(Array.from(files));
            if (uploaded) {
                const urls = uploaded.map(file => file.url);
                setUploadedImages(prev => [...prev, ...urls]);
                toast.success(`${uploaded.length} image(s) uploaded!`);
            }
        } catch (error) {
            toast.error('Upload failed');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Post Surplus Food</CardTitle>
                    <CardDescription>Share details about the food you want to donate.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={dispatch} className="space-y-6">
                        {/* ... Existing Fields ... */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Food Title</Label>
                            <Input id="title" name="title" placeholder="e.g., 20 Veg Meals from Wedding" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description (Ingredients, details)</Label>
                            <Textarea id="description" name="description" placeholder="Rice, Dal, Curd..." required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="foodType">Food Type</Label>
                                <select id="foodType" name="foodType" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                    <option value="VEG">Vegetarian</option>
                                    <option value="NON_VEG">Non-Vegetarian</option>
                                    <option value="BOTH">Both</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="quantity">Quantity</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="quantityValue"
                                        name="quantityValue"
                                        type="number"
                                        placeholder="50"
                                        required
                                        className="flex-1"
                                    />
                                    <select
                                        id="quantityUnit"
                                        name="quantityUnit"
                                        className="flex h-10 w-[110px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    >
                                        <option value="Servings">Servings</option>
                                        <option value="Kg">Kg</option>
                                        <option value="Liters">Liters</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="expiryTime">Best Before</Label>
                                <Input id="expiryTime" name="expiryTime" type="datetime-local" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contactPhone">Phone Number</Label>
                                <Input id="contactPhone" name="contactPhone" type="tel" placeholder="+91 98765 43210" required />
                            </div>
                        </div>

                        {/* Location Section */}
                        <div className="space-y-4 pt-2 border-t">
                            <Label className="text-base">Pickup Location</Label>

                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">Search Area / Address</Label>
                                    <LocationSearch onLocationSelect={handleLocationSelect} currentAddress={address} />
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-background px-2 text-muted-foreground">Or</span>
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={getLiveLocation}
                                    disabled={gettingLocation}
                                    className="w-full"
                                >
                                    {gettingLocation ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Detecting Location...
                                        </>
                                    ) : (
                                        <>
                                            <MapPin className="mr-2 h-4 w-4" />
                                            Use Current GPS Location
                                        </>
                                    )}
                                </Button>
                            </div>

                            <input type="hidden" name="address" value={address} />
                            <input type="hidden" name="lat" value={location.lat} />
                            <input type="hidden" name="lng" value={location.lng} />

                            {address && (
                                <p className="text-xs text-muted-foreground bg-secondary/20 p-2 rounded">
                                    Selected: {address} ({location.lat.toFixed(4)}, {location.lng.toFixed(4)})
                                </p>
                            )}
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-2 pt-2 border-t">
                            <Label htmlFor="images">Food Images (Max 5)</Label>
                            <Input
                                id="images"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                disabled={uploading || uploadedImages.length >= 5}
                            />
                            {uploading && <p className="text-sm text-blue-600 flex items-center"><Loader2 className="mr-2 h-3 w-3 animate-spin" /> Uploading...</p>}
                            {uploadedImages.length > 0 && (
                                <div className="grid grid-cols-5 gap-2 mt-2">
                                    {uploadedImages.map((url, i) => (
                                        <img key={i} src={url} alt={`Upload ${i + 1}`} className="w-full h-20 object-cover rounded border" />
                                    ))}
                                </div>
                            )}
                        </div>

                        <input type="hidden" name="images" value={JSON.stringify(uploadedImages)} />

                        <div className="flex items-center space-x-2">
                            <input type="checkbox" id="showExactLocation" name="showExactLocation" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                            <Label htmlFor="showExactLocation" className="text-sm font-normal">Show exact map location only after request is accepted</Label>
                        </div>

                        <SubmitButton />
                        {state?.message && !state?.success && <p className="text-red-500 text-sm mt-2">{state.message}</p>}
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button className="w-full h-11 text-base" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting Donation...
                </>
            ) : (
                'Post Donation'
            )}
        </Button>
    );
}
