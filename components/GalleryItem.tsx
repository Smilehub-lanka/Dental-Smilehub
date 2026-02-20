'use client';

import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

interface GalleryItemProps {
    item: {
        type: 'single' | 'comparison';
        imageUrl: string;
        beforeUrl?: string;
    };
}

/**
 * GalleryItem: Handles the rendering of individual gallery cards.
 * Uses a slider for comparison types and a simple image for singles.
 */
export function GalleryItem({ item }: GalleryItemProps) {
    return (
        <div className="break-inside-avoid mb-4 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white hover:shadow-md transition-shadow">
            {item.type === 'comparison' && item.beforeUrl ? (
                <ReactCompareSlider
                    itemOne={<ReactCompareSliderImage src={item.beforeUrl} alt="Before Treatment" />}
                    itemTwo={<ReactCompareSliderImage src={item.imageUrl} alt="After Treatment" />}
                    className="w-full"
                />
            ) : (
                <img
                    src={item.imageUrl}
                    className="w-full h-auto object-cover"
                    alt="Dental Gallery Transformation"
                />
            )}
        </div>
    );
}