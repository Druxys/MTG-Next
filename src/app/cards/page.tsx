'use client';

import {useState} from 'react';
import {Card} from '@/models/card';
import {useCards} from '@/lib/hooks/useCards';
import {CardModal} from '@/components/cards/CardModal';
import {CardItem} from '@/components/cards/CardItem';
import {LoadingSpinner} from '@/components/ui/LoadingSpinner';
import {ErrorMessage} from '@/components/ui/ErrorMessage';


// Main Cards Page Component
export default function CardsPage() {
    const {cards, loading, error} = useCards();
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
                {error && <ErrorMessage message={error}/>}

                {/* Loading State */}
                {loading && cards.length === 0 && <LoadingSpinner/>}

                {/* Cards Grid */}
                {cards.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {cards.map((card) => (
                            <CardItem
                                key={card._id}
                                card={card}
                                onClick={handleCardClick}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            <CardModal card={selectedCard} isOpen={isModalOpen} onClose={closeModal}/>
        </div>
    );
}