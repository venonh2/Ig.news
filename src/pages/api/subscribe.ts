import { query as q } from "faunadb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { fauna } from "../../services/fauna";
import { stripe } from "../../services/stripe";

type User = {
  ref: {
    id: string;
  };
  data: {
    stripe_custumer_id: string;
  };
};

export default async function subscribe(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      const session = await getSession({ req }); // como o stripe precisa saber que é o user, que esta assinando aquele plano eu crio na api do strip um usuario antes de assinar aquele plano, veja algo interessante aqui estou lidando com o back end de minha aplicação então como saber quem é o usuario ja que ele esta no front-end ?, o next guarda as informacoes de usuario nos cookies da aplicacao e o cookies podem ser acessados pelo backend da aplicacao porque o front e o back estao no mesmo dominio, o famoso same-site, entao com isso basta utilizar o metodo que o next forneçe para acessar as informacoes desse usuario

      const user = await fauna.query<User>(
        q.Get(q.Match(q.Index("user_by_email"), q.Casefold(session.user.email)))
      );

      let customerId = user.data.stripe_custumer_id;

      if (!customerId) {
        const stripeCostumer = await stripe.customers.create({
          email: session.user.email,
          //metadata:
        });

        await fauna.query(
          q.Update(q.Ref(q.Collection("users"), user.ref.id), {
            data: {
              stripe_custumer_id: stripeCostumer.id,
            },
          })
        );

        customerId = stripeCostumer.id;
      }

      const stripeCheckoutSession = await stripe.checkout.sessions.create({
        customer: customerId, // quem esta comprando o produto
        payment_method_types: ["card"],
        billing_address_collection: "required", // obrigar ou não o usuario a preencher o endereco
        line_items: [{ price: "price_1KEijUEwdaxUUn8QBEmzC47y", quantity: 1 }],
        mode: "subscription", // falando que o tipo e de subscription
        allow_promotion_codes: true, // permite codigos promocias, cupom de desconto
        success_url: process.env.STRIPE_SUCCESS_URL,
        cancel_url: process.env.STRIPE_CANCEL_URL,
      });

      return res.status(200).json({ sessionId: stripeCheckoutSession.id });
    } else {
      res.setHeader("Allow", "POST");
      return res.status(405).end("Method not allowed");
    }
  } catch {
    return res.status(502);
  }
}
