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
import { getCancellationTemplate, getConfirmationTemplate } from '@/lib/email-templates';

// Initialize Resend
const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

/**
 * GET - Fetch all appointments from Firestore
 */
export async function GET(): Promise<NextResponse<ApiResponse<Appointment[]>>> {
    try {
        if (!db) return NextResponse.json({ success: true, data: [] });

        const appointmentsRef = collection(db, COLLECTIONS.APPOINTMENTS);
        const q = query(appointmentsRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        const appointments: Appointment[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            } as Appointment;
        });

        return NextResponse.json({ success: true, data: appointments });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch appointments' }, { status: 500 });
    }
}

/**
 * POST - Create a new appointment
 */
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Appointment>>> {
    try {
        const body: AppointmentFormData = await request.json();

        if (!body.fullName || !body.age || !body.email || !body.phone || !body.date || !body.time) {
            return NextResponse.json({
                success: false,
                error: 'Missing required fields'
            }, { status: 400 });
        }

        const now = Timestamp.now();
        const appointmentData = {
            ...body,
            service: body.service || 'General Consultation',
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
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}

/**
 * PUT - Update status and send either Confirmation or Cancellation email
 */
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, status, reason, email, fullName, date, time } = body;

        if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

        console.log(`--- UPDATING STATUS: ${status} ---`);

        const docRef = doc(db, COLLECTIONS.APPOINTMENTS, id);

        // Prepare DB update
        const updateData: any = { status, updatedAt: Timestamp.now() };
        if (status === 'cancelled') {
            updateData.cancellationReason = reason || "No reason specified";
        }

        // Update Firestore
        await updateDoc(docRef, updateData);

        // TRIGGER EMAIL LOGIC
        if (resend && email) {
            let emailSubject = '';
            let emailHtml = '';

            // Handle Cancellation
            if (status === 'cancelled') {
                emailSubject = 'Appointment Cancellation - Smile Hub';
                emailHtml = getCancellationTemplate(fullName, date, reason || "Schedule conflict");
            }
            // Handle Acceptance
            else if (status === 'confirmed') {
                emailSubject = 'Appointment Confirmed - Smile Hub';
                emailHtml = getConfirmationTemplate(fullName, date, time);
            }

            if (emailHtml) {
                const { data, error } = await resend.emails.send({
                    from: 'Smile Hub <appointments@rexod.me>',
                    to: email,
                    subject: emailSubject,
                    html: emailHtml,
                });

                if (error) console.error("❌ RESEND ERROR:", error);
                else console.log("✅ EMAIL SENT SUCCESS. ID:", data?.id);
            }
        }

        return NextResponse.json({ success: true, message: `Appointment ${status}` });
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
        if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

        await deleteDoc(doc(db, COLLECTIONS.APPOINTMENTS, id));
        return NextResponse.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Delete failed' }, { status: 500 });
    }
}