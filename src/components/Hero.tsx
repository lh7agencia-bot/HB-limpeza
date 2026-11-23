import { useState } from 'react';
import { ArrowRight, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { BUSINESS_INFO, GALLERY_PHOTOS } from '../data/businessData';
import { buildWhatsAppUrl } from '../utils/contact';

export function Hero() {
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const heroPhoto = GALLERY_PHOTOS[0];
  const whatsappUrl = buildWhatsAppUrl();

  return (
    <section id="inicio" className="bg-white pt-10 pb-14 md:pt-16 md:pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left column: Value Proposition & Dominant Primary CTA */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <p className="text-sm font-semibold text-[#E63946] mb-3">
              {BUSINESS_INFO.slogan} · Anápolis, GO
            </p>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-[52px] font-extrabold tracking-tight text-[#0B3D91] leading-[1.1] text-balance mb-6">
              Limpeza técnica e higienização profunda para sua casa ou empresa
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mb-8">
              Na <strong className="font-semibold text-slate-900">{BUSINESS_INFO.name}</strong>,
              combinamos equipamentos extratores de alta performance e produtos seguros para
              entregar ambientes saudáveis, livres de ácaros e com acabamento impecável em Anápolis.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <a
                href="#contato"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-[#E63946] text-white font-semibold text-base shadow-sm hover:bg-[#C82333] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3D91]"
              >
                Solicite um Orçamento Gratuito
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl border border-slate-300 text-[#0B3D91] font-semibold text-sm hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3D91]"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                WhatsApp {BUSINESS_INFO.phoneDisplay}
              </a>
            </div>
          </div>

          {/* Right column: Real Establishment Image */}
          <div className="lg:col-span-5">
            <div className="relative h-72 sm:h-96 lg:h-full min-h-[340px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
              {!heroImgFailed ? (
                <img
                  src={heroPhoto.url}
                  alt={heroPhoto.alt}
                  referrerPolicy="no-referrer"
                  onError={() => setHeroImgFailed(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#0B3D91] to-[#072A66] text-white">
                  <ShieldCheck className="w-12 h-12 mb-3 text-[#E63946]" aria-hidden="true" />
                  <p className="font-display text-lg font-bold">{BUSINESS_INFO.name}</p>
                  <p className="text-sm text-slate-200 mt-1">{BUSINESS_INFO.slogan}</p>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent p-5">
                <p className="text-sm font-semibold text-white">
                  {BUSINESS_INFO.landmark}
                </p>
                <p className="text-xs text-slate-200 mt-0.5">
                  {BUSINESS_INFO.shortAddress}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width structural strip below hero split */}
        <div className="mt-10 pt-8 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#E63946] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-[#0B3D91]">Localização Estratégica</p>
              <p className="text-sm text-slate-600">
                Em frente à Praça do Trabalhador · Bairro Jundiaí, Anápolis - GO
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#0B3D91] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-[#0B3D91]">Insumos e Equipamentos Próprios</p>
              <p className="text-sm text-slate-600">
                Extração profunda e produtos certificados seguros para famílias e empresas
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-[#E63946] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-[#0B3D91]">Atendimento Direto</p>
              <p className="text-sm text-slate-600 tabular-nums">
                Agendamento rápido pelo WhatsApp {BUSINESS_INFO.phoneDisplay}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
