// Upsell comum aos planos Básico e PRO. Não reutilizar os checkouts dos planos.
// Vazio mantém o botão de compra desativado. Configurar o checkout próprio de €9,50.
export const UPSELL1_CHECKOUT_URL = '';

// Enquanto as próximas etapas não existem, a recusa permite abrir o plano comprado.
export const UPSELL1_DECLINE_URL = 'https://ervasportuguesas.vercel.app/obrigado.html';
