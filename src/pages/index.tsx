import React from "react";
import Head from "next/head";
import styles from "./home.module.scss";

export default function Home() {
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
            <span>for $5.90 month</span>
          </p>
        </section>
        <img className="ill" src="/images/illustration.svg" alt="" />
      </main>
    </>
  );
}
