// Upsell comum aos planos Básico e PRO. Não reutilizar os checkouts dos planos.
// Vazio mantém o botão de compra desativado. Configurar o checkout próprio de €9,50.
export const UPSELL1_CHECKOUT_URL = '';

// Enquanto as próximas etapas não existem, a recusa permite abrir o plano comprado.
export const UPSELL1_DECLINE_URL = 'https://ervasportuguesas.vercel.app/obrigado.html';

// Upsell 2: preço de €7,90 confirmado pelo utilizador; checkout ainda não enviado.
export const UPSELL2_CHECKOUT_URL = '';
// Permite consultar o plano de 7 dias na compra, enquanto não existe ligação de entrega.
export const UPSELL2_DECLINE_URL = 'https://consumer.hotmart.com/';

// Downsell «O Meu Primeiro Vaso»: €4,90; checkout próprio ainda não enviado.
export const DOWNSELL_CHECKOUT_URL = '';
export const DOWNSELL_DECLINE_URL = 'https://ervasportuguesas.vercel.app/obrigado.html';
