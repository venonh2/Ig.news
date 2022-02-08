import { query as q } from "faunadb";
import { fauna } from "../../../services/fauna";
import { stripe } from "../../../services/stripe";

export async function saveSubscription(
  subscriptionId: string,
  custumerId: string,
  isCreateAction: boolean
) {
  const userRef = await fauna.query(
    q.Select(
      "ref",
      q.Get(q.Match(q.Index("user_by_stripe_custumer_id"), custumerId))
    )
  );

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
  };

  console.log("sub: ", subscriptionData);

  if (isCreateAction) {
    await fauna.query(
      /*   q.If(
        q.Exists(q.Match(q.Index("subscription_by_id", subscriptionId))),
        q.Replace(
          q.Select(
            "ref",
            q.Get(q.Match(q.Index("subscription_by_id"), subscriptionId))
          ),
          { data: subscriptionData }
        ), */
      q.Create(q.Collection("subscriptions"), { data: subscriptionData })
    );
    /*   ); */
  } else {
    await fauna.query(
      q.Replace(
        q.Select(
          "ref",
          q.Get(q.Match(q.Index("subscription_by_id"), subscriptionId))
        ),
        { data: subscriptionData }
      )
    );
  }
}
