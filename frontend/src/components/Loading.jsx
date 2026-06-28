import styles from "../styles/components.module.css";

export default function Loading({ label = "Loading" }) {
  return (
    <div className={styles.loadingWrap} role="status" aria-live="polite">
      <span className={styles.spinner} />
      <span>{label}</span>
    </div>
  );
}
