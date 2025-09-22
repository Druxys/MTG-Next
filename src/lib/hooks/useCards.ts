import { useState, useEffect } from 'react';
import { Card, CardSearchResponse } from '@/models/card';
import { CardFilters } from '@/components/ui/CardFilters';
import { API_CONFIG } from '@/lib/config/api';

interface UsePaginatedCardsOptions {
    page?: number;
    limit?: number;
    filters?: CardFilters;
}

export function useCards(options: UsePaginatedCardsOptions = {}) {
    const { page = 1, limit = 20, filters } = options;
    const [cards, setCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
        totalCards: 0,
        hasNext: false,
        hasPrev: false,
    });

    // Fetch cards for a specific page
    const fetchCards = async (pageNum: number = page) => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams();
            params.append('page', pageNum.toString());
            if (limit) {
                params.append('limit', limit.toString());
            }

            // Add filter parameters if they exist
            if (filters) {
                if (filters.name) {
                    params.append('name', filters.name);
                }
                if (filters.type) {
                    params.append('type', filters.type);
                }
                if (filters.rarity) {
                    params.append('rarity', filters.rarity);
                }
                if (filters.colors && filters.colors.length > 0) {
                    params.append('colors', filters.colors.join(','));
                }
                if (filters.minCmc !== undefined) {
                    params.append('minCmc', filters.minCmc.toString());
                }
                if (filters.maxCmc !== undefined) {
                    params.append('maxCmc', filters.maxCmc.toString());
                }
            }

            const response = await fetch(`${API_CONFIG.ENDPOINTS.CARDS}?${params}`);

            if (!response.ok) {
                throw new Error('Error loading cards');
            }

            const data: CardSearchResponse = await response.json();
            setCards(data.cards);
            setPagination(data.pagination);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setCards([]);
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchCards(page);
    }, [page, limit, filters]);

    return {
        cards,
        loading,
        error,
        pagination,
        refetch: () => fetchCards(page),
        fetchPage: fetchCards
    };
}