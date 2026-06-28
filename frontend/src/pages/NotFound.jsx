import { Link } from "react-router-dom";
import styles from "../styles/forms.module.css";

export default function NotFound() {
  return (
    <section className={styles.authShell}>
      <div className={styles.authPanel}>
        <h1>Page not found</h1>
        <p>The page you are looking for does not exist in TaskFlow.</p>
        <Link className="button" to="/">
          Go to dashboard
        </Link>
      </div>
    </section>
  );
}
