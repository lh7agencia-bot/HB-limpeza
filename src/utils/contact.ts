import { BUSINESS_INFO } from '../data/businessData';

export interface ContactFormValues {
  name: string;
  email: string;
  service: string;
  message: string;
}

export interface ContactValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ContactFormValues, string>>;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContactForm(values: ContactFormValues): ContactValidationResult {
  const errors: Partial<Record<keyof ContactFormValues, string>> = {};

  const trimmedName = values.name.trim();
  const trimmedEmail = values.email.trim();
  const trimmedMessage = values.message.trim();

  if (trimmedName.length < 2) {
    errors.name = 'Informe seu nome completo (mínimo 2 caracteres).';
  }

  if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
    errors.email = 'Informe um endereço de e-mail válido.';
  }

  if (trimmedMessage.length < 10) {
    errors.message = 'Descreva brevemente o serviço desejado (mínimo 10 caracteres).';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function formatContactSummary(values: ContactFormValues): string {
  const serviceLabel = values.service.trim() || 'Orçamento Geral';
  return [
    `Olá, ${BUSINESS_INFO.name}! Gostaria de solicitar um orçamento gratuito.`,
    `Nome: ${values.name.trim()}`,
    `E-mail: ${values.email.trim()}`,
    `Serviço de interesse: ${serviceLabel}`,
    `Mensagem: ${values.message.trim()}`,
  ].join('\n');
}

export function buildWhatsAppUrl(customText?: string): string {
  const base = `https://wa.me/${BUSINESS_INFO.whatsappNumber}`;
  if (!customText || !customText.trim()) {
    return `${base}?text=${encodeURIComponent(
      `Olá, ${BUSINESS_INFO.name}! Gostaria de solicitar um orçamento gratuito.`
    )}`;
  }
  return `${base}?text=${encodeURIComponent(customText)}`;
}

export function buildMailtoUrl(values: ContactFormValues): string {
  const subject = `Solicitação de Orçamento - ${BUSINESS_INFO.name}`;
  const body = formatContactSummary(values);
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function getNextPhotoIndex(currentIndex: number, total: number): number {
  if (total <= 0) return 0;
  return (currentIndex + 1) % total;
}

export function getPrevPhotoIndex(currentIndex: number, total: number): number {
  if (total <= 0) return 0;
  return (currentIndex - 1 + total) % total;
}
