import { signIn, useSession } from "next-auth/react";
import { API } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import { toast } from "react-toastify";

import styles from "./styles.module.scss";
import { useRouter } from "next/router";

type SubscribeButtonProps = {
  priceId: string;
};

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { status, data } = useSession();
  const router = useRouter();

  async function handleSubscribe() {
    try {
      if (status === "unauthenticated") {
        signIn("github");
        return;
      }

      console.log(data);

      if (data.activeSubscription) {
        router.push("/posts");
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
