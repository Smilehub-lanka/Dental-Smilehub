import { NextResponse } from 'next/server';

interface GoogleReview {
    author_name: string;
    author_url?: string;
    profile_photo_url?: string;
    rating: number;
    text: string;
    time: number;
    relative_time_description: string;
}

interface PlaceDetails {
    name: string;
    rating: number;
    user_ratings_total: number;
    reviews: GoogleReview[];
}

// Google Places API - Place ID for Smile Hub
const PLACE_ID = '0x3ae251007488e535:0x4f0b924fd51a35ba';

export async function GET() {
    try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

        if (!apiKey) {
            // Return sample reviews if no API key
            return NextResponse.json({
                success: true,
                data: {
                    name: 'The Smile Hub - Dental Hospital & Dental Implant Center',
                    rating: 4.9,
                    user_ratings_total: 150,
                    reviews: getSampleReviews(),
                },
                usingSampleData: true,
            });
        }

        // Fetch real reviews from Google Places API
        const fields = 'name,rating,user_ratings_total,reviews';
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=${fields}&key=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'OK') {
            return NextResponse.json({
                success: true,
                data: {
                    name: data.result.name,
                    rating: data.result.rating,
                    user_ratings_total: data.result.user_ratings_total,
                    reviews: data.result.reviews || [],
                },
            });
        } else {
            console.error('Google Places API error:', data.status);
            return NextResponse.json({
                success: true,
                data: {
                    name: 'The Smile Hub - Dental Hospital & Dental Implant Center',
                    rating: 4.9,
                    user_ratings_total: 150,
                    reviews: getSampleReviews(),
                },
                usingSampleData: true,
                error: data.status,
            });
        }
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json({
            success: true,
            data: {
                name: 'The Smile Hub - Dental Hospital & Dental Implant Center',
                rating: 4.9,
                user_ratings_total: 150,
                reviews: getSampleReviews(),
            },
            usingSampleData: true,
        });
    }
}

function getSampleReviews() {
    return [
        {
            author_name: 'Sarah Perera',
            rating: 5,
            text: 'Excellent dental care! Dr. Ovitigala and the team are very professional and caring. Highly recommend for anyone looking for quality dental treatment.',
            relative_time_description: '2 weeks ago',
            profile_photo_url: '',
        },
        {
            author_name: 'Kasun Fernando',
            rating: 5,
            text: 'Best dental hospital in Athurugiriya! Got my dental implants done here. The procedure was smooth and the staff made me feel comfortable throughout.',
            relative_time_description: '1 month ago',
            profile_photo_url: '',
        },
        {
            author_name: 'Nimal Silva',
            rating: 5,
            text: 'Very modern facility with latest equipment. The doctors are knowledgeable and explain everything clearly. Great experience overall!',
            relative_time_description: '1 month ago',
            profile_photo_url: '',
        },
        {
            author_name: 'Priya Wickramasinghe',
            rating: 5,
            text: 'Wonderful experience! The clinic is very clean and the staff is friendly. Dr. Ovitigala is an expert in dental implants. Thank you for the great care!',
            relative_time_description: '2 months ago',
            profile_photo_url: '',
        },
        {
            author_name: 'Ruwan Jayasinghe',
            rating: 5,
            text: 'Professional service and affordable prices. The clinic has a calming atmosphere which helped with my dental anxiety. Highly recommended!',
            relative_time_description: '2 months ago',
            profile_photo_url: '',
        },
        {
            author_name: 'Thilini Rathnayake',
            rating: 5,
            text: 'Got my teeth whitening done here. Amazing results! The staff was very helpful and the procedure was quick and painless.',
            relative_time_description: '3 months ago',
            profile_photo_url: '',
        },
    ];
}