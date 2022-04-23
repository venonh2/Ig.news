import { GetStaticProps } from "next";
import Head from "next/head";
import { createClient } from "../../services/prismic";

import styles from "./styles.module.scss";

export default function Posts() {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="">
            <time>12 de augusto</time>
            <strong>Criando Sempre Inovações na área</strong>
            <p>
              Vem comigo vamos aprender a organizar e desestruturar novas
              carreiras
            </p>
          </a>
          <a href="">
            <time>12 de augusto</time>
            <strong>Criando Sempre Inovações na área</strong>
            <p>
              Vem comigo vamos aprender a organizar e desestruturar novas
              carreiras
            </p>
          </a>
          <a href="">
            <time>12 de augusto</time>
            <strong>Criando Sempre Inovações na área</strong>
            <p>
              Vem comigo vamos aprender a organizar e desestruturar novas
              carreiras
            </p>
          </a>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (req) => {
  const prismic = createClient(req);

  const response = await prismic.getAllByType("Posts");

  console.log("aaaa", response);

  return {
    props: {
      posts: response,
    },
  };
};
