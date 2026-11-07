import type { PipelineStep } from "@/lib/content";
import styles from "./PipelineDiagram.module.css";

export default function PipelineDiagram({ steps }: { steps: PipelineStep[] }) {
  return (
    <ol className={styles.pipeline} aria-label="Flujo desde el código fuente hasta la aplicación web">
      {steps.map((step, index) => (
        <li key={step.label} className={styles.step}>
          <span className={styles.stage}>{step.stage}</span>
          <div className={styles.box}>
            <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
            <strong>{step.label}</strong>
            <code>{step.detail}</code>
          </div>
        </li>
      ))}
    </ol>
  );
}
