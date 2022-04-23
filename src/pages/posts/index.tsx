import { GetStaticProps } from "next";
import Head from "next/head";
import { createClient } from "../../services/prismic";

import styles from "./styles.module.scss";

type Posts = {
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
};

type PostsProps = {
  posts: Posts[];
};

export default function Posts({ posts }: PostsProps) {
  console.log(posts);
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <a key={post.slug} href="">
              <time>{post.updatedAt}</time>
              <strong>{post.title}</strong>
              <p>{post.content}</p>
            </a>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (req) => {
  const prismic = createClient(req);

  const response = await prismic.getByType("react-posts", { pageSize: 100 });

  const posts: Posts[] = response.results.map((post) => {
    return {
      slug: post.uid,
      title: post.data.Title[0].text ?? "",
      content: post.data.Content[0].text ?? "",
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
