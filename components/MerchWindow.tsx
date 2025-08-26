'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';

interface MerchItem {
    id: string;
    name: string;
    price: string;
    image: string;
    description: string;
    category: string;
}

interface MerchWindowProps {
    onClose: () => void;
    onFocus?: () => void;
}

// Sample merchandise data
const MERCH_ITEMS: MerchItem[] = [
    {
        id: '1',
        name: 'Studio 64 T-Shirt',
        price: '$25.00',
        image: 'https://via.placeholder.com/200x200/4F46E5/FFFFFF?text=T-Shirt',
        description: 'Premium cotton t-shirt with Studio 64 logo',
        category: 'clothing',
    },
    {
        id: '2',
        name: 'Studio 64 Hoodie',
        price: '$45.00',
        image: 'https://via.placeholder.com/200x200/10B981/FFFFFF?text=Hoodie',
        description: 'Comfortable hoodie perfect for any weather',
        category: 'clothing',
    },
    {
        id: '3',
        name: 'Studio 64 Mug',
        price: '$12.00',
        image: 'https://via.placeholder.com/200x200/F59E0B/FFFFFF?text=Mug',
        description: 'Ceramic mug with Studio 64 branding',
        category: 'accessories',
    },
    {
        id: '4',
        name: 'Studio 64 Stickers Pack',
        price: '$8.00',
        image: 'https://via.placeholder.com/200x200/EF4444/FFFFFF?text=Stickers',
        description: 'Set of 5 high-quality vinyl stickers',
        category: 'accessories',
    },
    {
        id: '5',
        name: 'Studio 64 Cap',
        price: '$18.00',
        image: 'https://via.placeholder.com/200x200/8B5CF6/FFFFFF?text=Cap',
        description: 'Adjustable cap with embroidered logo',
        category: 'accessories',
    },
    {
        id: '6',
        name: 'Studio 64 Notebook',
        price: '$15.00',
        image: 'https://via.placeholder.com/200x200/06B6D4/FFFFFF?text=Notebook',
        description: 'Premium notebook for creative ideas',
        category: 'accessories',
    },
];

const MerchWindow: React.FC<MerchWindowProps> = ({ onClose, onFocus }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const { t } = useTranslation();

    const categories = ['all', 'clothing', 'accessories'];
    const filteredItems =
        selectedCategory === 'all'
            ? MERCH_ITEMS
            : MERCH_ITEMS.filter((item) => item.category === selectedCategory);

    const handleBuyClick = (item: MerchItem) => {
        // This will be implemented later when we add the shop functionality
        alert(
            `Buy functionality for ${item.name} will be implemented when the shop is ready!`
        );
    };

    return (
        <div
            className="bg-white border rounded shadow-lg min-w-[500px] min-h-[400px]"
            onClick={onFocus}
        >
            <div className="flex justify-between items-center p-3 border-b bg-gray-100">
                <div className="flex items-center">
                    <span className="text-lg mr-2">🛒</span>
                    <span className="font-bold text-sm">
                        {t('desktop.merch')}
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className="text-xs text-red-500 hover:underline px-2 py-1"
                    aria-label="Close window"
                >
                    ×
                </button>
            </div>

            <div className="p-4">
                {/* Category Filter */}
                <div className="flex space-x-2 mb-4">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                selectedCategory === category
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {category === 'all'
                                ? 'All Items'
                                : category.charAt(0).toUpperCase() +
                                  category.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            className="border rounded overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <div className="aspect-square bg-gray-100">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-3">
                                <h3 className="font-medium text-sm mb-1">
                                    {item.name}
                                </h3>
                                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                    {item.description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-green-600">
                                        {item.price}
                                    </span>
                                    <button
                                        onClick={() => handleBuyClick(item)}
                                        className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                                    >
                                        Buy
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredItems.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <div className="text-4xl mb-2">🛒</div>
                        <p>No items found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MerchWindow;
