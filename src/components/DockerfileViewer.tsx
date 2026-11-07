import { readFile } from "node:fs/promises";
import path from "node:path";
import styles from "./DockerfileViewer.module.css";

// Lee el Dockerfile real del proyecto durante el build, de modo que la página
// siempre muestra exactamente el archivo con el que se construye la imagen.
async function getDockerfile() {
  "use cache";
  return readFile(path.join(process.cwd(), "Dockerfile"), "utf8");
}

export default async function DockerfileViewer() {
  const source = await getDockerfile();
  const lines = source.trimEnd().split(/\r?\n/);

  return (
    <figure className={styles.figure}>
      <figcaption className={styles.caption}>
        <code>Dockerfile</code>
        <span>{lines.length} líneas · contenido real del repositorio</span>
      </figcaption>
      <pre className={styles.code} tabIndex={0}>
        <code>
          {lines.map((line, index) => (
            <span key={index} className={lineClass(line)}>
              {line || " "}
              {"\n"}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}

function lineClass(line: string) {
  const trimmed = line.trimStart();
  if (trimmed.startsWith("#")) return styles.comment;
  if (trimmed.startsWith("FROM")) return styles.from;
  return undefined;
}
