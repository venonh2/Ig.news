import styles from "./styles.module.scss";
import Image from "next/image";
import { SigninButton } from "../SigninButton";
import { ActiveLink } from "../ActiveLink";

export default function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Image
          src="/images/logo.svg"
          alt="ig.news logo"
          //layout="fill"
          width={62}
          height={62}
        />
        <nav>
          <ActiveLink href="/" activeClassName={styles.active}>
            <a>Home</a>
          </ActiveLink>
          <ActiveLink href="/posts" prefetch activeClassName={styles.active}>
            <a>Posts</a>
          </ActiveLink>
        </nav>
        <SigninButton />
      </div>
    </header>
  );
}
