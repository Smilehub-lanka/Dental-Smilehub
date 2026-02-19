'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Award, Users, Clock, Heart } from 'lucide-react';
import { DEFAULT_TEAM, TeamMember } from '@/types';
import { cn } from '@/lib/utils';

interface AboutProps {
  team?: TeamMember[];
}

const stats = [
  {
    icon: Award,
    value: '15+',
    label: 'Years of Experience',
    color: 'text-sky-600',
    bgColor: 'bg-sky-100',
  },
  {
    icon: Users,
    value: '10,000+',
    label: 'Happy Patients',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
  },
  {
    icon: Clock,
    value: '24/7',
    label: 'Emergency Care',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  {
    icon: Heart,
    value: '98%',
    label: 'Patient Satisfaction',
    color: 'text-rose-600',
    bgColor: 'bg-rose-100',
  },
];

export function About({ team = DEFAULT_TEAM }: AboutProps) {
  return (
    <section id="about" className="py-20 md:py-28 bg-gradient-to-b from-sky-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-sky-100 text-sky-600 rounded-full text-sm font-medium mb-4">
            About Us
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Your Trusted Partner in{' '}
            <span className="bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent">
              Dental Health
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            For over 15 years, Smile Hub has been dedicated to providing exceptional
            dental care in a comfortable, welcoming environment. Our team of expert
            dentists uses the latest technology to ensure the best outcomes for our patients.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                At Smile Hub, we believe everyone deserves access to quality dental care.
                Our mission is to provide comprehensive, compassionate dental services that
                help our patients achieve and maintain optimal oral health.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We are committed to staying at the forefront of dental technology and
                techniques, continuously improving our skills to deliver the best possible
                care. Your comfort and well-being are our top priorities.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={index}
                    className={cn(
                      'p-4 md:p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100',
                      'hover:shadow-lg transition-shadow'
                    )}
                  >
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', stat.bgColor)}>
                      <IconComponent className={cn('w-5 h-5', stat.color)} />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Meet Our Expert Team
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our team of skilled dentists and specialists are dedicated to providing
            you with the highest quality care in a comfortable environment.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {team.map((member, index) => (
            <Card
              key={member.id}
              className={cn(
                'group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 card-hover',
                'animate-fade-in-up'
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-0">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-5 text-center">
                  <h4 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-sky-600 transition-colors">
                    {member.name}
                  </h4>
                  <p className="text-sky-600 font-medium text-sm mb-2">{member.role}</p>
                  {member.bio && (
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
