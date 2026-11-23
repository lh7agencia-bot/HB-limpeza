import { Star } from 'lucide-react';
import { TESTIMONIALS } from '../data/businessData';

export function TestimonialsSection() {
  return (
    <section
      id="depoimentos"
      aria-labelledby="heading-depoimentos"
      className="py-16 md:py-24 bg-[#F8FAFC] border-y border-slate-200"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-semibold text-[#E63946] mb-2">
            Avaliações de Clientes em Anápolis
          </p>
          <h2
            id="heading-depoimentos"
            className="font-display text-3xl md:text-4xl font-bold tracking-tight text-[#0B3D91] text-balance"
          >
            Quem contrata recomenda a HB Limpeza e Higienização
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item) => (
            <article
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 sm:p-7"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-1" aria-hidden="true">
                    {Array.from({ length: item.rating }).map((_, idx) => (
                      <Star
                        key={idx}
                        className="w-4 h-4 fill-[#E63946] text-[#E63946]"
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-slate-600 tabular-nums">
                    {item.rating}.0 de 5 estrelas
                  </span>
                </div>

                <blockquote className="text-sm sm:text-base text-slate-700 leading-relaxed mb-6">
                  “{item.text}”
                </blockquote>
              </div>

              <footer className="pt-4 border-t border-slate-100">
                <p className="font-display text-sm font-bold text-[#0B3D91]">
                  {item.name}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{item.context}</p>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
