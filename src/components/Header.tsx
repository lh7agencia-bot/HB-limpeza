import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessData';

const NAV_LINKS = [
  { href: '#servicos', label: 'Serviços' },
  { href: '#equipamento-3d', label: 'Equipamento 3D' },
  { href: '#galeria', label: 'Galeria' },
  { href: '#depoimentos', label: 'Depoimentos' },
  { href: '#faq', label: 'FAQ' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#inicio"
          className="font-display text-base sm:text-lg font-bold tracking-tight text-[#0B3D91] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3D91]"
        >
          {BUSINESS_INFO.name}
        </a>

        {/* Zone 2: 5 concise single-line text nav links */}
        <nav
          aria-label="Navegação principal"
          className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700"
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-[#0B3D91] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3D91]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action + mobile drawer trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#contato"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#0B3D91] rounded-lg hover:bg-[#072A66] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E63946]"
          >
            Solicitar Orçamento
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-slate-200 text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Navegação móvel"
          className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2"
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50 hover:text-[#0B3D91]"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contato"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-center py-3 px-4 rounded-lg text-sm font-semibold text-white bg-[#E63946] hover:bg-[#C82333] transition-colors"
          >
            Solicite um Orçamento Gratuito
          </a>
        </nav>
      )}
    </header>
  );
}
