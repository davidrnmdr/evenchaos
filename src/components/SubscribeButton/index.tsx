import { signIn, useSession } from "next-auth/react";
import styles from "./styles.module.scss";

import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import { Session } from "next-auth";
import { useRouter } from "next/router";

export function SubscribeButton() {
  const router = useRouter();
  const session = useSession();
  const sessionData = session.data as Session & {
    activeSubscription: string | null;
  };
  async function handleSubscription() {
    if (!session.data) {
      signIn("github");
      return;
    }

    if (sessionData.activeSubscription) {
      router.push("/posts");
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
