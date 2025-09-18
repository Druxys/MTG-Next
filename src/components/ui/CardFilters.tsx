'use client';

import { useState, useEffect } from 'react';

export interface CardFilters {
    name?: string;
    colors?: string[];
    type?: string;
    rarity?: string;
    minCmc?: number;
    maxCmc?: number;
}

interface CardFiltersProps {
    filters: CardFilters;
    onFiltersChange: (filters: CardFilters) => void;
    onClearFilters: () => void;
}

const MTG_COLORS = [
    { value: 'W', label: 'White', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'U', label: 'Blue', color: 'bg-blue-100 text-blue-800' },
    { value: 'B', label: 'Black', color: 'bg-gray-100 text-gray-800' },
    { value: 'R', label: 'Red', color: 'bg-red-100 text-red-800' },
    { value: 'G', label: 'Green', color: 'bg-green-100 text-green-800' },
];

const CARD_TYPES = [
    { value: '', label: 'All Types' },
    { value: 'Artifact', label: 'Artifact' },
    { value: 'Creature', label: 'Creature' },
    { value: 'Enchantment', label: 'Enchantment' },
    { value: 'Instant', label: 'Instant' },
    { value: 'Land', label: 'Land' },
    { value: 'Planeswalker', label: 'Planeswalker' },
    { value: 'Sorcery', label: 'Sorcery' },
    { value: 'Emblem', label: 'Emblem' },
];

const RARITIES = [
    { value: '', label: 'All Rarities' },
    { value: 'common', label: 'Common' },
    { value: 'uncommon', label: 'Uncommon' },
    { value: 'rare', label: 'Rare' },
    { value: 'mythic', label: 'Mythic Rare' },
];

export function CardFilters({ filters, onFiltersChange, onClearFilters }: CardFiltersProps) {
    const [localFilters, setLocalFilters] = useState<CardFilters>(filters);

    // Sync localFilters when parent filters change (e.g., when cleared)
    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    // Debounced update for text inputs - only trigger if filters actually changed
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            // Compare current filters with new filters to avoid unnecessary updates
            const filtersChanged = JSON.stringify(filters) !== JSON.stringify(localFilters);
            if (filtersChanged) {
                onFiltersChange(localFilters);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [localFilters, onFiltersChange, filters]);

    const updateFilter = (key: keyof CardFilters, value: any) => {
        setLocalFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const toggleColor = (colorValue: string) => {
        const currentColors = localFilters.colors || [];
        const newColors = currentColors.includes(colorValue)
            ? currentColors.filter(c => c !== colorValue)
            : [...currentColors, colorValue];
        
        updateFilter('colors', newColors.length > 0 ? newColors : undefined);
    };

    const clearFilters = () => {
        setLocalFilters({});
        onClearFilters();
    };

    const hasActiveFilters = Object.keys(localFilters).some(key => {
        const value = localFilters[key as keyof CardFilters];
        return value !== undefined && value !== '' && (Array.isArray(value) ? value.length > 0 : true);
    });

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Filters
                </h2>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                        Clear All
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Name Search */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Card Name
                    </label>
                    <input
                        type="text"
                        value={localFilters.name || ''}
                        onChange={(e) => updateFilter('name', e.target.value || undefined)}
                        placeholder="Search by name..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                {/* Type Select */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Card Type
                    </label>
                    <select
                        value={localFilters.type || ''}
                        onChange={(e) => updateFilter('type', e.target.value || undefined)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        {CARD_TYPES.map(cardType => (
                            <option key={cardType.value} value={cardType.value}>
                                {cardType.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Rarity */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Rarity
                    </label>
                    <select
                        value={localFilters.rarity || ''}
                        onChange={(e) => updateFilter('rarity', e.target.value || undefined)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        {RARITIES.map(rarity => (
                            <option key={rarity.value} value={rarity.value}>
                                {rarity.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Colors */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Colors
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {MTG_COLORS.map(color => (
                            <button
                                key={color.value}
                                onClick={() => toggleColor(color.value)}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                    (localFilters.colors || []).includes(color.value)
                                        ? `${color.color} ring-2 ring-offset-2 ring-blue-500`
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                }`}
                            >
                                {color.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}