import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";

async function buffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk == "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

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

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "POST") {
    const buf = await buffer(req);

    const secret = req.headers["stripe-signature"];

    let event: Stripe.Event;

    try {
      console.log(`maybe will log the event`);
      event = await stripe.webhooks.constructEventAsync(
        buf,
        buf,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      console.log(`this is the event ${event}`);
    } catch (e) {
      res.status(400).send(`Webhook error: ${e.message}`);
    }

    const type = (await event).type;

    if (relevantEvents.has(type)) {
      try {
        switch (type) {
          case "customer.subscription.updated":
          case "customer.subscription.deleted":
            const subscription = (await event).data
              .object as Stripe.Subscription;

            await saveSubscription(
              subscription.id,
              subscription.customer.toString(),
              false
            );

            break;

          case "checkout.session.completed":
            const checkoutSession = (await event).data
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
  } else {
    res.setHeader("allow", ["POST"]);
    res.status(405).end("Method not allowed");
  }
};
