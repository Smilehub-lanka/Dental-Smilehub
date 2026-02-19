'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Review {
    author_name: string;
    rating: number;
    text: string;
    relative_time_description: string;
    profile_photo_url?: string;
}

export function GoogleReviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGoogleReviews = async () => {
            try {
                const response = await fetch('/api/google-reviews');
                const result = await response.json();
                if (Array.isArray(result)) {
                    setReviews(result);
                }
            } catch (error) {
                console.error('Error fetching google reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGoogleReviews();
    }, []);

    if (loading) {
        return (
            <section className="py-20 md:py-28 bg-gradient-to-b from-white to-sky-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
                    </div>
                </div>
            </section>
        );
    }

    if (!reviews || reviews.length === 0) {
        return null;
    }

    return (
        <section id="google-reviews" className="py-20 md:py-28 bg-gradient-to-b from-sky-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-block px-4 py-1.5 bg-sky-100 text-sky-600 rounded-full text-sm font-medium mb-4">
                        Google Reviews
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        What Our{' '}
                        <span className="bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent">
                            Patients Say
                        </span>
                    </h2>
                    <p className="text-lg text-gray-600">
                        Real reviews from our Google Maps listing.
                    </p>
                </div>

                {/* Reviews Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.map((review, index) => (
                        <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow h-full">
                            <CardContent className="p-6 flex flex-col">
                                <Quote className="w-8 h-8 text-sky-200 mb-4" />
                                <div className="flex items-center gap-1 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={cn(
                                                'w-4 h-4',
                                                i < review.rating
                                                    ? 'text-yellow-400 fill-yellow-400'
                                                    : 'text-gray-300'
                                            )}
                                        />
                                    ))}
                                </div>
                                <p className="text-gray-600 mb-4 leading-relaxed line-clamp-4 flex-grow">
                                    "{review.text}"
                                </p>
                                <div className="flex items-center gap-3 mt-auto">
                                    {review.profile_photo_url ? (
                                        <img
                                            src={review.profile_photo_url}
                                            alt={review.author_name}
                                            className="w-10 h-10 rounded-full"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center">
                                            <span className="text-white font-semibold text-sm">
                                                {review.author_name.charAt(0)}
                                            </span>
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-semibold text-gray-900">{review.author_name}</p>
                                        <p className="text-sm text-gray-500">{review.relative_time_description}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
