import styles from "./styles.module.scss";
import Image from "next/image";
import { SigninButton } from "../SigninButton";

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
          <a href="" className={styles.active}>
            Home
          </a>
          <a href="">Posts</a>
        </nav>
        <SigninButton />
      </div>
    </header>
  );
}
