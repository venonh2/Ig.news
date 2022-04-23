import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import Link from "next/link";

import { PrismicProvider } from "@prismicio/react";
import { PrismicPreview } from "@prismicio/next";
import { linkResolver, repositoryName } from "../services/prismic";

import Header from "../Components/Header";

import "react-toastify/dist/ReactToastify.css";

import "../styles/global.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PrismicProvider
      linkResolver={linkResolver}
      internalLinkComponent={({ href, children, ...props }) => (
        <Link href={href}>
          <a {...props}>{children}</a>
        </Link>
      )}
    >
      <SessionProvider session={pageProps.session}>
        <Header />
        <Component {...pageProps} />
        <ToastContainer />
      </SessionProvider>
    </PrismicProvider>
  );
}

export default MyApp;
