import { Card } from '@/models/card';

interface CardModalProps {
    card: Card | null;
    isOpen: boolean;
    onClose: () => void;
}

export function CardModal({ card, isOpen, onClose }: CardModalProps) {
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
                            aria-label="Close"
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
                                <h3 className="font-semibold text-gray-900 dark:text-white">Type</h3>
                                <p className="text-gray-700 dark:text-gray-300">{card.type}</p>
                            </div>

                            {card.text && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Text</h3>
                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{card.text}</p>
                                </div>
                            )}

                            {card.power && card.toughness && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Power/Toughness</h3>
                                    <p className="text-gray-700 dark:text-gray-300">{card.power}/{card.toughness}</p>
                                </div>
                            )}

                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">Rarity</h3>
                                <p className="text-gray-700 dark:text-gray-300 capitalize">{card.rarity}</p>
                            </div>

                            {card.convertedManaCost !== undefined && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Converted Cost</h3>
                                    <p className="text-gray-700 dark:text-gray-300">{card.convertedManaCost}</p>
                                </div>
                            )}

                            {card.colors && card.colors.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Colors</h3>
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