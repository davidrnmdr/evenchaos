import { GetStaticPaths, GetStaticProps } from "next";
import { prismic } from "../../../services/prismic";
import { RichText } from "prismic-dom";

import { Post } from "../../../types/PostsProps";
import Head from "next/head";

import styles from "../post.module.scss";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Session } from "next-auth";

export default function PostPreview(props: {
  post: Post & { content: string };
}) {
  const session = useSession();
  const sessionData = session.data as Session & {
    activeSubscription: string | null;
  };
  const router = useRouter();

  useEffect(() => {
    if (sessionData?.activeSubscription) {
      router.push(`/posts/${props.post.slug}`);
    }
  }, [sessionData]);

  return (
    <>
      <Head>
        <title>{props.post.title} | EvenChaos</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{props.post.title}</h1>
          <time>{props.post.updatedAt}</time>
          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: props.post.content }}
          />
          <div className={styles.continueReading}>
            Want to turn conjectures into theorems?
            <Link href="/">Subscribe now ☝🤓</Link>
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const response = await prismic.getByUID("post", String(slug));

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      "en-US",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
  };

  return {
    props: { post },
  };
};
