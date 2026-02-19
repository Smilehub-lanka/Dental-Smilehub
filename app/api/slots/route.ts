import { NextRequest, NextResponse } from 'next/server';
import { db, COLLECTIONS } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { ApiResponse } from '@/types';

// GET - Fetch booked slots for a specific date
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<{ date: string; time: string; status: string }[]>>> {
    try {
        const { searchParams } = new URL(request.url);
        const date = searchParams.get('date');

        if (!date) {
            return NextResponse.json(
                { success: false, error: 'Date parameter is required' },
                { status: 400 }
            );
        }

        const appointmentsRef = collection(db, COLLECTIONS.APPOINTMENTS);
        const q = query(
            appointmentsRef,
            where('date', '==', date),
            where('status', 'in', ['confirmed', 'pending'])
        );

        const snapshot = await getDocs(q);

        const bookedSlots = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                date: data.date,
                time: data.time,
                status: data.status,
            };
        });

        return NextResponse.json({
            success: true,
            data: bookedSlots,
        });
    } catch (error) {
        console.error('Error fetching booked slots:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch booked slots' },
            { status: 500 }
        );
    }
}