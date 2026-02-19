import { NextRequest, NextResponse } from 'next/server';
import { db, COLLECTIONS } from '@/lib/firebase';
import {
    collection,
    addDoc,
    getDocs,
    doc,
    deleteDoc,
    query,
    orderBy,
    Timestamp,
} from 'firebase/firestore';
import { ContactMessage, ApiResponse } from '@/types';

// GET - Fetch all contact messages
export async function GET(): Promise<NextResponse<ApiResponse<ContactMessage[]>>> {
    try {
        if (!db) {
            return NextResponse.json({
                success: true,
                data: [],
            });
        }

        const contactsRef = collection(db, COLLECTIONS.CONTACTS);
        const q = query(contactsRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        const contacts: ContactMessage[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name || '',
                email: data.email || '',
                message: data.message || '',
                createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            };
        });

        return NextResponse.json({
            success: true,
            data: contacts,
        });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        return NextResponse.json({
            success: true,
            data: [],
        });
    }
}

// POST - Create new contact message
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body.name || !body.email || !body.message) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const now = Timestamp.now();
        const contactData = {
            name: body.name,
            email: body.email,
            message: body.message,
            createdAt: now,
        };

        const docRef = await addDoc(collection(db, COLLECTIONS.CONTACTS), contactData);

        return NextResponse.json({
            success: true,
            data: { id: docRef.id, ...contactData },
            message: 'Message sent successfully!',
        });
    } catch (error) {
        console.error('Error creating contact:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to send message' },
            { status: 500 }
        );
    }
}

// DELETE - Delete contact message
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'ID is required' },
                { status: 400 }
            );
        }

        const docRef = doc(db, COLLECTIONS.CONTACTS, id);
        await deleteDoc(docRef);

        return NextResponse.json({
            success: true,
            message: 'Message deleted successfully!',
        });
    } catch (error) {
        console.error('Error deleting contact:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete message' },
            { status: 500 }
        );
    }
}
