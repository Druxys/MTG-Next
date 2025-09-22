'use client';

import { useState } from 'react';
import { Card } from '@/models/card';

interface AddCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCardAdded: () => void;
}

interface CardFormData {
    name: string;
    manaCost: string;
    type: string;
    text: string;
    colors: string[];
    rarity: string;
    convertedManaCost: number;
    image: File | null;
}

const MTG_COLORS = [
    { value: 'W', label: 'White' },
    { value: 'U', label: 'Blue' },
    { value: 'B', label: 'Black' },
    { value: 'R', label: 'Red' },
    { value: 'G', label: 'Green' },
];

const RARITIES = [
    { value: 'common', label: 'Common' },
    { value: 'uncommon', label: 'Uncommon' },
    { value: 'rare', label: 'Rare' },
    { value: 'mythic', label: 'Mythic Rare' },
];

export function AddCardModal({ isOpen, onClose, onCardAdded }: AddCardModalProps) {
    const [formData, setFormData] = useState<CardFormData>({
        name: '',
        manaCost: '',
        type: '',
        text: '',
        colors: [],
        rarity: 'common',
        convertedManaCost: 0,
        image: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const updateField = (field: keyof CardFormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const toggleColor = (colorValue: string) => {
        const currentColors = formData.colors;
        const newColors = currentColors.includes(colorValue)
            ? currentColors.filter(c => c !== colorValue)
            : [...currentColors, colorValue];
        
        updateField('colors', newColors);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Basic validation
        if (!formData.name.trim()) {
            setError('Card name is required');
            setLoading(false);
            return;
        }

        if (!formData.type.trim()) {
            setError('Card type is required');
            setLoading(false);
            return;
        }

        try {
            const submitData = new FormData();
            submitData.append('name', formData.name.trim());
            if (formData.manaCost.trim()) submitData.append('manaCost', formData.manaCost.trim());
            submitData.append('type', formData.type.trim());
            if (formData.text.trim()) submitData.append('text', formData.text.trim());
            submitData.append('colors', JSON.stringify(formData.colors));
            submitData.append('rarity', formData.rarity);
            if (formData.convertedManaCost) submitData.append('convertedManaCost', formData.convertedManaCost.toString());
            if (formData.image) submitData.append('image', formData.image);
            console.log(submitData);
            const response = await fetch('http://localhost:4000/api/cards', {
                method: 'POST',
                body: submitData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Error adding the card' }));
                throw new Error(errorData.message || 'Error adding the card');
            }

            // Reset form and close modal
            setFormData({
                name: '',
                manaCost: '',
                type: '',
                text: '',
                colors: [],
                rarity: 'common',
                convertedManaCost: 0,
                image: null
            });
            onClose();
            onCardAdded();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            onClose();
            setError(null);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Card</h2>
                        <button
                            onClick={handleClose}
                            disabled={loading}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
                            aria-label="Close"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Card Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => updateField('name', e.target.value)}
                                    placeholder="Enter card name"
                                    disabled={loading}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                                    required
                                />
                            </div>

                            {/* Mana Cost */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Mana Cost
                                </label>
                                <input
                                    type="text"
                                    value={formData.manaCost}
                                    onChange={(e) => updateField('manaCost', e.target.value)}
                                    placeholder="ex: {3}{R}{R}"
                                    disabled={loading}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                                />
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Type *
                                </label>
                                <input
                                    type="text"
                                    value={formData.type}
                                    onChange={(e) => updateField('type', e.target.value)}
                                    placeholder="ex: Creature — Human Wizard"
                                    disabled={loading}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                                    required
                                />
                            </div>

                            {/* Rarity */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Rarity
                                </label>
                                <select
                                    value={formData.rarity}
                                    onChange={(e) => updateField('rarity', e.target.value)}
                                    disabled={loading}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                                >
                                    {RARITIES.map(rarity => (
                                        <option key={rarity.value} value={rarity.value}>
                                            {rarity.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Converted Mana Cost */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Converted Mana Cost
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.convertedManaCost}
                                onChange={(e) => updateField('convertedManaCost', parseInt(e.target.value) || 0)}
                                disabled={loading}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                            />
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
                                        type="button"
                                        onClick={() => toggleColor(color.value)}
                                        disabled={loading}
                                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors disabled:opacity-50 ${
                                            formData.colors.includes(color.value)
                                                ? 'bg-blue-500 text-white ring-2 ring-offset-2 ring-blue-500'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        {color.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Text */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Card Text
                            </label>
                            <textarea
                                value={formData.text}
                                onChange={(e) => updateField('text', e.target.value)}
                                placeholder="Enter card text..."
                                rows={4}
                                disabled={loading}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Card Image
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => updateField('image', e.target.files?.[0] || null)}
                                disabled={loading}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                            />
                            {formData.image && (
                                <div className="mt-2">
                                    <img
                                        src={URL.createObjectURL(formData.image)}
                                        alt="Card preview"
                                        className="max-w-xs max-h-48 object-contain rounded-md border border-gray-300"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Submit buttons */}
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={loading}
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Adding...' : 'Add Card'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}