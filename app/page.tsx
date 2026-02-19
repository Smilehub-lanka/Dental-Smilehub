'use client';

import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Services } from '@/components/Services';
import { About } from '@/components/About';
import { Appointment } from '@/components/Appointment';
import { Reviews } from '@/components/Reviews';
import { GoogleReviews } from '@/components/GoogleReviews';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Services />
      <About />
      <Appointment />
      <Reviews />
      <GoogleReviews />
      <Contact />
      <Footer />
    </main>
  );
}
