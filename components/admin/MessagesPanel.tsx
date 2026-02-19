'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Mail,
    User,
    Clock,
    Trash2,
    Loader2,
    ExternalLink,
    AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    message: string;
    createdAt: string;
}

export function MessagesPanel() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/contacts');
            const result = await response.json();

            if (result.success) {
                setMessages(result.data || []);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const deleteMessage = async (id: string) => {
        setDeletingId(id);
        try {
            const response = await fetch(`/api/contacts?id=${id}`, {
                method: 'DELETE',
            });
            const result = await response.json();

            if (result.success) {
                toast.success('Message deleted');
                setMessages(messages.filter(m => m.id !== id));
            }
        } catch (error) {
            toast.error('Failed to delete message');
        } finally {
            setDeletingId(null);
        }
    };

    const openGmail = (email: string, name: string) => {
        const subject = encodeURIComponent(`Re: Your message to Smile Hub`);
        const body = encodeURIComponent(`Dear ${name},\n\nThank you for contacting Smile Hub.\n\n`);
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`, '_blank');
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Messages</h2>

            {messages.length === 0 ? (
                <Card className="border-0 shadow-lg">
                    <CardContent className="py-12 text-center">
                        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No messages yet</p>
                        <p className="text-sm text-gray-400">Messages from the contact form will appear here</p>
                    </CardContent>
                </Card>
            ) : (
                messages.map((message) => (
                    <Card key={message.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-sky-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">{message.name}</h4>
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                        <Mail className="w-3 h-3" />
                                        {message.email}
                                    </p>
                                </div>
                                <Badge variant="outline" className="ml-auto text-xs">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {formatDate(message.createdAt)}
                                </Badge>
                            </div>

                            {/* Message */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() => openGmail(message.email, message.name)}
                                    className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white"
                                >
                                    <Mail className="w-4 h-4 mr-2" />
                                    Reply via Gmail
                                    <ExternalLink className="w-3 h-3 ml-2" />
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => deleteMessage(message.id)}
                                    disabled={deletingId === message.id}
                                    className="border-red-200 text-red-600 hover:bg-red-50"
                                >
                                    {deletingId === message.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
}