import { loadStripe } from "@stripe/stripe-js";

export async function getStripeJs() {
  // PARA PODER ACESSAR ENVS KEYS PELO BROWSER ESSA CHAVE DEVE SER PUBLICA E A UNICA MANEIA NO NEXT DE DEIXAR UMA CHAVE PUBLICA É PONDO NEXT_PUBLIC NA FRENTE DO NOME DA CHAVES
  const stripejs = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

  return stripejs;
}
