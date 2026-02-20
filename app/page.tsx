'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Services } from '@/components/Services';
import { About } from '@/components/About';
import { DentalGallery } from '@/components/DentalGallery'; // New Import
import { Appointment } from '@/components/Appointment';
import { Reviews } from '@/components/Reviews';
import { GoogleReviews } from '@/components/GoogleReviews';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

export default function Home() {
  const [galleryItems, setGalleryItems] = useState<Array<{ id: string;[key: string]: any }>>([]);

  // Fetch Gallery Items from Firestore
  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));

    // Using onSnapshot so the gallery updates automatically if you add images in Admin
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setGalleryItems(items);
    }, (error) => {
      console.error("Error fetching gallery:", error);
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Services />
      <About />

      {/* 📍 Added Gallery Section here */}
      <DentalGallery items={galleryItems} />

      <Appointment />
      <Reviews />
      <GoogleReviews />
      <Contact />
      <Footer />
    </main>
  );
}