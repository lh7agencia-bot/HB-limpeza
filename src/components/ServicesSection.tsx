import { ArrowUpRight, Building2, Check, Hammer, Home, Sparkles } from 'lucide-react';
import { SERVICES, type ServiceItem } from '../data/businessData';

interface ServicesSectionProps {
  onSelectService: (serviceTitle: string) => void;
}

function ServiceIcon({ name }: { name: ServiceItem['iconName'] }) {
  const iconClass = 'w-6 h-6 text-[#0B3D91]';
  switch (name) {
    case 'home':
      return <Home className={iconClass} aria-hidden="true" />;
    case 'building':
      return <Building2 className={iconClass} aria-hidden="true" />;
    case 'sparkles':
      return <Sparkles className={iconClass} aria-hidden="true" />;
    case 'hammer':
      return <Hammer className={iconClass} aria-hidden="true" />;
  }
}

export function ServicesSection({ onSelectService }: ServicesSectionProps) {
  return (
    <section id="servicos" aria-labelledby="heading-servicos" className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#E63946] mb-2">
              Soluções sob medida em Anápolis
            </p>
            <h2
              id="heading-servicos"
              className="font-display text-3xl md:text-4xl font-bold tracking-tight text-[#0B3D91] text-balance"
            >
              Nossos Serviços
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-600 max-w-md">
            Protocolos específicos para cada tipo de ambiente e revestimento, com equipe treinada e padrão de entrega rigoroso.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map((service) => (
            <article
              key={service.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 hover:border-[#0B3D91]/40 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[#0B3D91]/8 border border-[#0B3D91]/15 flex items-center justify-center shrink-0">
                    <ServiceIcon name={service.iconName} />
                  </div>
                  <span className="font-display text-sm font-bold text-slate-400 tabular-nums">
                    {service.index}.
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold text-[#0B3D91] mb-3">
                  {service.title}
                </h3>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                  {service.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {service.highlights.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-slate-700">
                      <Check className="w-4 h-4 text-[#E63946] shrink-0" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <a
                  href="#contato"
                  onClick={() => onSelectService(service.title)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0B3D91] hover:text-[#E63946] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3D91]"
                >
                  Orçar {service.title}
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
