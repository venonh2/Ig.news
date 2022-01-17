import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { signIn, signOut, useSession } from "next-auth/react";

import styles from "./styles.module.scss";

export function SigninButton() {
  const { status, data } = useSession();

  if (status === "authenticated") {
    return (
      <button onClick={() => signOut()} className={styles.signInButton}>
        <FaGithub color="#84d361" />
        {data.user.name}
        <FiX color="#737388" className={styles.closeIcon} />
      </button>
    );
  }

  if (status === "unauthenticated" || status === "loading") {
    return (
      <button onClick={() => signIn("github")} className={styles.signInButton}>
        <FaGithub color="#eba417" />
        Sign in with Github
      </button>
    );
  }
}
