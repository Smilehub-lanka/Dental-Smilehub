'use client';

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
import { DEFAULT_SERVICES, Service } from '@/types';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  stethoscope: Stethoscope,
  sparkles: Sparkles,
  scan: Scan,
  alignment: AlignCenter,
  activity: Activity,
  baby: Baby,
};

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
    <section id="services" className="py-20 md:py-28 bg-white">
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
                  'group relative overflow-hidden border-0 bg-gradient-to-br from-white to-sky-50/50 shadow-lg hover:shadow-xl transition-all duration-300 card-hover',
                  'animate-fade-in-up'
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 md:p-8">
                  {/* Icon */}
                  <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-sky-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-sky-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Learn More Link */}
                  <button
                    onClick={() => scrollToSection('#appointment')}
                    className="inline-flex items-center text-sky-600 font-medium group-hover:text-sky-700 transition-colors"
                  >
                    Book Now
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </CardContent>

                {/* Decorative corner */}
                <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-sky-100 rounded-tl-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
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
            className="inline-flex items-center px-6 py-3 bg-sky-100 text-sky-600 rounded-xl font-medium hover:bg-sky-200 transition-colors"
          >
            Contact Us
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
}
