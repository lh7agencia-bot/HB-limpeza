import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from '../data/businessData';

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" aria-labelledby="heading-faq" className="py-16 md:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-sm font-semibold text-[#E63946] mb-2">
            Dúvidas Comuns
          </p>
          <h2
            id="heading-faq"
            className="font-display text-3xl md:text-4xl font-bold tracking-tight text-[#0B3D91] text-balance"
          >
            Perguntas Frequentes
          </h2>
        </div>

        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className="py-1">
                <h3>
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isOpen}
                    aria-controls={`panel-${item.id}`}
                    className="w-full py-5 flex items-center justify-between gap-4 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3D91]"
                  >
                    <span className="font-display text-base sm:text-lg font-semibold text-slate-900">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#0B3D91] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#E63946]' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <div
                  id={`panel-${item.id}`}
                  hidden={!isOpen}
                  className="pb-5 pr-8 text-sm sm:text-base text-slate-600 leading-relaxed"
                >
                  {item.answer}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
