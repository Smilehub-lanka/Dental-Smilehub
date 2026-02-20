'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CalendarIcon, CheckCircle2, Loader2 } from 'lucide-react';
import { format, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { TIME_SLOTS, AppointmentFormData } from '@/types';
import { toast } from 'sonner';

const appointmentSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.string().min(1, 'Please enter your age'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  date: z.date().refine((date) => date instanceof Date, "Please select a date"),
  time: z.string().min(1, 'Please select a time slot'),
  notes: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

interface BookedSlot {
  date: string;
  time: string;
  status: string;
}

export function Appointment() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      fullName: '',
      age: '',
      email: '',
      phone: '',
      date: undefined,
      time: '',
      notes: '',
    },
  });

  const watchDate = form.watch('date');

  useEffect(() => {
    if (watchDate) {
      fetchBookedSlots(format(watchDate, 'yyyy-MM-dd'));
    }
  }, [watchDate]);

  const fetchBookedSlots = async (date: string) => {
    try {
      const response = await fetch(`/api/slots?date=${date}`);
      const result = await response.json();
      if (result.success) {
        setBookedSlots(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching booked slots:', error);
    }
  };

  const isSlotBooked = (time: string) => {
    return bookedSlots.some(slot => slot.time === time && slot.status === 'confirmed');
  };

  const onSubmit = async (data: AppointmentFormValues) => {
    const dateStr = format(data.date, 'yyyy-MM-dd');
    setIsSubmitting(true);

    try {
      const appointmentData: AppointmentFormData = {
        ...data,
        service: 'General Consultation', // Defaulting since selection is removed
        date: dateStr,
      };

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData),
      });

      const result = await response.json();

      if (result.success) {
        setIsSuccess(true);
        toast.success('Appointment submitted successfully!');
        form.reset();
      } else {
        throw new Error(result.error || 'Failed to submit appointment');
      }
    } catch (error) {
      toast.error('Error', { description: error instanceof Error ? error.message : 'Try again later' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = startOfDay(new Date());
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);

  return (
    <section id="appointment" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Book an Appointment</h2>
          <p className="text-gray-500 mt-4">Complete the form below to request a time slot.</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-sky-600 text-white p-8">
              <CardTitle>Schedule Appointment</CardTitle>
            </CardHeader>
            <CardContent className="p-8 bg-white">
              {isSuccess ? (
                <div className="text-center py-10">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900">Appointment Request Sent!</h3>
                  <p className="text-gray-500 mt-2">We will contact you shortly to confirm your visit.</p>
                  <Button onClick={() => setIsSuccess(false)} variant="outline" className="mt-8">
                    Book Another Appointment
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="25" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="0771234567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Preferred Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button variant="outline" className={cn("pl-3 text-left font-normal border-gray-200", !field.value && "text-muted-foreground")}>
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < today || date.getDay() === 0}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Time</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-gray-200">
                                  <SelectValue placeholder="Select a slot" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {TIME_SLOTS.map((time) => (
                                  <SelectItem key={time} value={time} disabled={isSlotBooked(time)}>
                                    {time} {isSlotBooked(time) ? '(Booked)' : ''}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Symptoms / Notes</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Describe your dental concern..." className="min-h-[100px] border-gray-200" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white py-6 text-lg" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <><Loader2 className="animate-spin mr-2" /> Booking...</>
                      ) : (
                        'Book Appointment'
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}