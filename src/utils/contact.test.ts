import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildMailtoUrl,
  buildWhatsAppUrl,
  formatContactSummary,
  getNextPhotoIndex,
  getPrevPhotoIndex,
  validateContactForm,
} from './contact';

test('validateContactForm rejects empty and malformed inputs with clear errors', () => {
  const result = validateContactForm({
    name: 'A',
    email: 'email-invalido',
    service: 'Limpeza Residencial',
    message: 'Oi',
  });

  assert.equal(result.valid, false);
  assert.ok(result.errors.name);
  assert.ok(result.errors.email);
  assert.ok(result.errors.message);
});

test('validateContactForm accepts valid contact payload', () => {
  const result = validateContactForm({
    name: 'Carlos Eduardo',
    email: 'carlos@exemplo.com.br',
    service: 'Limpeza Pós-Obra',
    message: 'Preciso de limpeza pós-obra para um apartamento de 85m2 no Jundiaí.',
  });

  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, {});
});

test('buildWhatsAppUrl formats exact phone number and encoded message', () => {
  const summary = formatContactSummary({
    name: 'Ana Paula',
    email: 'ana@exemplo.com',
    service: 'Higienização Profunda',
    message: 'Quero higienizar um sofá retrátil de 3 lugares.',
  });
  const url = buildWhatsAppUrl(summary);

  assert.ok(url.startsWith('https://wa.me/5562991713302?text='));
  assert.ok(url.includes(encodeURIComponent('Ana Paula')));
  assert.ok(url.includes(encodeURIComponent('Higienização Profunda')));
});

test('buildMailtoUrl encodes subject and body cleanly without inventing fake email addresses', () => {
  const url = buildMailtoUrl({
    name: 'Ana Paula',
    email: 'ana@exemplo.com',
    service: 'Limpeza Comercial',
    message: 'Orçamento para sala comercial no Centro de Anápolis.',
  });

  assert.ok(url.startsWith('mailto:?subject='));
  assert.ok(url.includes('&body='));
  assert.ok(url.includes(encodeURIComponent('HB LIMPEZA E HIGIENIZAÇÃO')));
});

test('lightbox index helpers wrap forward and backward cleanly', () => {
  assert.equal(getNextPhotoIndex(0, 4), 1);
  assert.equal(getNextPhotoIndex(3, 4), 0);
  assert.equal(getPrevPhotoIndex(0, 4), 3);
  assert.equal(getPrevPhotoIndex(2, 4), 1);
});
