'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AppointmentStatus } from '@/types';
import {
    ChevronLeft,
    ChevronRight,
    Clock,
    User,
    Phone,
    Check,
    X,
    AlertCircle,
    FileText,
    Calendar
} from 'lucide-react';
import { Appointment } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface CalendarViewProps {
    appointments: Appointment[];
    onUpdateStatus: (id: string, status: AppointmentStatus) => void;
    updatingId: string | null;
}

const TIME_SLOTS = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM'
];

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarView({ appointments, onUpdateStatus, updatingId }: CalendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    // ✅ FIX 1: Helper function to get YYYY-MM-DD in LOCAL time
    const getLocalDateString = (date: Date) => {
        return format(date, 'yyyy-MM-dd');
    };

    const calendarDays = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startingDay = firstDay.getDay();
        const totalDays = lastDay.getDate();

        const days: { date: Date; isCurrentMonth: boolean; dateStr: string }[] = [];

        // Previous month days
        for (let i = startingDay - 1; i >= 0; i--) {
            const date = new Date(year, month, -i);
            days.push({
                date,
                isCurrentMonth: false,
                dateStr: getLocalDateString(date), // Using fix
            });
        }

        // Current month days
        for (let day = 1; day <= totalDays; day++) {
            const date = new Date(year, month, day);
            days.push({
                date,
                isCurrentMonth: true,
                dateStr: getLocalDateString(date), // Using fix
            });
        }

        // Next month days
        const remainingDays = 42 - days.length;
        for (let day = 1; day <= remainingDays; day++) {
            const date = new Date(year, month + 1, day);
            days.push({
                date,
                isCurrentMonth: false,
                dateStr: getLocalDateString(date), // Using fix
            });
        }

        return days;
    }, [currentDate]);

    const getConfirmedCount = (dateStr: string) => {
        return appointments.filter((apt) => apt.date === dateStr && apt.status === 'confirmed').length;
    };

    const getPendingCount = (dateStr: string) => {
        return appointments.filter((apt) => apt.date === dateStr && apt.status === 'pending').length;
    };

    // ✅ FIX 2: Get today's date in local YYYY-MM-DD
    const todayStr = getLocalDateString(new Date());

    const selectedDateAppointments = selectedDate
        ? appointments.filter((apt) => apt.date === selectedDate).sort((a, b) => {
            const timeA = TIME_SLOTS.indexOf(a.time);
            const timeB = TIME_SLOTS.indexOf(b.time);
            return timeA - timeB;
        })
        : [];

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            {/* Calendar UI */}
            <Card className="lg:col-span-2 border-0 shadow-lg">
                <CardHeader className="border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-gray-900">
                            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}>
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => {
                                setCurrentDate(new Date());
                                setSelectedDate(todayStr);
                            }}>
                                Today
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}>
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {DAYS_OF_WEEK.map((day) => (
                            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">{day}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((day, index) => {
                            const confirmedCount = getConfirmedCount(day.dateStr);
                            const pendingCount = getPendingCount(day.dateStr);
                            const isToday = day.dateStr === todayStr;
                            const isSelected = day.dateStr === selectedDate;

                            return (
                                <button
                                    key={index}
                                    onClick={() => setSelectedDate(day.dateStr)}
                                    className={cn(
                                        'relative p-2 h-20 rounded-lg transition-all text-left border',
                                        day.isCurrentMonth ? 'bg-white hover:bg-sky-50 border-gray-200' : 'bg-gray-50 text-gray-400 border-transparent',
                                        isSelected && 'ring-2 ring-sky-500 bg-sky-50',
                                        isToday && 'border-sky-500 bg-sky-50/50'
                                    )}
                                >
                                    <span className={cn('text-sm font-bold', isToday && 'text-sky-600')}>
                                        {day.date.getDate()}
                                    </span>
                                    <div className="mt-1 flex flex-wrap gap-1">
                                        {confirmedCount > 0 && <div className="w-2 h-2 rounded-full bg-emerald-500" title="Confirmed" />}
                                        {pendingCount > 0 && <div className="w-2 h-2 rounded-full bg-orange-500" title="Pending" />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Side Panel for Selected Date */}
            <Card className="border-0 shadow-lg h-fit">
                <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-gray-500">
                        {selectedDate ? format(new Date(selectedDate + 'T12:00:00'), 'eeee, MMM do') : 'Select Date'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    {!selectedDate ? (
                        <div className="text-center py-10 text-gray-400">
                            <Calendar className="w-10 h-10 mx-auto mb-2 opacity-20" />
                            <p>Click a date to see bookings</p>
                        </div>
                    ) : selectedDateAppointments.length === 0 ? (
                        <p className="text-center py-10 text-gray-400">No appointments</p>
                    ) : (
                        <div className="space-y-4">
                            {selectedDateAppointments.map((apt) => (
                                <div key={apt.id} className="p-3 border rounded-xl bg-white shadow-sm space-y-2">
                                    <div className="flex justify-between items-start">
                                        <span className="font-bold text-sky-700">{apt.time}</span>
                                        <Badge variant="outline" className={cn(
                                            apt.status === 'confirmed' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
                                        )}>{apt.status}</Badge>
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-semibold text-gray-900">{apt.fullName}</p>
                                        <p className="text-gray-500 text-xs">{apt.phone}</p>
                                        {apt.notes && (
                                            <p className="mt-2 text-xs bg-gray-50 p-2 rounded italic text-gray-600 border-l-2 border-sky-200">
                                                "{apt.notes}"
                                            </p>
                                        )}
                                    </div>

                                    {apt.status === 'pending' && (
                                        <div className="flex gap-2 pt-2">
                                            <Button size="sm" className="flex-1 bg-sky-600" onClick={() => onUpdateStatus(apt.id, 'confirmed')} disabled={updatingId === apt.id}>
                                                Accept
                                            </Button>
                                            <Button size="sm" variant="outline" className="flex-1 text-red-600" onClick={() => onUpdateStatus(apt.id, 'cancelled')} disabled={updatingId === apt.id}>
                                                Decline
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}