import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { createPrismicClient } from "../../services/prismic";
import { Post } from "../../types/Post";

import styles from "./styles.module.scss";

type PostsProps = {
  posts: Post[];
};

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/posts/${post.slug}`}>
              <a>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.content}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (req) => {
  const prismic = createPrismicClient(req);

  const response = await prismic.getByType("react-posts", { pageSize: 100 });

  function formatContent(content) {
    return content
      .find((item) => item.type === "paragraph")
      .text.slice(0, 200)
      .concat("...");
  }

  function formatTitle(title) {
    return title.find((item) => item.type === "heading1").text;
  }

  const posts: Post[] = response.results.map((post) => {
    return {
      slug: post.uid,
      title: formatTitle(post.data.Title),
      content: formatContent(post.data.Content),
      updatedAt: new Date(post.last_publication_date).toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      ),
    };
  });

  return {
    props: {
      posts: posts,
    },
  };
};
