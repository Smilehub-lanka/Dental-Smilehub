'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Shield, Star } from 'lucide-react';

export function Hero() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 pattern-bg opacity-30" />
      
      {/* Decorative shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-sky-300/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-sky-200/40 rounded-full blur-2xl" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-8 animate-fade-in">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium text-gray-700">
              Trusted by over 10,000+ happy patients
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 animate-fade-in-up">
            Your Perfect Smile{' '}
            <span className="bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent">
              Starts Here
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Experience exceptional dental care with our team of expert dentists.
            We combine cutting-edge technology with compassionate care to give you
            the smile you deserve.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Button
              size="lg"
              onClick={() => scrollToSection('#appointment')}
              className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-8 py-6 text-lg shadow-xl shadow-sky-200 hover:shadow-sky-300 transition-all"
            >
              Book Appointment
              <Calendar className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection('#services')}
              className="px-8 py-6 text-lg border-2 border-sky-200 text-sky-600 hover:bg-sky-50"
            >
              Our Services
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-center gap-3 px-6 py-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-sky-600" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-gray-900">15+</p>
                <p className="text-sm text-gray-600">Years Experience</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 px-6 py-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-sky-600" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-gray-900">10K+</p>
                <p className="text-sm text-gray-600">Happy Patients</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 px-6 py-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-sky-600" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-gray-900">4.9</p>
                <p className="text-sm text-gray-600">Rating Score</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button
            onClick={() => scrollToSection('#services')}
            className="w-8 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-start justify-center p-2 shadow-lg border border-sky-100"
          >
            <div className="w-1.5 h-3 bg-sky-500 rounded-full" />
          </button>
        </div>
      </div>
    </section>
  );
}
