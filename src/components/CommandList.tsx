import type { Command } from "@/lib/content";
import CopyButton from "./CopyButton";
import styles from "./CommandList.module.css";

export default function CommandList({ commands }: { commands: Command[] }) {
  return (
    <ol className={styles.list}>
      {commands.map((item) => (
        <li key={item.command} className={styles.item}>
          <div className={styles.text}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
          <div className={styles.terminal}>
            <pre>
              <code>
                <span className={styles.prompt} aria-hidden="true">
                  ${" "}
                </span>
                {item.command}
              </code>
            </pre>
            <CopyButton text={item.command} />
          </div>
        </li>
      ))}
    </ol>
  );
}
