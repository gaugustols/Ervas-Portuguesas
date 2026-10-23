// Upsell comum aos planos Básico e PRO. Não reutilizar os checkouts dos planos.
// Checkout próprio do Upsell 1 de €9,50, enviado pelo utilizador.
export const UPSELL1_CHECKOUT_URL = 'https://pay.hotmart.com/I108165848V?off=cdvb8icz';

// Enquanto as próximas etapas não existem, a recusa permite abrir o plano comprado.
export const UPSELL1_DECLINE_URL = 'https://ervasportuguesas.vercel.app/obrigado.html';

// Upsell 2: preço de €7,90 confirmado pelo utilizador; checkout ainda não enviado.
export const UPSELL2_CHECKOUT_URL = '';
// Permite consultar o plano de 7 dias na compra, enquanto não existe ligação de entrega.
export const UPSELL2_DECLINE_URL = 'https://consumer.hotmart.com/';

// Downsell «O Meu Primeiro Vaso»: €4,90; checkout próprio ainda não enviado.
export const DOWNSELL_CHECKOUT_URL = '';
export const DOWNSELL_DECLINE_URL = 'https://ervasportuguesas.vercel.app/obrigado.html';

// Oferta final «A Minha Botica Organizada»: €3,90; checkout próprio por configurar.
export const FINAL_OFFER_CHECKOUT_URL = '';
export const FINAL_OFFER_DECLINE_URL = 'https://consumer.hotmart.com/';
