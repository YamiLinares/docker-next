import CommandList from "@/components/CommandList";
import DockerfileViewer from "@/components/DockerfileViewer";
import PipelineDiagram from "@/components/PipelineDiagram";
import Section from "@/components/Section";
import {
  INTERNAL_PORT,
  LOCAL_PORT,
  buildStages,
  commands,
  concepts,
  pipeline,
  practices,
} from "@/lib/content";
import styles from "./page.module.css";

const facts = [
  { label: "Imagen base", value: "node:24-alpine" },
  { label: "Salida de Next.js", value: "standalone" },
  { label: "Puerto interno", value: String(INTERNAL_PORT) },
  { label: "Usuario", value: "node (no root)" },
];

export default function Home() {
  return (
    <main id="contenido">
      <section id="inicio" className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div>
            <p className={styles.kicker}>Actividad práctica · Contenerización</p>
            <h1>Contenerizar una aplicación Next.js con Docker</h1>
            <p className={styles.lead}>
              Esta página es, a la vez, la explicación y el ejemplo: se construye con el
              Dockerfile que aparece más abajo y se está sirviendo desde un contenedor. Recorre
              los conceptos básicos, el flujo de construcción, las etapas de la imagen y los
              comandos para ejecutarla.
            </p>
          </div>
          <dl className={styles.facts}>
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>
                  <code>{fact.value}</code>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Section
        id="conceptos"
        number="01"
        title="Conceptos básicos"
        intro="Antes de escribir el Dockerfile conviene tener claros los términos que se usan en el resto de la guía."
      >
        <dl className={styles.concepts}>
          {concepts.map((concept) => (
            <div key={concept.term} className={styles.concept}>
              <dt>{concept.term}</dt>
              <dd>{concept.description}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section
        id="arquitectura"
        number="02"
        title="Del código fuente al navegador"
        intro="Cada paso produce el insumo del siguiente. Los tres pasos centrales ocurren dentro de docker build; los dos últimos, al ejecutar el contenedor."
      >
        <PipelineDiagram steps={pipeline} />
      </Section>

      <Section
        id="dockerfile"
        number="03"
        title="El Dockerfile y el build multi-stage"
        intro="Un multi-stage build divide la construcción en etapas. Cada etapa empieza desde una imagen base y puede copiar archivos de una etapa anterior; solo la última forma parte de la imagen final."
      >
        <div className={styles.dockerLayout}>
          <div className={styles.stages}>
            {buildStages.map((stage, index) => (
              <article key={stage.name} className={styles.stage}>
                <h3>
                  <span className={styles.stageIndex}>Etapa {index + 1}</span>
                  <code>{stage.name}</code>
                </h3>
                <p>{stage.purpose}</p>
                <p className={styles.stageOutput}>
                  <strong>Resultado:</strong> {stage.output}
                </p>
              </article>
            ))}
            <dl className={styles.runtime}>
              <div>
                <dt>Puerto</dt>
                <dd>
                  <code>EXPOSE {INTERNAL_PORT}</code> documenta el puerto; se publica con{" "}
                  <code>-p</code> al ejecutar.
                </dd>
              </div>
              <div>
                <dt>Host</dt>
                <dd>
                  <code>HOSTNAME=0.0.0.0</code> hace que el servidor acepte conexiones que
                  llegan desde fuera del contenedor.
                </dd>
              </div>
              <div>
                <dt>Inicio</dt>
                <dd>
                  <code>CMD [&quot;node&quot;, &quot;server.js&quot;]</code> arranca el servidor
                  generado por la salida standalone.
                </dd>
              </div>
            </dl>
          </div>
          <DockerfileViewer />
        </div>
      </Section>

      <Section
        id="comandos"
        number="04"
        title="Comandos principales"
        intro={`Se ejecutan desde la raíz del proyecto. El puerto local ${LOCAL_PORT} se puede cambiar por cualquier otro que esté libre; el interno sigue siendo ${INTERNAL_PORT}.`}
      >
        <CommandList commands={commands} />
      </Section>

      <Section
        id="buenas-practicas"
        number="05"
        title="Buenas prácticas aplicadas"
        intro="Cada práctica indica en qué parte del proyecto se puede comprobar."
      >
        <ol className={styles.practices}>
          {practices.map((practice) => (
            <li key={practice.title}>
              <h3>{practice.title}</h3>
              <p>{practice.description}</p>
              <p className={styles.where}>
                <code>{practice.where}</code>
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <footer className={styles.footer}>
        <div className={`container ${styles.footerInner}`}>
          <p>Docker Next Lab · Proyecto académico de Yami Linares</p>
          <p>
            Estado del servidor: <a href="/api/health">/api/health</a>
          </p>
        </div>
      </footer>
    </main>
  );
}
