import { useState, useEffect } from 'react';
import { Card, CardSearchResponse } from '@/models/card';

interface UsePaginatedCardsOptions {
    page?: number;
    limit?: number;
}

export function useCards(options: UsePaginatedCardsOptions = {}) {
    const { page = 1, limit = 20 } = options;
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

            const response = await fetch(`http://localhost:4000/api/cards?${params}`);

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
    }, [page, limit]);

    return {
        cards,
        loading,
        error,
        pagination,
        refetch: () => fetchCards(page),
        fetchPage: fetchCards
    };
}