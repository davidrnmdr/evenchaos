# EvenChaos can be ruled

[Visit Us!](https://evenchaos.vercel.app/)&nbsp;
Exploring the antithetical relationship between the chaos that permeates almost everything and the math impetus of getting things evened by formalizing patterns, we bring EvenChaos!

We are a newsletter about mathematics with the objective of explain concepts, thoughts and some reflections about the many facets of math.

## Technologies

### 💻 NextJS

Next was used to implement Server Side Rendering, Incremental Static Regeneration, API and Dynamic Routes.

### 🔒 NextAuth

To implement the authentication with GitHub NextAuth was used.

### 🗄 FaunaDB

As database, we've used FaunaDB.

### 💵 Stripe

Stripe was chosen as the payment solution.

### ✏ Prismic CMS

Our Content Management System is Prismic.

## Features

### Homepage

Here the user can go to the post listing page, sign in with GitHub and subscribe.
![Home](https://github.com/davidrnmdr/bankrupt/blob/main/src/assets/prints/main-screen.jpg)

After sign in, we have this:
![Home after Sign In](https://github.com/davidrnmdr/bankrupt/blob/main/src/assets/prints/main-screen.jpg)

Now we can make a subscription. After Clicking on "Subscribe now" we will be redirected to a (test) Stripe checkout:
![Stripe Checkout](https://github.com/davidrnmdr/bankrupt/blob/main/src/assets/prints/main-screen.jpg)

On the checkout completion, we will be redirected to the posts:
![Stripe Checkout](https://github.com/davidrnmdr/bankrupt/blob/main/src/assets/prints/main-screen.jpg)

It is also possible to see a preview without having an active subscription (or without sign in):
![Post Preview](https://github.com/davidrnmdr/bankrupt/blob/main/src/assets/prints/main-screen.jpg)
