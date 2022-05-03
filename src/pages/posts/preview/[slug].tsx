import { GetStaticPaths, GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { RichText } from "prismic-reactjs";
import { useEffect } from "react";
import { createPrismicClient } from "../../../services/prismic";

import styles from "../post.module.scss";

interface PostPreviewProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  };
}

export default function PostPreview({ post }: PostPreviewProps) {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.data?.activeSubscription) {
      router.push(`/posts/${post.slug}`);
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div className={`${styles.postContent} ${styles.previewContent}`}>
            <p>{post.content}</p>
          </div>

          <div className={styles.continueReading}>
            Wanna continue reading ?
            <Link href="/">
              <a href="">Subcribe now 😊😊</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}

// existe mais de uma maneira de eu gerar minhas páginas estaticas

export const getStaticPaths: GetStaticPaths = () => {
  // aqui eu poderia pegar os posts mais vistos
  // e gerar os slugs estaticos em tempo de build
  // paths: [{params: {slug: 'introducaoddddddvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv'}}],
  // isso aconteçe no yarn build dai

  return {
    paths: [],
    fallback: "blocking", // true, false , blocking
    // o fallback dita a regra de como o conteudo do post deve ser gerado
    // se eu passar true, ele faz client side rendering
    // false, se o post n tiver sido gerado de maneira estatica ainda ele me devolve um 404
    // o blocking, faz com que ele baixe no lado do servidor o conteudo
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = createPrismicClient();

  const response = await prismic.getByUID("react-posts", String(slug));

  const post = {
    slug: String(slug),
    title: RichText.asText(response.data.Title),
    content: response.data.Content[0].text.substring(0, 400), // [] aqui
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
  };

  return { props: { post: post }, revalidate: 60 * 30 };
};
