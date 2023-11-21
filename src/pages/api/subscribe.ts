import { NextApiRequest, NextApiResponse } from "next";

import { stripe } from "../../services/stripe";

import { fauna } from "../../services/fauna";
import { query } from "faunadb";
import { FaunaUser } from "../../types/FaunaUser";
import { getSession } from "next-auth/react";

export default async function subscribe(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method == "POST") {
    const session = await getSession({ req: request });

    const user = await fauna.query<FaunaUser>(
      query.Get(
        query.Match(
          query.Index("user_by_email"),
          query.Casefold(session.user.email)
        )
      )
    );
    let customerId = user.data.stripe_customer_id;

    if (!customerId) {
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
      });

      await fauna.query(
        query.Update(query.Ref(query.Collection("users"), user.ref.id), {
          data: {
            stripe_customer_id: stripeCustomer.id,
          },
        })
      );

      customerId = stripeCustomer.id;
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [{ price: "price_1OD7W4Cc83HeQWZT04hh094B", quantity: 1 }],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });
    return response.status(200).json({ sessionId: stripeCheckoutSession.id });
  } else {
    response.setHeader("allow", ["POST"]);
    response.status(405).end("Method not allowed");
  }
}
