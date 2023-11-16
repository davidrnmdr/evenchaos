import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";

import styles from "./styles.module.scss";

export function SignInButton() {
  const isUserLogged = true;

  return isUserLogged ? (
    <button className={`${styles.SignInButton} ${styles.logged}`}>
      <FaGithub color="#669bbc" />
      David Aaron
      <FiX color="#ecc7b2" className={styles.closeIcon} />
    </button>
  ) : (
    <button className={styles.SignInButton}>
      <FaGithub color="#b00d16" />
      Sign in with GitHub
    </button>
  );
}
