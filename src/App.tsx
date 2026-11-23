import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { SanitizationScene3D } from './components/SanitizationScene3D';
import { GallerySection } from './components/GallerySection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { WhatsAppFab } from './components/WhatsAppFab';
import { SERVICES } from './data/businessData';

export default function App() {
  const [selectedService, setSelectedService] = useState<string>(SERVICES[0].title);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Header />
      <main className="flex-1">
        <Hero />
        <ServicesSection onSelectService={setSelectedService} />
        <SanitizationScene3D />
        <GallerySection />
        <TestimonialsSection />
        <FaqSection />
        <ContactSection preselectedService={selectedService} />
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
