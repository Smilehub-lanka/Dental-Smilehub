// Appointment Types
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Appointment {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  notes?: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentFormData {
  fullName: string;
  email: string;
  phone: string;
  age: string; // Add this line
  service: string;
  date: string;
  time: string;
  notes?: string;
}
export interface Appointment extends AppointmentFormData {
  id: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
  cancellationReason?: string; // Also add this for the cancellation feature
}

// Service Types
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
  order: number;
}

// Team Member Types
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio?: string;
}

// Contact Form Types
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// Contact Message (stored in database)
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

// Stats Types
export interface ClinicStats {
  yearsOfExperience: number;
  happyPatients: number;
  professionalDentists: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  todayAppointments: number;
}

// User/Auth Types
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Time Slots
export const TIME_SLOTS = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
  '05:00 PM',
] as const;

// Default Services
export const DEFAULT_SERVICES: Service[] = [
  {
    id: '1',
    title: 'General Dentistry',
    description: 'Comprehensive dental check-ups, cleanings, and preventive care to maintain your oral health.',
    icon: 'stethoscope',
    isActive: true,
    order: 1,
  },
  {
    id: '2',
    title: 'Teeth Whitening',
    description: 'Professional whitening treatments to brighten your smile safely and effectively.',
    icon: 'sparkles',
    isActive: true,
    order: 2,
  },
  {
    id: '3',
    title: 'Dental Implants',
    description: 'Permanent tooth replacement solutions that look and function like natural teeth.',
    icon: 'scan',
    isActive: true,
    order: 3,
  },
  {
    id: '4',
    title: 'Orthodontics (Braces)',
    description: 'Traditional and modern orthodontic treatments for a perfectly aligned smile.',
    icon: 'alignment',
    isActive: true,
    order: 4,
  },
  {
    id: '5',
    title: 'Root Canal Treatment',
    description: 'Pain-free root canal therapy to save damaged teeth and relieve discomfort.',
    icon: 'activity',
    isActive: true,
    order: 5,
  },
  {
    id: '6',
    title: 'Pediatric Dentistry',
    description: 'Gentle and caring dental services designed specifically for children.',
    icon: 'baby',
    isActive: true,
    order: 6,
  },
];

// Default Team Members
export const DEFAULT_TEAM: TeamMember[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    role: 'Lead Dentist',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
    bio: 'Over 15 years of experience in general and cosmetic dentistry.',
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    role: 'Orthodontist',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
    bio: 'Specialized in orthodontics with a focus on invisible aligners.',
  },
  {
    id: '3',
    name: 'Dr. Emily Williams',
    role: 'Pediatric Dentist',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
    bio: 'Creating positive dental experiences for children of all ages.',
  },
  {
    id: '4',
    name: 'Dr. James Rodriguez',
    role: 'Oral Surgeon',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop',
    bio: 'Expert in dental implants and oral surgery procedures.',
  },
];
