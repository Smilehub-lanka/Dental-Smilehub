'use client';

import { useState, useEffect } from 'react';
// Using standard anchor tags for navigation to ensure compatibility if 'next/link' fails to resolve
// Adjusted relative paths to one level up to test resolution in this specific environment
import { db } from '@/lib/firebase';
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc,
    addDoc,
    Timestamp
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { LoginButton } from '@/components/admin/LoginButton';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AppointmentsTable } from '@/components/admin/AppointmentsTable';
import { CalendarView } from '@/components/admin/CalendarView';
import { useAuth } from '@/hooks/useAuth';
import { Appointment, AppointmentStatus } from '@/types';
import {
    Loader2,
    ArrowLeft,
    Smile,
    LayoutDashboard,
    Calendar,
    List,
    Image as ImageIcon,
    Upload,
    Trash2,
    Pin,
    Layers,
    Plus,
    AlertCircle,
    CheckCircle2,
    ExternalLink
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
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function AdminPage() {
    const { user, loading, isAdminUser } = useAuth();

    // Appointments State
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
    const [activeTab, setActiveTab] = useState('calendar');
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    // Gallery Management State
    const [galleryItems, setGalleryItems] = useState<any[]>([]);
    const [isComparison, setIsComparison] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Cancellation Dialog State
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    /**
     * REAL-TIME LISTENERS
     */
    useEffect(() => {
        if (!user || !isAdminUser || !db) return;

        // Sync Appointments
        const qAppts = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
        const unsubAppts = onSnapshot(qAppts, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            } as Appointment));
            setAppointments(items);
            setIsLoadingAppointments(false);
        }, (err) => {
            console.error("Firestore error:", err);
            setIsLoadingAppointments(false);
        });

        // Sync Gallery
        const qGallery = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
        const unsubGallery = onSnapshot(qGallery, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setGalleryItems(items);
        });

        return () => {
            unsubAppts();
            unsubGallery();
        };
    }, [user, isAdminUser]);

    /**
     * IMPROVED CLOUDINARY UPLOAD LOGIC
     */
    const uploadToCloudinary = async (file: File) => {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'smile_hub_gallery';

        if (!cloudName) {
            throw new Error("Cloud Name missing (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)");
        }

        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', uploadPreset);

        try {
            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                { method: 'POST', body: data }
            );

            const json = await res.json();

            if (!res.ok) {
                console.error("Cloudinary Error Detail:", json);
                if (json.error?.message?.includes("Upload preset not found")) {
                    throw new Error(`Cloudinary Error: The preset "${uploadPreset}" was not found. Please ensure you created an UNSIGNED preset with this exact name.`);
                }
                throw new Error(json.error?.message || "Upload to Cloudinary failed");
            }

            return json.secure_url;
        } catch (error: any) {
            console.error("Network/Upload Error:", error);
            throw error;
        }
    };

    const handleGalleryUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!db) return;

        setIsUploading(true);
        const formData = new FormData(e.currentTarget);
        const mainFile = formData.get('mainImage') as File;
        const beforeFile = formData.get('beforeImage') as File;

        if (!mainFile || mainFile.size === 0) {
            toast.error("Please select an image");
            setIsUploading(false);
            return;
        }

        try {
            const imageUrl = await uploadToCloudinary(mainFile);
            let beforeUrl = '';

            if (isComparison && beforeFile && beforeFile.size > 0) {
                beforeUrl = await uploadToCloudinary(beforeFile);
            }

            await addDoc(collection(db, 'gallery'), {
                type: isComparison ? 'comparison' : 'single',
                imageUrl,
                beforeUrl,
                isPinned: false,
                createdAt: Timestamp.now(),
            });

            toast.success("Image added to gallery!");
            (e.target as HTMLFormElement).reset();
            setIsComparison(false);
        } catch (err: any) {
            toast.error(err.message || "An error occurred during upload");
        } finally {
            setIsUploading(false);
        }
    };

    const togglePin = async (id: string, current: boolean) => {
        if (!db) return;
        await updateDoc(doc(db, 'gallery', id), { isPinned: !current });
    };

    const deleteGalleryItem = async (id: string) => {
        if (!db) return;
        if (window.confirm("Delete this gallery item?")) {
            await deleteDoc(doc(db, 'gallery', id));
            toast.success("Item deleted");
        }
    };

    /**
     * APPOINTMENT UPDATE LOGIC
     */
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
                    reason,
                    email: appointment?.email,
                    fullName: appointment?.fullName,
                    date: appointment?.date,
                    time: appointment?.time
                }),
            });

            const result = await response.json();
            if (result.success) {
                toast.success(`Appointment ${status} successfully`);
                setIsCancelDialogOpen(false);
                setCancelReason('');
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            toast.error('Failed to update status');
        } finally {
            setUpdatingId(null);
        }
    };

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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center max-w-sm w-full">
                    <Smile className="w-12 h-12 text-sky-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-6 text-gray-900">Admin Authentication</h2>
                    <LoginButton />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <a href="/" className="flex items-center gap-2">
                            <Smile className="w-6 h-6 text-sky-500" />
                            <span className="font-bold text-xl hidden sm:inline-block">Smile Hub</span>
                        </a>
                        <span className="px-2 py-0.5 bg-sky-100 text-sky-700 rounded text-[10px] font-bold tracking-widest uppercase">Admin</span>
                    </div>
                    <a href="/">
                        <Button variant="ghost" size="sm" className="rounded-full text-gray-500 hover:text-sky-600">
                            <ArrowLeft className="w-4 h-4 mr-2" /> View Site
                        </Button>
                    </a>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Practice Dashboard</h1>
                        <p className="text-gray-500 text-sm">Real-time scheduling and transformation gallery.</p>
                    </div>
                    <LoginButton />
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                    <TabsList className="bg-white border p-1 shadow-sm inline-flex h-auto rounded-2xl">
                        <TabsTrigger value="calendar" className="rounded-xl py-2.5 px-5">
                            <Calendar className="w-4 h-4 mr-2" /> Calendar
                        </TabsTrigger>
                        <TabsTrigger value="appointments" className="rounded-xl py-2.5 px-5">
                            <List className="w-4 h-4 mr-2" /> List
                        </TabsTrigger>
                        <TabsTrigger value="gallery" className="rounded-xl py-2.5 px-5">
                            <ImageIcon className="w-4 h-4 mr-2" /> Gallery
                        </TabsTrigger>
                        <TabsTrigger value="dashboard" className="rounded-xl py-2.5 px-5">
                            <LayoutDashboard className="w-4 h-4 mr-2" /> Analytics
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="calendar" className="mt-0 outline-none">
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm min-h-[500px]">
                            {isLoadingAppointments ? <Loader2 className="animate-spin mx-auto my-20 text-sky-500" /> : (
                                <CalendarView appointments={appointments} onUpdateStatus={handleStatusChange} updatingId={updatingId} />
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="appointments" className="mt-0 outline-none">
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                            {isLoadingAppointments ? <Loader2 className="animate-spin mx-auto my-20 text-sky-500" /> : (
                                <AppointmentsTable appointments={appointments} onUpdate={handleStatusChange} />
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="gallery" className="mt-0 outline-none">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1 space-y-6">
                                {/* Cloudinary Configuration Guide */}
                                <div className="bg-blue-50 border border-blue-100 p-5 rounded-3xl space-y-3">
                                    <h4 className="text-sm font-bold text-blue-900 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" /> Cloudinary Requirements
                                    </h4>
                                    <ul className="text-xs space-y-2 text-blue-800">
                                        <li className="flex items-start gap-2">
                                            <div className="mt-1"><CheckCircle2 className="w-3 h-3 text-blue-600" /></div>
                                            <span>Go to <strong>Settings &gt; Upload</strong> in Cloudinary</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="mt-1"><CheckCircle2 className="w-3 h-3 text-blue-600" /></div>
                                            <span>Add an <strong>Unsigned Preset</strong> named: <code className="bg-blue-100 px-1 rounded font-bold">smile_hub_gallery</code></span>
                                        </li>
                                        <li className="flex items-start gap-2 text-[10px] bg-blue-100/50 p-2 rounded-xl">
                                            <span>Current Cloud: <strong>{process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'Not Configured'}</strong></span>
                                        </li>
                                    </ul>
                                    <a
                                        href="https://cloudinary.com/console/settings/upload"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline"
                                    >
                                        Open Cloudinary Settings <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>

                                <form onSubmit={handleGalleryUpload} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                        <Plus className="w-5 h-5 text-sky-500" /> New Gallery Item
                                    </h3>

                                    <div className="flex items-center justify-between mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("p-2 rounded-xl", isComparison ? "bg-sky-100 text-sky-600" : "bg-emerald-100 text-emerald-600")}>
                                                {isComparison ? <Layers className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                                            </div>
                                            <span className="text-sm font-semibold">{isComparison ? 'Comparison' : 'Single'}</span>
                                        </div>
                                        <Switch checked={isComparison} onCheckedChange={setIsComparison} />
                                    </div>

                                    <div className="space-y-6 mb-8">
                                        <div>
                                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">{isComparison ? 'Result (After)' : 'Image'}</label>
                                            <Input name="mainImage" type="file" accept="image/*" className="rounded-xl border-slate-200 h-auto py-2" />
                                        </div>
                                        {isComparison && (
                                            <div>
                                                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">Initial (Before)</label>
                                                <Input name="beforeImage" type="file" accept="image/*" className="rounded-xl border-slate-200 h-auto py-2" />
                                            </div>
                                        )}
                                    </div>

                                    <Button disabled={isUploading} className="w-full h-12 rounded-xl bg-sky-600 hover:bg-sky-700 shadow-lg shadow-sky-100">
                                        {isUploading ? <Loader2 className="animate-spin mr-2" /> : <Upload className="mr-2 w-4 h-4" />}
                                        {isUploading ? 'Connecting to Cloudinary...' : 'Publish to Gallery'}
                                    </Button>
                                </form>
                            </div>

                            <div className="lg:col-span-2">
                                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm min-h-[400px]">
                                    <h3 className="text-lg font-bold mb-6">Live Gallery</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {galleryItems.map(item => (
                                            <div key={item.id} className="group relative aspect-square rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 shadow-sm">
                                                <img src={item.imageUrl} className="w-full h-full object-cover" alt="Preview" />

                                                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                                                    <Button
                                                        size="icon"
                                                        variant={item.isPinned ? "default" : "secondary"}
                                                        className={cn("rounded-full h-8 w-8", item.isPinned && "bg-sky-500")}
                                                        onClick={() => togglePin(item.id, item.isPinned)}
                                                    >
                                                        <Pin className={cn("w-4 h-4", item.isPinned && "fill-current")} />
                                                    </Button>
                                                    <Button size="icon" variant="destructive" className="rounded-full h-8 w-8" onClick={() => deleteGalleryItem(item.id)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="dashboard" className="mt-0 outline-none">
                        <AdminDashboard appointments={appointments} />
                    </TabsContent>
                </Tabs>
            </main>

            {/* CANCELLATION DIALOG */}
            <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                <DialogContent className="rounded-3xl sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Cancel Appointment</DialogTitle>
                        <DialogDescription className="pt-2">
                            Notify <strong>{selectedAppointment?.fullName}</strong>.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            placeholder="Provide a reason for the patient..."
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            className="min-h-[120px] rounded-2xl focus:ring-sky-500 border-slate-200"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsCancelDialogOpen(false)} className="rounded-full">Dismiss</Button>
                        <Button
                            variant="destructive"
                            disabled={!cancelReason || !!updatingId}
                            onClick={() => selectedAppointment && updateStatus(selectedAppointment.id, 'cancelled', cancelReason)}
                            className="rounded-full"
                        >
                            {updatingId ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : null}
                            Cancel & Notify
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}