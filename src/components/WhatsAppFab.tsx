import { MessageCircle } from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessData';
import { buildWhatsAppUrl } from '../utils/contact';

export function WhatsAppFab() {
  return (
    <a
      href={buildWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Falar pelo WhatsApp ${BUSINESS_INFO.phoneDisplay}`}
      className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 h-12 px-4 rounded-full bg-[#E63946] text-white font-semibold text-sm shadow-lg hover:bg-[#C82333] transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3D91]"
    >
      <MessageCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
      <span className="hidden sm:inline whitespace-nowrap">WhatsApp</span>
    </a>
  );
}
