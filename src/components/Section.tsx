import type { ReactNode } from "react";
import styles from "./Section.module.css";

type SectionProps = {
  id: string;
  number: string;
  title: string;
  intro?: string;
  children: ReactNode;
};

export default function Section({ id, number, title, intro, children }: SectionProps) {
  const headingId = `${id}-titulo`;

  return (
    <section id={id} aria-labelledby={headingId} className={styles.section}>
      <div className="container">
        <header className={styles.header}>
          <span className={styles.number} aria-hidden="true">
            {number}
          </span>
          <h2 id={headingId}>{title}</h2>
          {intro && <p className={styles.intro}>{intro}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}
