'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Review {
    author_name: string;
    rating: number;
    text: string;
    relative_time_description: string;
    profile_photo_url?: string;
}

interface ReviewsData {
    name: string;
    rating: number;
    user_ratings_total: number;
    reviews: Review[];
}

export function Reviews() {
    const [data, setData] = useState<ReviewsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleReviews, setVisibleReviews] = useState(3);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch('/api/reviews');
                const result = await response.json();
                if (result.success) {
                    setData(result.data);
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setVisibleReviews(1);
            } else if (window.innerWidth < 1024) {
                setVisibleReviews(2);
            } else {
                setVisibleReviews(3);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const nextReviews = () => {
        if (!data?.reviews) return;
        setCurrentIndex((prev) =>
            prev + 1 >= data.reviews.length - visibleReviews + 1 ? 0 : prev + 1
        );
    };

    const prevReviews = () => {
        if (!data?.reviews) return;
        setCurrentIndex((prev) =>
            prev - 1 < 0 ? data.reviews.length - visibleReviews : prev - 1
        );
    };

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

    if (!data || !data.reviews || data.reviews.length === 0) {
        return null;
    }

    return (
        <section id="reviews" className="py-20 md:py-28 bg-gradient-to-b from-white to-sky-50">
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

                    {/* Overall Rating from Google */}
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={cn(
                                        'w-6 h-6',
                                        i < Math.round(data.rating)
                                            ? 'text-yellow-400 fill-yellow-400'
                                            : 'text-gray-300'
                                    )}
                                />
                            ))}
                        </div>
                        <span className="text-3xl font-bold text-gray-900">{data.rating}</span>
                        <span className="text-gray-600">({data.user_ratings_total} reviews on Google)</span>
                    </div>

                    <p className="text-lg text-gray-600">
                        Real reviews from our Google Maps listing. See what our patients have to say about their experience at {data.name}.
                    </p>
                </div>

                {/* Reviews Carousel */}
                <div className="relative">
                    {/* Navigation Buttons */}
                    <div className="absolute top-1/2 -left-4 z-10 -translate-y-1/2 hidden md:block">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={prevReviews}
                            className="bg-white shadow-lg rounded-full h-10 w-10"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                    </div>
                    <div className="absolute top-1/2 -right-4 z-10 -translate-y-1/2 hidden md:block">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={nextReviews}
                            className="bg-white shadow-lg rounded-full h-10 w-10"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Reviews Grid */}
                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-300 ease-in-out"
                            style={{
                                transform: `translateX(-${currentIndex * (100 / visibleReviews)}%)`,
                            }}
                        >
                            {data.reviews.map((review, index) => (
                                <div
                                    key={index}
                                    className="flex-shrink-0 px-2"
                                    style={{ width: `${100 / visibleReviews}%` }}
                                >
                                    <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow">
                                        <CardContent className="p-6">
                                            {/* Quote Icon */}
                                            <Quote className="w-8 h-8 text-sky-200 mb-4" />

                                            {/* Rating Stars */}
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

                                            {/* Review Text */}
                                            <p className="text-gray-600 mb-4 leading-relaxed line-clamp-4">
                                                "{review.text}"
                                            </p>

                                            {/* Author */}
                                            <div className="flex items-center gap-3">
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
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="flex justify-center gap-4 mt-6 md:hidden">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={prevReviews}
                            className="rounded-full"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={nextReviews}
                            className="rounded-full"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Dots Indicator */}
                <div className="flex items-center justify-center gap-2 mt-8">
                    {[...Array(Math.max(1, data.reviews.length - visibleReviews + 1))].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={cn(
                                'w-2 h-2 rounded-full transition-all',
                                currentIndex === i
                                    ? 'bg-sky-500 w-6'
                                    : 'bg-gray-300 hover:bg-gray-400'
                            )}
                        />
                    ))}
                </div>

                {/* Google Reviews Link */}
                <div className="text-center mt-10">
                    <a
                        href="https://www.google.com/maps/place/The+Smile+Hub+-+Dental+Hospital+%26+dental+impant+center+Athurugiriya+(By+Dr+M.K+Ovitigala)/@6.8795005,79.9848827,17z/data=!4m8!3m7!1s0x3ae251007488e535:0x4f0b924fd51a35ba!8m2!3d6.8795005!4d79.9848827!9m1!1b1!16s%2Fg%2F11x1smn7q8"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-700 hover:border-sky-300 hover:text-sky-600 transition-colors shadow-sm"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        View All Reviews on Google
                    </a>
                </div>
            </div>
        </section>
    );
}
