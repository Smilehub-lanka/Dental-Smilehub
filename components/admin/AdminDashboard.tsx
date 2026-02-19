'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Users
} from 'lucide-react';
import { DashboardStats, Appointment } from '@/types';
import { cn } from '@/lib/utils';

interface AdminDashboardProps {
  appointments: Appointment[];
}

export function AdminDashboard({ appointments }: AdminDashboardProps) {
  const stats: DashboardStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    
    const total = appointments.length;
    const pending = appointments.filter((a) => a.status === 'pending').length;
    const confirmed = appointments.filter((a) => a.status === 'confirmed').length;
    const todayAppts = appointments.filter((a) => a.date === today).length;

    return {
      totalAppointments: total,
      pendingAppointments: pending,
      confirmedAppointments: confirmed,
      todayAppointments: todayAppts,
    };
  }, [appointments]);

  const statsCards = [
    {
      title: 'Total Appointments',
      value: stats.totalAppointments,
      icon: Calendar,
      color: 'text-sky-600',
      bgColor: 'bg-sky-100',
      trend: '+12%',
    },
    {
      title: 'Pending',
      value: stats.pendingAppointments,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      trend: '-5%',
    },
    {
      title: 'Confirmed',
      value: stats.confirmedAppointments,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      trend: '+8%',
    },
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statsCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    {stat.trend && (
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className={cn('w-4 h-4', stat.color)} />
                        <span className={cn('text-sm font-medium', stat.color)}>
                          {stat.trend}
                        </span>
                        <span className="text-xs text-gray-500">vs last month</span>
                      </div>
                    )}
                  </div>
                  <div className={cn('p-3 rounded-xl', stat.bgColor)}>
                    <IconComponent className={cn('w-6 h-6', stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Appointments */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Recent Appointments
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {appointments.slice(0, 5).map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                    <span className="text-sky-600 font-semibold text-sm">
                      {appointment.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{appointment.fullName}</p>
                    <p className="text-sm text-gray-600">{appointment.service}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{appointment.date}</p>
                  <p className="text-sm text-gray-600">{appointment.time}</p>
                </div>
                <div>
                  <span
                    className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      appointment.status === 'pending' && 'bg-orange-100 text-orange-700',
                      appointment.status === 'confirmed' && 'bg-emerald-100 text-emerald-700',
                      appointment.status === 'cancelled' && 'bg-red-100 text-red-700',
                      appointment.status === 'completed' && 'bg-gray-100 text-gray-700'
                    )}
                  >
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
            {appointments.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No appointments yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
