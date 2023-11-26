import { createClient } from "@prismicio/client";

export const prismic = createClient("EvenChaos", {
  accessToken: process.env.PRISMIC_ACCESS_TOKEN,
});
