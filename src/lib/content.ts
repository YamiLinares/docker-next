// Contenido educativo de la página. Se mantiene separado de los componentes
// para que la estructura visual y el texto se puedan revisar por separado.

export const IMAGE_NAME = "docker-next-lab";
export const CONTAINER_NAME = "docker-next-lab";
export const INTERNAL_PORT = 3000;
export const LOCAL_PORT = 3100;

export type Concept = { term: string; description: string };

export const concepts: Concept[] = [
  {
    term: "Docker",
    description:
      "Plataforma que permite empaquetar una aplicación junto con todo lo que necesita para funcionar (sistema base, runtime, dependencias y configuración) y ejecutarla de la misma forma en cualquier equipo que tenga Docker.",
  },
  {
    term: "Imagen",
    description:
      "Plantilla de solo lectura construida a partir de un Dockerfile. Está formada por capas: cada instrucción del Dockerfile agrega una capa que Docker puede reutilizar en la siguiente construcción si no cambió.",
  },
  {
    term: "Contenedor",
    description:
      "Instancia en ejecución de una imagen. Tiene su propio sistema de archivos y su propia red, pero comparte el núcleo del sistema operativo anfitrión, por eso arranca en segundos y consume menos recursos que una máquina virtual.",
  },
  {
    term: "Next.js",
    description:
      "Framework de React para aplicaciones web. Se encarga del enrutamiento, del renderizado en el servidor y de la compilación optimizada para producción. En este proyecto se usa con App Router y TypeScript.",
  },
  {
    term: "¿Por qué contenerizar?",
    description:
      "Una aplicación web depende de una versión concreta de Node.js y de muchos paquetes. Si cada persona instala todo a mano, aparecen diferencias entre equipos. Con un contenedor, el entorno queda descrito en un archivo y se reproduce siempre igual.",
  },
  {
    term: "Beneficios en el desarrollo",
    description:
      "Entorno reproducible para todo el equipo, despliegue más sencillo (la misma imagen va a pruebas y a producción), aislamiento frente a otros proyectos del equipo y la posibilidad de ejecutar varias versiones de un servicio sin conflictos.",
  },
];

export type PipelineStep = { label: string; detail: string; stage: string };

export const pipeline: PipelineStep[] = [
  { label: "Código fuente", detail: "src/, public/, configuración", stage: "Contexto de build" },
  { label: "Dependencias", detail: "npm ci con package-lock.json", stage: "Etapa deps" },
  { label: "Build de Next.js", detail: "npm run build (standalone)", stage: "Etapa builder" },
  { label: "Imagen Docker", detail: "node:24-alpine + server.js", stage: "Etapa runner" },
  { label: "Contenedor", detail: `docker run, puerto ${INTERNAL_PORT}`, stage: "Ejecución" },
  { label: "Aplicación web", detail: `localhost:${LOCAL_PORT}`, stage: "Navegador" },
];

export type BuildStage = {
  name: string;
  purpose: string;
  output: string;
};

export const buildStages: BuildStage[] = [
  {
    name: "deps",
    purpose:
      "Copia únicamente package.json y package-lock.json y ejecuta npm ci. Como estos archivos cambian poco, Docker reutiliza esta capa en la mayoría de las construcciones.",
    output: "node_modules completo, necesario para compilar.",
  },
  {
    name: "builder",
    purpose:
      "Recibe node_modules de la etapa anterior, copia el código fuente y ejecuta npm run build. Next.js genera la carpeta .next/standalone con un servidor mínimo.",
    output: ".next/standalone, .next/static y public.",
  },
  {
    name: "runner",
    purpose:
      "Parte de nuevo de node:24-alpine y copia solo los archivos compilados. No contiene el código fuente, ni las herramientas de desarrollo, ni el node_modules completo.",
    output: "Imagen final que se ejecuta con el usuario node.",
  },
];

export type Command = { title: string; command: string; description: string };

export const commands: Command[] = [
  {
    title: "Construir la imagen",
    command: `docker build -t ${IMAGE_NAME} .`,
    description:
      "Lee el Dockerfile del directorio actual, ejecuta las tres etapas y etiqueta el resultado con el nombre docker-next-lab.",
  },
  {
    title: "Ejecutar el contenedor",
    command: `docker run -d --name ${CONTAINER_NAME} -p 127.0.0.1:${LOCAL_PORT}:${INTERNAL_PORT} ${IMAGE_NAME}`,
    description: `Crea y arranca el contenedor en segundo plano. Publica el puerto interno ${INTERNAL_PORT} en el puerto ${LOCAL_PORT} del equipo, solo para localhost.`,
  },
  {
    title: "Ver contenedores activos",
    command: "docker ps",
    description:
      "Lista los contenedores en ejecución con su estado, los puertos publicados y el resultado del healthcheck.",
  },
  {
    title: "Consultar los registros",
    command: `docker logs ${CONTAINER_NAME}`,
    description:
      "Muestra la salida del servidor de Next.js. Con la opción -f los registros se siguen en tiempo real.",
  },
  {
    title: "Detener el contenedor",
    command: `docker stop ${CONTAINER_NAME}`,
    description:
      "Envía una señal de parada al proceso de Node.js. El contenedor queda detenido y se puede volver a iniciar con docker start.",
  },
];

export type Practice = { title: string; description: string; where: string };

export const practices: Practice[] = [
  {
    title: "Multi-stage build",
    description:
      "Las herramientas de compilación se quedan en etapas intermedias; la imagen final solo recibe lo necesario para ejecutar.",
    where: "Dockerfile: etapas deps, builder y runner",
  },
  {
    title: "Uso de .dockerignore",
    description:
      "Evita enviar al contexto de build node_modules, .next, .git y archivos .env. El build es más rápido y no se filtran archivos locales.",
    where: ".dockerignore",
  },
  {
    title: "Separar desarrollo y producción",
    description:
      "En desarrollo se usa npm run dev en el equipo; la imagen se construye con NODE_ENV=production y ejecuta el servidor compilado.",
    where: "Dockerfile: ENV NODE_ENV=production",
  },
  {
    title: "Imágenes oficiales",
    description:
      "Se parte de la imagen oficial de Node.js en su variante Alpine, mantenida y actualizada por el proyecto Node.js y Docker.",
    where: "Dockerfile: FROM node:24-alpine",
  },
  {
    title: "Sin secretos en la imagen",
    description:
      "Los archivos .env no se copian a la imagen. Si la aplicación necesitara credenciales, se pasarían al contenedor al ejecutarlo, no al construirlo.",
    where: ".dockerignore y .gitignore",
  },
  {
    title: "Usuario no privilegiado",
    description:
      "El proceso de Node.js se ejecuta con el usuario node que trae la imagen oficial, no como root.",
    where: "Dockerfile: USER node",
  },
  {
    title: "Imagen pequeña",
    description:
      "La salida standalone de Next.js incluye solo los módulos que el servidor usa, en lugar de todo node_modules.",
    where: "next.config.ts: output: \"standalone\"",
  },
  {
    title: "Dependencias reproducibles",
    description:
      "npm ci instala exactamente las versiones registradas en package-lock.json y falla si el lockfile no coincide con package.json.",
    where: "Dockerfile: RUN npm ci",
  },
];
