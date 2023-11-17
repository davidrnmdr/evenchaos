import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { SessionContext, signIn, signOut, useSession } from "next-auth/react";

import styles from "./styles.module.scss";
import { useContext } from "react";

export function SignInButton() {
  const session = useSession();

  return session.data ? (
    <button
      onClick={() => signOut()}
      className={`${styles.SignInButton} ${styles.logged}`}
    >
      <FaGithub color="#669bbc" />
      {session.data.user.name}
      <FiX color="#ecc7b2" className={styles.closeIcon} />
    </button>
  ) : (
    <button className={styles.SignInButton} onClick={() => signIn("github")}>
      <FaGithub color="#b00d16" />
      Sign in with GitHub
    </button>
  );
}
