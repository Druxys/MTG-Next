'use client';

import {useState} from 'react';
import {Card} from '@/models/card';
import {useCards} from '@/lib/hooks/useCards';
import {CardModal} from '@/components/cards/CardModal';
import {AddCardModal} from '@/components/cards/AddCardModal';
import {CardItem} from '@/components/cards/CardItem';
import {LoadingSpinner} from '@/components/ui/LoadingSpinner';
import {ErrorMessage} from '@/components/ui/ErrorMessage';
import {Pagination} from '@/components/ui/Pagination';
import {CardFilters, CardFilters as CardFiltersType} from '@/components/ui/CardFilters';
import {useAuth} from '@/contexts/AuthContext';
import {AuthModal} from '@/components/auth/AuthModal';


// Main Cards Page Component
export default function CardsPage() {
    const { isAuthenticated, user, logout } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<CardFiltersType>({});
    const {cards, loading, error, pagination, fetchPage} = useCards({
        page: currentPage, 
        limit: 20, 
        filters
    });
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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

    // Handle add card modal
    const handleOpenAddModal = () => {
        setIsAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
    };

    const handleCardAdded = () => {
        // Refresh the cards list by fetching the current page
        fetchPage(currentPage);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Magic: The Gathering Cards
                    </h1>
                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Welcome, <span className="font-medium">{user?.username}</span>
                                </div>
                                <button
                                    onClick={handleOpenAddModal}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                                    </svg>
                                    Add Card
                                </button>
                                <button
                                    onClick={logout}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Login to add cards
                                </div>
                                <button
                                    onClick={() => setShowAuthModal(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                                >
                                    Login
                                </button>
                            </>
                        )}
                    </div>
                </div>

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

            {/* Modals */}
            <CardModal card={selectedCard} isOpen={isModalOpen} onClose={closeModal}/>
            <AddCardModal
                isOpen={isAddModalOpen}
                onClose={handleCloseAddModal}
                onCardAdded={handleCardAdded}
            />
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onSuccess={() => setShowAuthModal(false)}
            />
        </div>
    );
}