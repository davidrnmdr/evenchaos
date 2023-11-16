import React from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import styles from "./home.module.scss";
import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe";
import { HomeProps } from "../types/HomeProps";

export default function Home(props: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | EvenChaos</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>🖐 Greetings, partner</span>
          <h1>
            Doing <span>Math</span> to rule the chaos.
          </h1>
          <p>
            Get access to all the publications <br />
            <span>for {props.product.amount} month</span>
          </p>
          <SubscribeButton />
        </section>
        <img className="ill" src="/images/illustration.svg" alt="" />
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const price = await stripe.prices.retrieve("price_1OD7W4Cc83HeQWZT04hh094B", {
    expand: ["product"],
  });

  const product = {
    priceId: price.id,
    amount: price.unit_amount / 100,
  };

  return {
    props: {
      product,
    },
  };
};
