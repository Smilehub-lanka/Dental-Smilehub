'use client';

import { useState } from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Maximize2, Sparkles } from 'lucide-react';
import { GalleryItem } from './GalleryItem';

interface DentalGalleryProps {
    items: any[];
}

/**
 * DentalGallery: The public-facing section for the homepage.
 * Shows pinned items first and provides a "View All" modal with a masonry layout.
 */
export function DentalGallery({ items = [] }: DentalGalleryProps) {
    // Logic: Pinned items come first, then sorted by most recent
    const displayItems = [...items]
        .sort((a, b) => {
            if (a.isPinned === b.isPinned) return b.createdAt - a.createdAt;
            return a.isPinned ? -1 : 1;
        })
        .slice(0, 6);

    return (
        <section id="gallery" className="py-20 bg-slate-50 border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-block px-4 py-1.5 bg-sky-100 text-sky-600 rounded-full text-sm font-medium mb-4">
                        Transformations
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Real Results, <span className="text-sky-600">Real Smiles</span>
                    </h2>
                    <p className="text-lg text-gray-600">
                        Explore our gallery of dental success stories. Move the slider to see the
                        incredible before and after transformations.
                    </p>
                </div>

                {/* Featured Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 group transition-all hover:-translate-y-1">
                            <div className="aspect-[4/3] overflow-hidden relative">
                                {item.isPinned && (
                                    <div className="absolute top-3 left-3 z-10 bg-sky-500 text-white p-1.5 rounded-lg shadow-md flex items-center gap-1 text-xs font-bold uppercase">
                                        <Sparkles className="w-3.5 h-3.5" />
                                    </div>
                                )}

                                {item.type === 'comparison' ? (
                                    <ReactCompareSlider
                                        itemOne={<ReactCompareSliderImage src={item.beforeUrl} alt="Before" />}
                                        itemTwo={<ReactCompareSliderImage src={item.imageUrl} alt="After" />}
                                        className="h-full"
                                    />
                                ) : (
                                    <img
                                        src={item.imageUrl}
                                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700"
                                        alt="Transformation"
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action Button */}
                <div className="mt-16 text-center">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="lg" className="rounded-full bg-sky-600 hover:bg-sky-700 px-10 h-14 text-lg shadow-sky-200 shadow-xl transition-all hover:scale-105">
                                View Full Smile Gallery <Maximize2 className="ml-2 w-5 h-5" />
                            </Button>
                        </DialogTrigger>

                        {/* Updated DialogContent for 90% screen fill */}
                        <DialogContent className="sm:max-w-[90vw] w-[90vw] h-[90vh] max-h-[90vh] p-0 flex flex-col overflow-hidden bg-slate-50">
                            <DialogHeader className="p-6 pb-2 shrink-0 bg-white border-b border-slate-200">
                                <DialogTitle className="text-2xl font-bold text-center">Full Results Gallery</DialogTitle>
                            </DialogHeader>

                            {/* Scrollable container with Masonry Layout */}
                            <div className="flex-1 overflow-y-auto p-6">
                                {/* 
                                   Updated columns: 
                                   - Default: 2 columns
                                   - sm (640px): 3 columns
                                   - md (768px): 4 columns
                                   - lg (1024px): 5 columns 
                                */}
                                <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4">
                                    {items.map((item) => (
                                        <GalleryItem key={item.id} item={item} />
                                    ))}
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </section>
    );
}