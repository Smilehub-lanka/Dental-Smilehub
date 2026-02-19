'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginButton } from '@/components/admin/LoginButton';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AppointmentsTable } from '@/components/admin/AppointmentsTable';
import { CalendarView } from '@/components/admin/CalendarView';
import { useAuth } from '@/hooks/useAuth';
import { Appointment, AppointmentStatus } from '@/types';
import {
    MessageSquare,
    Loader2,
    ArrowLeft,
    Smile,
    LayoutDashboard,
    Calendar,
    List
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminPage() {
    const { user, loading, isAdminUser } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
    const [activeTab, setActiveTab] = useState('calendar');
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    // Cancellation Dialog State
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    const fetchAppointments = useCallback(async () => {
        try {
            setIsLoadingAppointments(true);
            const response = await fetch('/api/appointments');
            const result = await response.json();

            if (result.success) {
                setAppointments(result.data || []);
            } else {
                console.error('Failed to fetch appointments:', result.error);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            toast.error('Failed to load appointments');
        } finally {
            setIsLoadingAppointments(false);
        }
    }, []);

    useEffect(() => {
        if (user && isAdminUser) {
            fetchAppointments();
        }
    }, [user, isAdminUser, fetchAppointments]);

    // Inside AdminPage component
    const updateStatus = async (id: string, status: AppointmentStatus, reason?: string) => {
        setUpdatingId(id);
        const appointment = appointments.find(a => a.id === id);

        try {
            const response = await fetch('/api/appointments', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    status,
                    reason, // <--- Ensure this is being sent!
                    email: appointment?.email,
                    fullName: appointment?.fullName,
                    date: appointment?.date
                }),
            });

            const result = await response.json();

            if (result.success) {
                toast.success(`Appointment ${status} successfully`);
                fetchAppointments(); // Refresh list
                setIsCancelDialogOpen(false); // Close the dialog
                setCancelReason(''); // Clear the text
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            toast.error('Failed to update');
        } finally {
            setUpdatingId(null);
        }
    };
    // Logic to decide if we need a reason or just update directly
    const handleStatusChange = (id: string, status: AppointmentStatus) => {
        if (status === 'cancelled') {
            const appt = appointments.find(a => a.id === id);
            setSelectedAppointment(appt || null);
            setIsCancelDialogOpen(true);
        } else {
            updateStatus(id, status);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-sky-500" />
            </div>
        );
    }

    if (!user || !isAdminUser) {
        return (
            <div className="min-h-screen bg-gray-50">
                <header className="bg-white border-b p-4 text-center">
                    <Smile className="w-8 h-8 text-sky-500 mx-auto" />
                    <h1 className="text-xl font-bold">Smile Hub Admin</h1>
                </header>
                <main className="max-w-md mx-auto py-12">
                    <LoginButton />
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2">
                            <Smile className="w-6 h-6 text-sky-500" />
                            <span className="font-bold text-xl">Smile Hub</span>
                        </Link>
                        <span className="px-2 py-0.5 bg-sky-100 text-sky-700 rounded text-xs font-bold">ADMIN</span>
                    </div>
                    <Link href="/">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Site
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-6"><LoginButton /></div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="bg-white border p-1 shadow-sm">
                        <TabsTrigger value="calendar"><Calendar className="w-4 h-4 mr-2" />Calendar</TabsTrigger>
                        <TabsTrigger value="appointments"><List className="w-4 h-4 mr-2" />Appointments</TabsTrigger>
                        <TabsTrigger value="dashboard"><LayoutDashboard className="w-4 h-4 mr-2" />Stats</TabsTrigger>
                    </TabsList>

                    <TabsContent value="calendar">
                        {isLoadingAppointments ? <Loader2 className="animate-spin mx-auto" /> : (
                            <CalendarView
                                appointments={appointments}
                                onUpdateStatus={handleStatusChange}
                                updatingId={updatingId}
                            />
                        )}
                    </TabsContent>

                    <TabsContent value="appointments">
                        {isLoadingAppointments ? <Loader2 className="animate-spin mx-auto" /> : (
                            <AppointmentsTable
                                appointments={appointments}
                                onUpdate={handleStatusChange}
                            />
                        )}
                    </TabsContent>

                    <TabsContent value="dashboard">
                        <AdminDashboard appointments={appointments} />
                    </TabsContent>
                </Tabs>
            </main>

            {/* CANCELLATION DIALOG */}
            <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cancel Appointment</DialogTitle>
                        <DialogDescription>
                            Explain why you are cancelling for <strong>{selectedAppointment?.fullName}</strong>.
                            An email will be sent to them automatically.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            placeholder="Reason for cancellation (e.g., Doctor is unavailable, Emergency maintenance...)"
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsCancelDialogOpen(false)}>Back</Button>
                        <Button
                            variant="destructive"
                            disabled={!cancelReason || !!updatingId}
                            onClick={() => selectedAppointment && updateStatus(selectedAppointment.id, 'cancelled', cancelReason)}
                        >
                            {updatingId ? <Loader2 className="animate-spin mr-2" /> : null}
                            Cancel & Send Email
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}