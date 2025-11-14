import { DocsNav } from "./DocsNav";
import styles from "./DocsLayout.module.css";

export function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <DocsNav />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
