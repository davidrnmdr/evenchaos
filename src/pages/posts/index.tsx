import Head from "next/head";
import style from "./styles.module.scss";
import { GetStaticProps } from "next";
import { prismic } from "../../services/prismic";
import Prismic from "@prismicio/client";
import { RichText } from "prismic-dom";

import { PostsProps } from "../../types/PostsProps";
import Link from "next/link";

export default function Posts(props: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | EvenChaos</title>
      </Head>

      <main className={style.container}>
        <div className={style.posts}>
          {props.posts.map((post) => (
            <Link key={post.slug} href={`/posts/${post.slug}`}>
              <time>{post.updatedAt}</time>
              <strong>{post.title}</strong>
              <p>{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await prismic.getAllByType("post", {
    fetch: ["post.title", "post.content"],
    pageSize: 100,
  });

  const posts = response.map((response) => {
    return {
      slug: response.uid,
      title: RichText.asText(response.data.title),
      excerpt:
        response.data.content.find((content) => content.type == "paragraph")
          ?.text ?? "",
      updatedAt: new Date(response.last_publication_date).toLocaleDateString(
        "en-US",
        { day: "2-digit", month: "long", year: "numeric" }
      ),
    };
  });

  return {
    props: { posts },
  };
};
