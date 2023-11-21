import { signIn, useSession } from "next-auth/react";
import styles from "./styles.module.scss";

import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";

export function SubscribeButton() {
  const session = useSession();

  async function handleSubscription() {
    if (!session.data) {
      signIn("github");
      return;
    }

    try {
      const response = await api.post("/subscribe");

      const { sessionId } = response.data;

      const stripe = await getStripeJs();

      stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscription}
    >
      Subscribe now
    </button>
  );
}
