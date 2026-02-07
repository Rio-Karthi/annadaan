'use client';

import * as React from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LocationSearchProps {
    onLocationSelect: (location: { lat: number; lng: number; displayName: string }) => void;
    currentAddress?: string;
}

export function LocationSearch({ onLocationSelect, currentAddress }: LocationSearchProps) {
    const [query, setQuery] = React.useState('');
    const [results, setResults] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Initial value
    React.useEffect(() => {
        if (currentAddress) {
            setQuery(currentAddress);
        }
    }, [currentAddress]);

    // Close on click outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounced search
    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (query.trim().length > 2 && isOpen) {
                handleSearch(query);
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [query, isOpen]);

    const handleSearch = async (q: string) => {
        setLoading(true);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5`);
            const data = await res.json();
            setResults(data);
        } catch (error) {
            console.error('Search failed:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setIsOpen(true);
    };

    const handleSelect = (result: any) => {
        onLocationSelect({
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon),
            displayName: result.display_name
        });
        setQuery(result.display_name);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={containerRef}>
            <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search for an area or address..."
                    value={query}
                    onChange={handleInputChange}
                    className="pl-8 pr-8"
                    onFocus={() => {
                        if (query.length > 2) setIsOpen(true);
                    }}
                />
                {query && (
                    <button
                        type="button"
                        onClick={() => {
                            setQuery('');
                            setResults([]);
                            setIsOpen(false);
                        }}
                        className="absolute right-2 top-2.5 hover:bg-gray-100 rounded-full p-0.5"
                    >
                        <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                )}
            </div>

            {isOpen && (results.length > 0 || loading) && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-950 border rounded-md shadow-lg max-h-60 overflow-auto">
                    {loading ? (
                        <div className="flex items-center justify-center p-4 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Searching...
                        </div>
                    ) : (
                        <ul className="py-1">
                            {results.map((result, index) => (
                                <li
                                    key={index}
                                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex items-start gap-2 text-sm"
                                    onClick={() => handleSelect(result)}
                                >
                                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                                    <span>{result.display_name}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
