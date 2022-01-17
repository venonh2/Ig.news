import { signIn, useSession } from "next-auth/react";
import { API } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import { toast } from "react-toastify";

import styles from "./styles.module.scss";

type SubscribeButtonProps = {
  priceId: string;
};

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { status } = useSession();

  async function handleSubscribe() {
    try {
      if (status === "unauthenticated") {
        signIn("github");
        return;
      }

      const response = await API.post("/subscribe");

      const { sessionId } = response.data;

      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      toast(err.message, { type: "error" });
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}
