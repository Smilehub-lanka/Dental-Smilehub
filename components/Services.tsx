'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Stethoscope,
  Sparkles,
  Scan,
  AlignCenter,
  Activity,
  Baby,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Internalized Types to ensure the component is self-contained ---
interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

// --- Internalized Default Data ---
const DEFAULT_SERVICES: Service[] = [
  {
    id: '1',
    title: 'General Dentistry',
    description: 'Routine check-ups, cleanings, and preventative care for a healthy smile.',
    icon: 'stethoscope',
  },
  {
    id: '2',
    title: 'Cosmetic Surgery',
    description: 'Professional teeth whitening, veneers, and aesthetic improvements.',
    icon: 'sparkles',
  },
  {
    id: '3',
    title: 'Dental Implants',
    description: 'Permanent solutions for missing teeth with a natural look and feel.',
    icon: 'scan',
  },
  {
    id: '4',
    title: 'Orthodontics',
    description: 'Braces and clear aligners to perfectly align your teeth.',
    icon: 'alignment',
  },
  {
    id: '5',
    title: 'Root Canal Treatment',
    description: 'Advanced endodontic therapy to save and restore damaged teeth.',
    icon: 'activity',
  },
  {
    id: '6',
    title: 'Pediatric Care',
    description: 'Gentle and fun dental experiences for your little ones.',
    icon: 'baby',
  }
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  stethoscope: Stethoscope,
  sparkles: Sparkles,
  scan: Scan,
  alignment: AlignCenter,
  activity: Activity,
  baby: Baby,
};

// Array of themed background images provided by the user
const SERVICE_BACKGROUNDS = [
  "https://smiletowndentalclinic.com/wp-content/uploads/2024/12/general-dentist-in-baguiati.png",
  "https://sasanedental.com/wp-content/uploads/2026/01/ChatGPTImageJan20202606_57_56P.jpeg",
  "https://www.sanmarcosdental.com/blog/wp-content/uploads/implant-diagram.jpeg",
  "https://vossdental.com/wp-content/uploads/2021/01/rubber-bands-for-braces-scaled-1.jpg",
  "https://www.nabadental.com/wp-content/uploads/2025/10/root-canal-retreatment-hero.jpg",
  "https://lirp.cdn-website.com/95b8274e/dms3rep/multi/opt/little+girl+at+pediatric+dentist+kansas+city-640w.jpg"
];

interface ServicesProps {
  services?: Service[];
}

export function Services({ services = DEFAULT_SERVICES }: ServicesProps) {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-20 md:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-sky-100 text-sky-600 rounded-full text-sm font-medium mb-4">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Comprehensive Dental Care{' '}
            <span className="bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent">
              for Everyone
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            From routine check-ups to advanced procedures, we offer a full range of dental
            services to keep your smile healthy and beautiful.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Stethoscope;
            return (
              <Card
                key={service.id}
                className={cn(
                  'group relative overflow-hidden border-0 bg-white shadow-lg hover:shadow-2xl transition-all duration-500 card-hover',
                  'animate-fade-in-up'
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* High-Transparency Themed Background Image */}
                <div
                  className="absolute inset-0 z-0 pointer-events-none opacity-[0.2] grayscale group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-700"
                  style={{
                    backgroundImage: `url(${SERVICE_BACKGROUNDS[index % SERVICE_BACKGROUNDS.length]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />

                <CardContent className="p-6 md:p-8 relative z-10">
                  {/* Icon */}
                  <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-sky-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-sky-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm md:text-base">
                    {service.description}
                  </p>

                  {/* Learn More Link */}
                  <button
                    onClick={() => scrollToSection('#appointment')}
                    className="inline-flex items-center text-sky-600 font-bold group-hover:text-sky-700 transition-colors"
                  >
                    Book Now
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </CardContent>

                {/* Decorative corner */}
                <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-sky-50 rounded-tl-3xl opacity-30 group-hover:opacity-60 transition-opacity" />
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">
            Not sure which service you need? We are here to help!
          </p>
          <button
            onClick={() => scrollToSection('#contact')}
            className="inline-flex items-center px-6 py-3 bg-sky-100 text-sky-600 rounded-xl font-bold hover:bg-sky-200 transition-colors shadow-sm"
          >
            Contact Us
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
}