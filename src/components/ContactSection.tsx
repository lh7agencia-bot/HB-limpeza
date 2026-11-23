import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2, Copy, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { BUSINESS_INFO, SERVICES } from '../data/businessData';
import {
  buildMailtoUrl,
  buildWhatsAppUrl,
  formatContactSummary,
  validateContactForm,
  type ContactFormValues,
} from '../utils/contact';
import { LocationMap } from './LocationMap';

interface ContactSectionProps {
  preselectedService: string;
}

export function ContactSection({ preselectedService }: ContactSectionProps) {
  const [values, setValues] = useState<ContactFormValues>({
    name: '',
    email: '',
    service: preselectedService || SERVICES[0].title,
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormValues, string>>>({});
  const [submittedValues, setSubmittedValues] = useState<ContactFormValues | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (preselectedService) {
      setValues((prev) => ({ ...prev, service: preselectedService }));
    }
  }, [preselectedService]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const validation = validateContactForm(values);
    if (!validation.valid) {
      setErrors(validation.errors);
      setSubmittedValues(null);
      return;
    }
    setErrors({});
    setSubmittedValues({ ...values });
    setCopied(false);
  };

  const handleCopySummary = async () => {
    if (!submittedValues) return;
    try {
      await navigator.clipboard.writeText(formatContactSummary(submittedValues));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const summaryText = submittedValues ? formatContactSummary(submittedValues) : '';
  const whatsappHref = submittedValues ? buildWhatsAppUrl(summaryText) : buildWhatsAppUrl();
  const mailtoHref = submittedValues ? buildMailtoUrl(submittedValues) : '#';

  return (
    <section
      id="contato"
      aria-labelledby="heading-contato"
      className="py-16 md:py-24 bg-[#F8FAFC] border-t border-slate-200"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-semibold text-[#E63946] mb-2">
            Orçamento Rápido e Sem Compromisso
          </p>
          <h2
            id="heading-contato"
            className="font-display text-3xl md:text-4xl font-bold tracking-tight text-[#0B3D91] text-balance"
          >
            Solicite seu orçamento ou visite nossa sede
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Contact Form */}
          <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h3 className="font-display text-xl font-bold text-[#0B3D91] mb-2">
              Formulário de Contato
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Preencha seus dados e escolha enviar diretamente pelo WhatsApp ou pelo seu aplicativo de e-mail.
            </p>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-sm font-semibold text-slate-800 mb-1.5"
                >
                  Nome completo
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  value={values.name}
                  onChange={(e) => {
                    setValues((prev) => ({ ...prev, name: e.target.value }));
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  placeholder="Ex.: Mariana Oliveira"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'error-name' : undefined}
                  className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 ${
                    errors.name
                      ? 'border-[#E63946] focus:ring-[#E63946]/30'
                      : 'border-slate-300 focus:border-[#0B3D91] focus:ring-[#0B3D91]/20'
                  }`}
                />
                {errors.name && (
                  <p id="error-name" role="alert" className="text-xs font-medium text-[#E63946] mt-1.5">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-sm font-semibold text-slate-800 mb-1.5"
                >
                  E-mail
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  value={values.email}
                  onChange={(e) => {
                    setValues((prev) => ({ ...prev, email: e.target.value }));
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder="seuemail@exemplo.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'error-email' : undefined}
                  className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 ${
                    errors.email
                      ? 'border-[#E63946] focus:ring-[#E63946]/30'
                      : 'border-slate-300 focus:border-[#0B3D91] focus:ring-[#0B3D91]/20'
                  }`}
                />
                {errors.email && (
                  <p id="error-email" role="alert" className="text-xs font-medium text-[#E63946] mt-1.5">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-service"
                  className="block text-sm font-semibold text-slate-800 mb-1.5"
                >
                  Serviço de interesse
                </label>
                <select
                  id="contact-service"
                  name="service"
                  value={values.service}
                  onChange={(e) => setValues((prev) => ({ ...prev, service: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 bg-white focus:outline-none focus:border-[#0B3D91] focus:ring-2 focus:ring-[#0B3D91]/20"
                >
                  {SERVICES.map((s) => (
                    <option key={s.id} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                  <option value="Outro serviço de limpeza">Outro serviço de limpeza</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-sm font-semibold text-slate-800 mb-1.5"
                >
                  Mensagem
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  required
                  value={values.message}
                  onChange={(e) => {
                    setValues((prev) => ({ ...prev, message: e.target.value }));
                    if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                  }}
                  placeholder="Informe o bairro em Anápolis, tipo de imóvel ou estofado e o que precisa limpar..."
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'error-message' : undefined}
                  className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 ${
                    errors.message
                      ? 'border-[#E63946] focus:ring-[#E63946]/30'
                      : 'border-slate-300 focus:border-[#0B3D91] focus:ring-[#0B3D91]/20'
                  }`}
                />
                {errors.message && (
                  <p id="error-message" role="alert" className="text-xs font-medium text-[#E63946] mt-1.5">
                    {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#E63946] px-6 py-3.5 text-sm sm:text-base font-semibold text-white hover:bg-[#C82333] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3D91]"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
                Preparar Envio do Orçamento
              </button>
            </form>

            {submittedValues && (
              <div
                role="status"
                data-testid="contact-confirmation"
                className="mt-6 rounded-xl border border-[#0B3D91]/25 bg-[#0B3D91]/5 p-5"
              >
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-[#0B3D91] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-display text-sm font-bold text-[#0B3D91]">
                      Mensagem validada e pronta para envio
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Escolha abaixo o canal de preferência para concluir o envio para {BUSINESS_INFO.phoneDisplay}:
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#0B3D91] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-[#072A66] transition-colors whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    Enviar via WhatsApp
                  </a>

                  <a
                    href={mailtoHref}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors whitespace-nowrap"
                  >
                    <Mail className="w-4 h-4" aria-hidden="true" />
                    Enviar por E-mail
                  </a>

                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    {copied ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Interactive Leaflet Map + Official Details */}
          <div className="lg:col-span-6 space-y-6">
            <LocationMap />

            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#E63946] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-sm font-bold text-[#0B3D91]">Endereço Oficial</p>
                  <p className="text-sm text-slate-700 leading-relaxed mt-0.5">
                    {BUSINESS_INFO.address}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#0B3D91] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-sm font-bold text-[#0B3D91]">Telefone e WhatsApp</p>
                  <a
                    href={buildWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-[#E63946] hover:underline tabular-nums mt-0.5 inline-block"
                  >
                    {BUSINESS_INFO.phoneDisplay}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
