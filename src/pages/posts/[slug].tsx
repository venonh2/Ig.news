import { PrismicRichText } from "@prismicio/react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { RichText } from "prismic-reactjs";
import { createPrismicClient } from "../../services/prismic";

import styles from "./post.module.scss";

interface PostProps {
  post: {
    slug: string;
    title: string;
    content: [];
    updatedAt: string;
  };
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div className={styles.postContent}>
            <PrismicRichText field={post.content} />
          </div>
        </article>
      </main>
    </>
  );
}

// [] toda vez que o usuário acessa a página o conteúdo é feito downloads
export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const session = await getSession({ req });

  const { slug } = params;

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: `/posts/preview/${slug}`,
        permanent: false,
      },
    };
  }

  const prismic = createPrismicClient(req);

  const response = await prismic.getByUID("react-posts", String(slug));

  const post = {
    slug: String(slug),
    title: RichText.asText(response.data.Title),
    content: response.data.Content, // [] aqui
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
  };

  return { props: { post: post } };
};
