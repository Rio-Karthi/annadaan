'use client';

import { useEffect, useRef } from 'react';

interface MapClientProps {
    lat: number;
    lng: number;
    title: string;
    address: string;
}

export default function MapClient({ lat, lng, title, address }: MapClientProps) {
    const mapRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const initMap = async () => {
            const L = await import('leaflet');
            await import('leaflet/dist/leaflet.css');

            // Fix default marker icon
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });

            // Clean up existing map instance
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }

            // Create new map
            if (containerRef.current) {
                mapRef.current = L.map(containerRef.current).setView([lat, lng], 15);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                }).addTo(mapRef.current);

                L.marker([lat, lng])
                    .addTo(mapRef.current)
                    .bindPopup(`<b>${title}</b><br>${address}`)
                    .openPopup();
            }
        };

        initMap();

        // Cleanup on unmount
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [lat, lng, title, address]);

    return <div ref={containerRef} className="w-full h-full" />;
}
