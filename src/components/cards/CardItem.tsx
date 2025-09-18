import { Card } from '@/models/card';

interface CardItemProps {
    card: Card;
    onClick: (card: Card) => void;
}

export function CardItem({ card, onClick }: CardItemProps) {
    return (
        <div
            onClick={() => onClick(card)}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
        >
            {card.imagePath ? (
                <img
                    src={`http://localhost:4000/api/cards/${card._id}/image`}
                    alt={card.name}
                    className="w-full h-48 object-cover"
                />
            ) : (
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
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
    );
}