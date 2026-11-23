import { BUSINESS_INFO } from '../data/businessData';
import { buildWhatsAppUrl } from '../utils/contact';

export function Footer() {
  return (
    <footer className="bg-[#0B3D91] text-white py-12 border-t border-[#072A66]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-white/15">
          <div className="md:col-span-5">
            <p className="font-display text-lg font-bold tracking-tight">
              {BUSINESS_INFO.name}
            </p>
            <p className="text-sm text-blue-100 mt-1">{BUSINESS_INFO.slogan}</p>
            <p className="text-xs text-blue-200 mt-4 leading-relaxed">
              {BUSINESS_INFO.address}
            </p>
          </div>

          <div className="md:col-span-4">
            <p className="text-sm font-semibold text-white mb-3">Navegação</p>
            <ul className="space-y-2 text-sm text-blue-100">
              <li>
                <a href="#servicos" className="hover:text-white transition-colors">
                  Nossos Serviços
                </a>
              </li>
              <li>
                <a href="#equipamento-3d" className="hover:text-white transition-colors">
                  Equipamento 3D
                </a>
              </li>
              <li>
                <a href="#galeria" className="hover:text-white transition-colors">
                  Galeria de Fotos
                </a>
              </li>
              <li>
                <a href="#depoimentos" className="hover:text-white transition-colors">
                  Depoimentos
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Perguntas Frequentes
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-sm font-semibold text-white mb-3">Contato</p>
            <p className="text-sm text-blue-100 tabular-nums mb-3">
              WhatsApp: {BUSINESS_INFO.phoneDisplay}
            </p>
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-[#E63946] px-4 py-2 text-xs font-semibold text-white hover:bg-[#C82333] transition-colors whitespace-nowrap"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-200">
          <p>
            &copy; {new Date().getFullYear()} {BUSINESS_INFO.name}. Todos os direitos reservados.
          </p>
          <p>Anápolis - Goiás · CEP 75113-170</p>
        </div>
      </div>
    </footer>
  );
}
