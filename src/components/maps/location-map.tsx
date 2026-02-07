'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface LocationMapProps {
    lat: number;
    lng: number;
    address: string;
    title: string;
}

export default function LocationMap({ lat, lng, address, title }: LocationMapProps) {
    const [Map, setMap] = useState<any>(null);

    useEffect(() => {
        // Dynamically import map components
        import('@/components/maps/map-client').then((mod) => {
            setMap(() => mod.default);
        });
    }, []);

    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">📍 Pickup Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Map View */}
                {Map && (
                    <div className="relative h-64 rounded-lg overflow-hidden border">
                        <Map lat={lat} lng={lng} title={title} address={address} />
                    </div>
                )}

                {/* Address */}
                <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-semibold text-gray-500">Address</p>
                    <p className="text-base font-medium">{address}</p>
                    <p className="text-xs text-gray-500 mt-1">
                        Coordinates: {lat.toFixed(4)}, {lng.toFixed(4)}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                    <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="w-full">
                            🗺️ View in Google Maps
                        </Button>
                    </a>
                    <a href={googleMapsDirectionsUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="default" className="w-full">
                            🧭 Get Directions
                        </Button>
                    </a>
                </div>
            </CardContent>
        </Card>
    );
}
