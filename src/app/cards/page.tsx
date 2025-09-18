'use client';

import {useState} from 'react';
import {Card} from '@/models/card';
import {useCards} from '@/lib/hooks/useCards';
import {CardModal} from '@/components/cards/CardModal';
import {CardItem} from '@/components/cards/CardItem';
import {LoadingSpinner} from '@/components/ui/LoadingSpinner';
import {ErrorMessage} from '@/components/ui/ErrorMessage';
import {Pagination} from '@/components/ui/Pagination';
import {CardFilters, CardFilters as CardFiltersType} from '@/components/ui/CardFilters';


// Main Cards Page Component
export default function CardsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<CardFiltersType>({});
    const {cards, loading, error, pagination, fetchPage} = useCards({
        page: currentPage, 
        limit: 20, 
        filters
    });
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

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchPage(page);
    };

    // Handle filter changes
    const handleFiltersChange = (newFilters: CardFiltersType) => {
        setFilters(newFilters);
        setCurrentPage(1); // Reset to first page when filters change
    };

    // Handle clear filters
    const handleClearFilters = () => {
        setFilters({});
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    Magic: The Gathering Cards
                </h1>

                {/* Filters */}
                <CardFilters
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    onClearFilters={handleClearFilters}
                />

                {/* Error State */}
                {error && <ErrorMessage message={error}/>}

                {/* Loading State */}
                {loading && cards.length === 0 && <LoadingSpinner/>}

                {/* Cards Grid */}
                {cards.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {cards.map((card) => (
                                <CardItem
                                    key={card._id}
                                    card={card}
                                    onClick={handleCardClick}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <Pagination
                                currentPage={pagination.currentPage}
                                totalPages={pagination.totalPages}
                                onPageChange={handlePageChange}
                                hasNext={pagination.hasNext}
                                hasPrev={pagination.hasPrev}
                            />
                        )}
                    </>
                )}
            </div>

            {/* Modal */}
            <CardModal card={selectedCard} isOpen={isModalOpen} onClose={closeModal}/>
        </div>
    );
}