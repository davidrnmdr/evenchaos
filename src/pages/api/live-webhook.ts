import { Readable } from "stream";
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";

import express from "express";

const app = express();

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.deleted",
  "customer.subscription.updated",
]);

app.post("/api/live-webhook", async (req, res) => {
  let event: Stripe.Event;

  try {
    event = req.body;
  } catch (e) {
    res.status(400).send(`Webhook error: ${e.message}`);
    return;
  }

  const { type } = event;

  if (relevantEvents.has(type)) {
    try {
      switch (type) {
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          const subscription = event.data.object as Stripe.Subscription;

          await saveSubscription(
            subscription.id,
            subscription.customer.toString(),
            false
          );

          break;

        case "checkout.session.completed":
          const checkoutSession = event.data.object as Stripe.Checkout.Session;

          saveSubscription(
            checkoutSession.subscription.toString(),
            checkoutSession.customer.toString(),
            true
          );
          break;
        default:
          throw new Error("Unhandled event.");
      }
    } catch (e) {
      return res.json({ error: "Webhook failed to handle event." });
    }
  }

  res.status(200).json({ ok: true });
});
