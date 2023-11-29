import {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { prismic } from "../../services/prismic";
import { RichText } from "prismic-dom";

import { Post } from "../../types/PostsProps";
import Head from "next/head";

import styles from "./post.module.scss";

export default function Post(props: { post: Post & { content: string } }) {
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
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: props.post.content }}
          />
        </article>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
}) => {
  const { slug } = params;
  const session = (await auth(req, res)) as Session & {
    activeSubscription: string | null;
  };

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: `/posts/preview/${slug}`,
        permanent: false,
      },
    };
  }

  const response = await prismic.getByUID("post", String(slug));

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content),
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

export async function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return await getServerSession(...args, authOptions);
}
