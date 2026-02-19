import { NextRequest, NextResponse } from 'next/server';
import { db, COLLECTIONS } from '@/lib/firebase';
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    Timestamp,
} from 'firebase/firestore';
import { Appointment, AppointmentFormData, AppointmentStatus, ApiResponse } from '@/types';
import { Resend } from 'resend';
import { getCancellationTemplate } from '@/lib/email-templates';

// 1. Change the initialization to allow for a missing key during boot
const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

/**
 * GET - Fetch all appointments from Firestore
 */
export async function GET(): Promise<NextResponse<ApiResponse<Appointment[]>>> {
    try {
        if (!db) {
            return NextResponse.json({
                success: true,
                data: [],
                message: 'Firebase not initialized'
            });
        }

        const appointmentsRef = collection(db, COLLECTIONS.APPOINTMENTS);
        const q = query(appointmentsRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        const appointments: Appointment[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                // Convert Firestore Timestamps to ISO Strings for Next.js hydration
                createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            } as Appointment;
        });

        return NextResponse.json({ success: true, data: appointments });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch appointments'
        }, { status: 500 });
    }
}

/**
 * POST - Create a new appointment
 */
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Appointment>>> {
    try {
        const body: AppointmentFormData = await request.json();

        // Validate all required fields
        if (!body.fullName || !body.age || !body.email || !body.phone || !body.date || !body.time) {
            return NextResponse.json({
                success: false,
                error: 'Missing required fields (Name, Age, Email, Phone, Date, or Time)'
            }, { status: 400 });
        }

        const now = Timestamp.now();
        const appointmentData = {
            ...body,
            service: body.service || 'General Consultation', // Fallback if service selection is hidden
            status: 'pending' as AppointmentStatus,
            createdAt: now,
            updatedAt: now,
        };

        const docRef = await addDoc(collection(db, COLLECTIONS.APPOINTMENTS), appointmentData);

        return NextResponse.json({
            success: true,
            message: 'Appointment booked successfully!',
            data: { id: docRef.id, ...body } as any
        });
    } catch (error) {
        console.error('Error creating appointment:', error);
        return NextResponse.json({
            success: false,
            error: 'Server error while booking appointment'
        }, { status: 500 });
    }
}

/**
 * PUT - Update appointment status and trigger cancellation email
 */
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, status, reason, email, fullName, date } = body;

        console.log("--- DEBUG START ---");
        console.log("ID:", id, "Status:", status);
        console.log("Key Exists:", !!process.env.RESEND_API_KEY);
        console.log("Target Email:", email);

        const docRef = doc(db, COLLECTIONS.APPOINTMENTS, id);
        await updateDoc(docRef, { status, updatedAt: Timestamp.now() });

        if (status === 'cancelled' && email) {
            console.log("Attempting Resend to:", email);

            if (resend) {
                const { data, error } = await resend.emails.send({
                    from: 'Smile Hub <onboarding@resend.dev>',
                    to: email,
                    subject: 'Appointment Cancelled',
                    html: getCancellationTemplate(fullName, date, reason || "Schedule conflict"),
                });

                if (error) {
                    console.error("❌ RESEND ERROR:", error);
                } else {
                    console.log("✅ RESEND SUCCESS. ID:", data?.id);
                }
            } else {
                console.log("⚠️ RESEND_API_KEY not configured, skipping email");
            }
        }
        console.log("--- DEBUG END ---");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("CRASH ERROR:", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
/**
 * DELETE - Remove an appointment permanently
 */
export async function DELETE(request: NextRequest): Promise<NextResponse<ApiResponse<null>>> {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
        }

        await deleteDoc(doc(db, COLLECTIONS.APPOINTMENTS, id));
        return NextResponse.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        return NextResponse.json({ success: false, error: 'Delete failed' }, { status: 500 });
    }
}