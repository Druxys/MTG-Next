// Types for Magic card data from localhost API
export interface Card {
    _id: string;
    name: string;
    manaCost?: string;
    type: string;
    text?: string;
    power?: string;
    toughness?: string;
    colors: string[];
    rarity: string;
    imagePath?: string;
    scryfallId?: string;
    convertedManaCost?: number;
    createdAt: string;
    updatedAt: string;
}

export interface CardSearchResponse {
    cards: Card[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalCards: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}