import { Readable } from "stream";
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";

import bodyParser from "body-parser";
import express from "express";

async function buffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk == "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

const app = express();
app.use(bodyParser.json());

export const config = {
  api: {
    bodyParser: true,
  },
};

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.deleted",
  "customer.subscription.updated",
]);

app.post(
  "/api/express-webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const buf = await buffer(req);
    const secret = req.headers["stripe-signature"];

    let event: Stripe.Event;

    try {
      try {
        event = stripe.webhooks.constructEvent(
          buf,
          secret,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch {
        throw new Error("failed event construction");
      }
    } catch (e) {
      console.log(e.message);
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
            const checkoutSession = event.data
              .object as Stripe.Checkout.Session;

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
  }
);

app.listen(4242, () => {
  console.log("Running on port 4242");
});
