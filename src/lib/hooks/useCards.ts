import { useState, useEffect } from 'react';
import { Card, CardSearchResponse } from '@/models/card';

export function useCards() {
    const [cards, setCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch all cards from all pages
    const fetchAllCards = async () => {
        try {
            setLoading(true);
            setError(null);
            setCards([]);

            let currentPage = 1;
            let allCards: Card[] = [];
            let hasMorePages = true;

            while (hasMorePages) {
                const params = new URLSearchParams();
                params.append('page', currentPage.toString());

                const response = await fetch(`http://localhost:4000/api/cards?${params}`);

                const data: CardSearchResponse = await response.json();
                allCards = [...allCards, ...data.cards];
                
                // Update cards state incrementally for better UX
                setCards([...allCards]);

                hasMorePages = data.pagination.hasNext;
                currentPage++;
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
            setCards([]);
        } finally {
            setLoading(false);
        }
    };

    // Initial load - fetch all cards
    useEffect(() => {
        fetchAllCards();
    }, []);

    return {
        cards,
        loading,
        error,
        refetch: fetchAllCards
    };
}