import styles from "./styles.module.scss";
import Image from "next/image";

export default function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Image
          src="/images/logo.svg"
          alt="ig.news logo"
          //layout="fill"
          width={42}
          height={42}
        />
        <nav>
          <a href="" className={styles.active}>
            Home
          </a>
          <a href="">Posts</a>
        </nav>
      </div>
    </header>
  );
}
