'use client';

import {useEffect, useState} from 'react';

// Types for Magic card data from localhost API
interface Card {
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

interface CardSearchResponse {
    cards: Card[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalCards: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

// Modal component for card details
function CardModal({card, isOpen, onClose}: { card: Card | null; isOpen: boolean; onClose: () => void }) {
    if (!isOpen || !card) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{card.name}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            aria-label="Fermer"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            {card.imagePath && (
                                <img
                                    src={`http://localhost:4000/api/cards/${card._id}/image`}
                                    alt={card.name}
                                    className="w-full rounded-lg shadow-lg"
                                />
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">Coût de mana</h3>
                                <p className="text-gray-700 dark:text-gray-300">{card.manaCost || 'N/A'}</p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">Type</h3>
                                <p className="text-gray-700 dark:text-gray-300">{card.type}</p>
                            </div>

                            {card.text && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Texte</h3>
                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{card.text}</p>
                                </div>
                            )}

                            {card.power && card.toughness && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Force/Endurance</h3>
                                    <p className="text-gray-700 dark:text-gray-300">{card.power}/{card.toughness}</p>
                                </div>
                            )}

                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">Rareté</h3>
                                <p className="text-gray-700 dark:text-gray-300 capitalize">{card.rarity}</p>
                            </div>

                            {card.convertedManaCost !== undefined && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Coût converti</h3>
                                    <p className="text-gray-700 dark:text-gray-300">{card.convertedManaCost}</p>
                                </div>
                            )}

                            {card.colors && card.colors.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Couleurs</h3>
                                    <div className="flex gap-2">
                                        {card.colors.map((color) => (
                                            <span
                                                key={color}
                                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                                    color === 'W' ? 'bg-yellow-100 text-yellow-800' :
                                                        color === 'U' ? 'bg-blue-100 text-blue-800' :
                                                            color === 'B' ? 'bg-gray-100 text-gray-800' :
                                                                color === 'R' ? 'bg-red-100 text-red-800' :
                                                                    color === 'G' ? 'bg-green-100 text-green-800' :
                                                                        'bg-gray-100 text-gray-800'
                                                }`}
                                            >
                        {color}
                      </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}



// Main Cards Page Component
export default function CardsPage() {
    const [cards, setCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);



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

    // Handle card click
    const handleCardClick = (card: Card) => {
        setSelectedCard(card);
        setIsModalOpen(true);
    };

    // Handle modal close
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCard(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    Cartes Magic: The Gathering
                </h1>


                {/* Error State */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {loading && cards.length === 0 && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                )}

                {/* Cards Grid */}
                {cards.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {cards.map((card) => (
                            <div
                                key={card._id}
                                onClick={() => handleCardClick(card)}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                            >
                                {card.imagePath ? (
                                    <img
                                        src={`http://localhost:4000/api/cards/${card._id}/image`}
                                        alt={card.name}
                                        className="w-full h-48 object-cover"
                                    />
                                ) : (
                                    <div
                                        className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                        <span className="text-gray-500 dark:text-gray-400">Pas d&apos;image</span>
                                    </div>
                                )}

                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 truncate">
                                        {card.name}
                                    </h3>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{card.type}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 capitalize">{card.rarity}</p>
                                    {card.manaCost && (
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{card.manaCost}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* No Results */}
                {!loading && cards.length === 0 && !error && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">Aucune carte trouvée avec ces filtres.</p>
                    </div>
                )}

            </div>

            {/* Modal */}
            <CardModal card={selectedCard} isOpen={isModalOpen} onClose={closeModal}/>
        </div>
    );
}