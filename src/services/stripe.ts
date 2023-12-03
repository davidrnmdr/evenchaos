import Stripe from "stripe";

export const stripe = new Stripe(
  "sk_test_51OD7SRCc83HeQWZTYKCQyeOyux8RZMHeHWQ9klDfRdHkADAFncWC8094rYdaWqfhNP8r2NAyXnyRjFuYuG0BubSv00d75WAO04",
  {
    apiVersion: "2023-10-16",
    appInfo: {
      name: "evenehaos",
      version: "0.1.0",
    },
  }
);
