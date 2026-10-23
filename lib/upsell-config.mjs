// Upsell comum aos planos Básico e PRO. Não reutilizar os checkouts dos planos.
// Checkout próprio do Upsell 1 de €9,50, enviado pelo utilizador.
export const UPSELL1_CHECKOUT_URL = 'https://pay.hotmart.com/I108165848V?off=cdvb8icz';

// Enquanto as próximas etapas não existem, a recusa permite abrir o plano comprado.
export const UPSELL1_DECLINE_URL = 'https://ervasportuguesas.vercel.app/obrigado.html';

// Checkout próprio do Upsell 2 de €7,90, enviado pelo utilizador.
export const UPSELL2_CHECKOUT_URL = 'https://pay.hotmart.com/N108165939V?off=fqxiicl7';
// Permite consultar o plano de 7 dias na compra, enquanto não existe ligação de entrega.
export const UPSELL2_DECLINE_URL = 'https://consumer.hotmart.com/';

// Checkout próprio do Downsell «O Meu Primeiro Vaso» de €4,90, enviado pelo utilizador.
export const DOWNSELL_CHECKOUT_URL = 'https://pay.hotmart.com/L108166425X?off=qbn637fo';
export const DOWNSELL_DECLINE_URL = 'https://ervasportuguesas.vercel.app/obrigado.html';

// Checkout próprio da Oferta Final «A Minha Botica Organizada» de €3,90, enviado pelo utilizador.
export const FINAL_OFFER_CHECKOUT_URL = 'https://pay.hotmart.com/Q108166529E?off=dstce20f';
export const FINAL_OFFER_DECLINE_URL = 'https://consumer.hotmart.com/';
