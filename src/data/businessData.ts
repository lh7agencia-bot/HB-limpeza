export interface ServiceItem {
  id: string;
  index: string;
  title: string;
  description: string;
  highlights: string[];
  iconName: 'home' | 'building' | 'sparkles' | 'hammer';
}

export interface GalleryPhoto {
  id: string;
  url: string;
  title: string;
  caption: string;
  alt: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  context: string;
  rating: number;
  text: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const BUSINESS_INFO = {
  name: 'HB LIMPEZA E HIGIENIZAÇÃO',
  shortName: 'HB Limpeza',
  slogan: 'Ambiente impecável sempre',
  niche: 'Limpeza e Higienização',
  address: 'EM FRENTE A PRAÇA DO TRABALHADOR - Av. Mato Grosso, 206 - A - Jundiaí, Anápolis - GO, 75113-170',
  shortAddress: 'Av. Mato Grosso, 206 - A · Jundiaí, Anápolis - GO',
  landmark: 'Em frente à Praça do Trabalhador',
  phoneDisplay: '(62) 99171-3302',
  whatsappNumber: '5562991713302',
  coordinates: [-16.3303, -48.9469] as [number, number],
  googleMapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Av.+Mato+Grosso,+206+-+A,+Jundia%C3%AD,+An%C3%A1polis+-+GO,+75113-170',
};

export const SERVICES: ServiceItem[] = [
  {
    id: 'limpeza-residencial',
    index: '01',
    title: 'Limpeza Residencial',
    description:
      'Cuidado minucioso para casas e apartamentos em Anápolis, com higienização de cozinhas, banheiros, pisos, vidros e áreas de convivência.',
    highlights: ['Rotina detalhada por cômodo', 'Produtos neutros e seguros'],
    iconName: 'home',
  },
  {
    id: 'limpeza-comercial',
    index: '02',
    title: 'Limpeza Comercial',
    description:
      'Manutenção e limpeza técnica para escritórios, clínicas, lojas e salas comerciais com padrão visual impecável para sua equipe e clientes.',
    highlights: ['Atendimento programado', 'Higienização de recepções e salas'],
    iconName: 'building',
  },
  {
    id: 'higienizacao-profunda',
    index: '03',
    title: 'Higienização Profunda',
    description:
      'Extração e sanitização profunda de estofados, colchões, tapetes e superfícies críticas, removendo ácaros, fungos, manchas e odores.',
    highlights: ['Extratora profissional de alta sucção', 'Ação bactericida e antiácaro'],
    iconName: 'sparkles',
  },
  {
    id: 'limpeza-pos-obra',
    index: '04',
    title: 'Limpeza Pós-Obra',
    description:
      'Remoção técnica de resíduos de cimento, gesso, tintas, poeira fina e adesivos sem agredir porcelanatos, esquadrias ou metais.',
    highlights: ['Acabamento fino em vidros e trilhos', 'Imóvel pronto para entrega imediata'],
    iconName: 'hammer',
  },
];

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'foto-1',
    url: 'https://lh3.googleusercontent.com/grass-cs/AABkmLdQX-aOB7js4tcqhwPHL9ktJmOIo2CkK2RUylWYB1t2spXr7HDxNmm4RAyAlyOTTDSqLPa-PcFgUS3V1z5hOUmrLKvrhJ6HN-OvK2MGF7jRM9i0zYcEw2nuqGIdDY7NWKXVs3cl-I5e9DM=s4800-w900',
    title: 'Estrutura e Atendimento HB',
    caption: 'Sede da HB Limpeza e Higienização no bairro Jundiaí, em frente à Praça do Trabalhador.',
    alt: 'Fachada e estrutura da HB Limpeza e Higienização em Anápolis',
  },
  {
    id: 'foto-2',
    url: 'https://lh3.googleusercontent.com/grass-cs/AABkmLdEIER_-JW95NgZdU6oJCTivMAMuf6wiimrKOMxvOmd4qJWQYJQPSh1w8Q8gMd_sssJFqyzZ-_PC2gTlj4Lz8dBZ0fPofMTLWK_q-Ta8A4L1miEiq9Txo990fP-W3fq8hqhZmXnK5OMBToO=s4800-w1024',
    title: 'Higienização Especializada',
    caption: 'Aplicação técnica com equipamentos profissionais para máxima remoção de impurezas.',
    alt: 'Equipamentos e execução de serviço da HB Limpeza e Higienização',
  },
  {
    id: 'foto-3',
    url: 'https://lh3.googleusercontent.com/grass-cs/AABkmLfaRk-zJfRbzQB2DaBy5Hpf0H_BD7P_2KyUxsS2r_P08QHMtLGTPeShWBN7RQqMBnnXq6siLcoGOK-bgvatShHQlFyNFLgQA27dMqtdYE-zn8De0XJsnBmkjkI4wHI7EFwxz9KGzS6Gdrs=s4800-w1024',
    title: 'Cuidado nos Detalhes',
    caption: 'Acabamento rigoroso em superfícies e estofados para entregar ambiente impecável sempre.',
    alt: 'Resultado de limpeza e higienização profissional da HB Limpeza',
  },
  {
    id: 'foto-4',
    url: 'https://lh3.googleusercontent.com/grass-cs/AABkmLcbo138akCrAlhSVFDfPsIevbEukS3mvk8JDmtYWGBrr23QpEWeq4TatxpkmeSbHDJ5SNEAymb7ttUf5G2ewe5F-HM4xnkO6zAdbsefSL7OQ4FOxJrkbCwmHJxGlueu0Yh3WZEqkytBl0Bi=s4800-w900',
    title: 'Padrão Profissional HB',
    caption: 'Equipe e insumos selecionados para atender residências e empresas em Anápolis.',
    alt: 'Atendimento e insumos profissionais da HB Limpeza e Higienização',
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'dep-1',
    name: 'Mariana Oliveira',
    context: 'Limpeza Pós-Obra · Bairro Jundiaí',
    rating: 5,
    text: 'Meu apartamento estava coberto de poeira de gesso e respingos de tinta depois da reforma. A equipe da HB deixou os porcelanatos, vidros e armários prontos para mudarmos no mesmo dia.',
  },
  {
    id: 'dep-2',
    name: 'Ricardo Mendes',
    context: 'Higienização Profunda · Centro, Anápolis',
    rating: 5,
    text: 'Contratamos a higienização do sofá e dos colchões por conta de alergias aqui em casa. O resultado superou o esperado: zero odor, tecido renovado e secagem muito rápida.',
  },
  {
    id: 'dep-3',
    name: 'Camila Ferreira',
    context: 'Limpeza Comercial · Vila Góis',
    rating: 5,
    text: 'Pontualidade e organização impecáveis no nosso consultório. Eles conhecem exatamente o produto certo para cada superfície e passam muita segurança no atendimento.',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Quais regiões de Anápolis a HB Limpeza e Higienização atende?',
    answer:
      'Nossa sede fica em frente à Praça do Trabalhador, na Av. Mato Grosso, 206 - A, no bairro Jundiaí, e atendemos residências, condomínios e empresas em toda Anápolis - GO e região.',
  },
  {
    id: 'faq-2',
    question: 'Qual é o tempo médio de secagem após a higienização profunda de estofados?',
    answer:
      'Utilizamos extratoras profissionais de alta sucção que retiram grande parte da umidade durante o processo. Em média, sofás e colchões secam completamente entre 4 e 8 horas, dependendo da ventilação do ambiente e do tipo de tecido.',
  },
  {
    id: 'faq-3',
    question: 'Os produtos utilizados são seguros para crianças, idosos e animais de estimação?',
    answer:
      'Sim. Trabalhamos com soluções profissionais de pH balanceado, ação biodegradável e aprovadas para uso residencial e comercial, eliminando ácaros e bactérias sem deixar resíduos tóxicos ou cheiro forte.',
  },
  {
    id: 'faq-4',
    question: 'A equipe leva os próprios equipamentos e produtos para o serviço?',
    answer:
      'Sim. Nossa equipe vai equipada com máquinas extratoras, aspiradores industriais, panos de microfibra diferenciados por área e insumos profissionais específicos para cada tipo de superfície.',
  },
  {
    id: 'faq-5',
    question: 'Como funciona o orçamento e o agendamento pelo WhatsApp?',
    answer:
      'Basta clicar em "Solicite um Orçamento Gratuito" ou nos enviar uma mensagem pelo WhatsApp (62) 99171-3302 informando o tipo de serviço e o tamanho do imóvel ou estofado. Retornamos rapidamente com a estimativa e os horários disponíveis.',
  },
];
