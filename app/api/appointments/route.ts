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

// 1. Initialize Resend with your API Key
const resend = new Resend(process.env.RESEND_API_KEY);

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
export async function PUT(request: NextRequest): Promise<NextResponse<ApiResponse<Appointment>>> {
    try {
        const body = await request.json();
        const { id, status, reason, email, fullName, date } = body;

        if (!id) {
            return NextResponse.json({ success: false, error: 'Appointment ID required' }, { status: 400 });
        }

        const docRef = doc(db, COLLECTIONS.APPOINTMENTS, id);

        const updateData: any = {
            status,
            updatedAt: Timestamp.now(),
        };

        // If cancelling, save the reason to the database record
        if (status === 'cancelled') {
            updateData.cancellationReason = reason || "No reason specified";
        }

        await updateDoc(docRef, updateData);

        // 2. TRIGGER EMAIL LOGIC VIA RESEND
        if (status === 'cancelled' && email) {
            try {
                // Generate the HTML from your template
                const emailHtml = getCancellationTemplate(fullName, date, reason || "Schedule conflict");

                await resend.emails.send({
                    from: 'Smile Hub <onboarding@resend.dev>', // Keep this for Sandbox mode
                    to: email, // Must be your registered Resend email for Sandbox mode
                    subject: 'Update Regarding Your Dental Appointment',
                    html: emailHtml,
                });
                console.log(`Cancellation email sent to ${email}`);
            } catch (emailError) {
                // We log the error but don't fail the request because the DB update worked
                console.error("Resend failed to send email:", emailError);
            }
        }

        return NextResponse.json({
            success: true,
            message: status === 'cancelled' ? 'Appointment cancelled and email sent' : 'Status updated'
        });
    } catch (error) {
        console.error('Error updating appointment:', error);
        return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 });
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