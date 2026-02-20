'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, Timestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Loader2, Upload, Trash2, Pin, ImageIcon, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * AdminGallery: The dashboard page for uploading and managing images.
 * Integrates directly with Cloudinary (unsigned) and Firestore.
 */
export default function AdminGallery() {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState<any[]>([]);
    const [isComparison, setIsComparison] = useState(false);

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        setItems(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    };

    const uploadToCloudinary = async (file: File) => {
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'smile_hub_gallery'); // MUST match your Cloudinary preset name

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            { method: 'POST', body: data }
        );
        const json = await res.json();
        if (json.error) throw new Error(json.error.message);
        return json.secure_url;
    };

    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const mainFile = formData.get('mainImage') as File;
        const beforeFile = formData.get('beforeImage') as File;

        try {
            // Step 1: Upload "After" or Single Image
            const imageUrl = await uploadToCloudinary(mainFile);
            let beforeUrl = '';

            // Step 2: Upload "Before" Image if needed
            if (isComparison && beforeFile) {
                beforeUrl = await uploadToCloudinary(beforeFile);
            }

            // Step 3: Record to Firestore
            await addDoc(collection(db, 'gallery'), {
                type: isComparison ? 'comparison' : 'single',
                imageUrl,
                beforeUrl,
                isPinned: false,
                createdAt: Timestamp.now(),
            });

            fetchGallery();
            (e.target as HTMLFormElement).reset();
            setIsComparison(false);
        } catch (err: any) {
            alert("Upload failed: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const togglePin = async (id: string, current: boolean) => {
        await updateDoc(doc(db, 'gallery', id), { isPinned: !current });
        fetchGallery();
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this transformation permanently?")) {
            await deleteDoc(doc(db, 'gallery', id));
            fetchGallery();
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto bg-slate-50 min-h-screen">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
                    <p className="text-gray-500">Upload and pin dental transformation photos</p>
                </div>
            </div>

            {/* Upload Form */}
            <form onSubmit={handleUpload} className="bg-white p-8 rounded-2xl border border-slate-200 mb-12 shadow-sm">
                <div className="flex items-center justify-between mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg", isComparison ? "bg-sky-100 text-sky-600" : "bg-emerald-100 text-emerald-600")}>
                            {isComparison ? <Layers className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">{isComparison ? 'Comparison Mode' : 'Single Image Mode'}</p>
                            <p className="text-xs text-gray-500">Toggle for Before/After view</p>
                        </div>
                    </div>
                    <Switch checked={isComparison} onCheckedChange={setIsComparison} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">{isComparison ? 'After Image (Final Result)' : 'Main Gallery Image'}</label>
                        <Input name="mainImage" type="file" accept="image/*" required className="cursor-pointer" />
                    </div>
                    {isComparison && (
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Before Image (Initial State)</label>
                            <Input name="beforeImage" type="file" accept="image/*" required className="cursor-pointer" />
                        </div>
                    )}
                </div>

                <Button disabled={loading} className="w-full h-12 bg-sky-600 hover:bg-sky-700 text-white font-bold">
                    {loading ? <Loader2 className="animate-spin mr-2" /> : <Upload className="mr-2" />}
                    {loading ? 'Processing Images...' : 'Upload Transformation'}
                </Button>
            </form>

            {/* Grid Management */}
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Layers className="w-5 h-5 text-sky-600" /> Existing Gallery Items
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {items.map(item => (
                    <div key={item.id} className="relative rounded-xl overflow-hidden group border border-slate-200 bg-white aspect-square shadow-sm">
                        <img src={item.imageUrl} className="h-full w-full object-cover" alt="Gallery preview" />

                        {/* Overlay Controls */}
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                            <div className="flex gap-2">
                                <Button
                                    size="icon"
                                    variant={item.isPinned ? "default" : "secondary"}
                                    className={cn("rounded-full", item.isPinned && "bg-sky-500")}
                                    onClick={() => togglePin(item.id, item.isPinned)}
                                >
                                    <Pin className={cn("w-4 h-4", item.isPinned && "fill-current")} />
                                </Button>
                                <Button size="icon" variant="destructive" className="rounded-full" onClick={() => handleDelete(item.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                            <span className="text-[10px] text-white font-bold uppercase tracking-widest px-2 py-1 bg-black/50 rounded">
                                {item.type}
                            </span>
                        </div>

                        {/* Pin Badge on Thumbnails */}
                        {item.isPinned && (
                            <div className="absolute top-2 right-2 bg-sky-500 text-white p-1 rounded-md shadow">
                                <Pin className="w-3 h-3 fill-current" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}