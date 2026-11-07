# Docker Next Lab

Aplicación web educativa construida con Next.js y empaquetada en una imagen Docker de producción. La propia aplicación explica el proceso de contenerización que se usó para desplegarla: conceptos básicos, flujo de construcción, etapas del Dockerfile, comandos y buenas prácticas.

## Objetivo académico

Poner en práctica la contenerización de una aplicación Next.js: crear el proyecto desde cero con `create-next-app`, escribir un Dockerfile multi-stage basado en una imagen oficial de Node.js, excluir del contexto de construcción los archivos innecesarios o sensibles mediante `.dockerignore`, construir la imagen, ejecutar el contenedor y documentar el procedimiento para que pueda reproducirse en otro equipo.

## Tecnologías utilizadas

| Tecnología | Versión | Uso |
| --- | --- | --- |
| Next.js | 16.4.5 | Framework de la aplicación (App Router, salida `standalone`) |
| React | 19.3.0 | Interfaz de usuario |
| TypeScript | 5 | Tipado estático |
| ESLint | 9 (`eslint-config-next`) | Análisis estático del código |
| CSS Modules | — | Estilos por componente, sin librerías adicionales |
| Node.js | 24 (imagen `node:24-alpine`) | Entorno de ejecución dentro del contenedor |
| Docker | Engine 29 | Construcción y ejecución de la imagen |

### Sobre la versión de Node.js

La actividad sugiere `node:18-alpine`, pero Next.js 16 exige Node.js 20.9 o superior (`"engines": { "node": ">=20.9.0" }`), y Node.js 18 ya no recibe actualizaciones de seguridad. Por eso se usa `node:24-alpine`, la versión LTS vigente, que es compatible con Next.js 16 y mantiene la variante Alpine propuesta en la actividad.

## Funcionalidades

- **Conceptos básicos:** definiciones de Docker, imagen, contenedor y Next.js, y por qué conviene contenerizar una aplicación web.
- **Diagrama de arquitectura:** flujo Código fuente → Dependencias → Build de Next.js → Imagen Docker → Contenedor → Aplicación web, hecho solo con HTML y CSS.
- **Dockerfile comentado:** explicación de las tres etapas del build y visor del `Dockerfile` real del repositorio, que se lee durante la compilación. Lo que muestra la página coincide siempre con el archivo que construye la imagen.
- **Comandos:** `docker build`, `docker run`, `docker ps`, `docker logs` y `docker stop`, cada uno con su explicación y un botón para copiarlo.
- **Buenas prácticas:** cada práctica indica en qué archivo del proyecto se aplica.
- **Endpoint de estado:** `GET /api/health` responde con un JSON (`status`, versión de Node.js, tiempo activo). Lo usa el `HEALTHCHECK` del Dockerfile.
- Diseño adaptable a móvil, modo claro y oscuro según el sistema, navegación por anclas y enlace para saltar al contenido.

## Requisitos previos

- **Docker:** Docker Desktop en Windows o macOS, o Docker Engine en Linux. Debe estar iniciado antes de ejecutar los comandos.
- **Git:** solo para clonar el repositorio. También se puede descargar como ZIP desde GitHub.

No hace falta instalar Node.js ni npm en el equipo: la instalación de dependencias y la compilación ocurren dentro de Docker.

## Estructura del proyecto

```text
docker-next/
├── public/
│   └── logo.svg                 # Logotipo del encabezado
├── src/
│   ├── app/
│   │   ├── api/health/route.ts  # Endpoint de estado para el healthcheck
│   │   ├── globals.css          # Variables de color, tipografía y estilos base
│   │   ├── icon.svg             # Icono de la pestaña del navegador
│   │   ├── layout.tsx           # Estructura HTML común y metadatos
│   │   ├── page.module.css
│   │   └── page.tsx             # Página principal con todas las secciones
│   ├── components/
│   │   ├── CommandList.tsx      # Lista de comandos Docker
│   │   ├── CopyButton.tsx       # Botón de copiar (componente de cliente)
│   │   ├── DockerfileViewer.tsx # Muestra el Dockerfile real del repositorio
│   │   ├── PipelineDiagram.tsx  # Diagrama del flujo de construcción
│   │   ├── Section.tsx          # Contenedor reutilizable de cada sección
│   │   └── SiteHeader.tsx       # Encabezado y navegación
│   └── lib/
│       └── content.ts           # Textos, comandos y datos de la página
├── .dockerignore
├── .gitattributes
├── .gitignore
├── Dockerfile
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── package-lock.json
└── tsconfig.json
```

Cada componente tiene su propio archivo `.module.css` junto al `.tsx`. Se omiten en el árbol para abreviar.

## Instalación

```bash
git clone https://github.com/YamiLinares/docker-next.git
cd docker-next
```

## Construcción de la imagen

Desde la raíz del proyecto:

```bash
docker build -t docker-next-lab .
```

La primera construcción descarga la imagen `node:24-alpine` y las dependencias de npm, por lo que puede tardar algunos minutos. Las siguientes reutilizan la caché de Docker.

Para comprobar que la imagen existe:

```bash
docker images docker-next-lab
```

## Ejecución

```bash
docker run -d --name docker-next-lab -p 127.0.0.1:3100:3000 docker-next-lab
```

| Parte | Significado |
| --- | --- |
| `-d` | Ejecuta el contenedor en segundo plano |
| `--name docker-next-lab` | Nombre para referirse al contenedor en los demás comandos |
| `-p 127.0.0.1:3100:3000` | Publica el puerto interno `3000` en el puerto `3100` del equipo, accesible solo desde el propio equipo |

Después se abre en el navegador: **http://localhost:3100**

### Elegir otro puerto local

El puerto interno de Next.js es siempre `3000`. El local (`3100`) se puede cambiar por cualquier otro que esté libre. Para revisar si un puerto está ocupado:

```powershell
# Windows (PowerShell). Si no muestra nada, el puerto está libre.
Get-NetTCPConnection -LocalPort 3100 -State Listen -ErrorAction SilentlyContinue
```

```bash
# Linux o macOS
lsof -i :3100
```

Por ejemplo, para usar el puerto 4000:

```bash
docker run -d --name docker-next-lab -p 127.0.0.1:4000:3000 docker-next-lab
```

## Verificación

| Acción | Comando |
| --- | --- |
| Ver si el contenedor está activo y su estado de salud | `docker ps --filter name=docker-next-lab` |
| Consultar los registros | `docker logs docker-next-lab` |
| Seguir los registros en tiempo real | `docker logs -f docker-next-lab` |
| Comprobar el endpoint de estado | `curl http://localhost:3100/api/health` |
| Detener el contenedor | `docker stop docker-next-lab` |
| Volver a iniciarlo | `docker start docker-next-lab` |
| Eliminarlo (por ejemplo, para recrearlo con otro puerto) | `docker rm -f docker-next-lab` |

Cuando el contenedor funciona correctamente, `docker ps` muestra `Up ... (healthy)` en la columna de estado, y los registros terminan con:

```text
▲ Next.js 16.4.5
- Local:         http://localhost:3000
- Network:       http://0.0.0.0:3000
✓ Ready in 0ms
```

La dirección `localhost:3000` de los registros es la interna del contenedor. Desde el navegador se usa el puerto publicado (`3100`).

### Reconstruir después de un cambio

```bash
docker rm -f docker-next-lab
docker build -t docker-next-lab .
docker run -d --name docker-next-lab -p 127.0.0.1:3100:3000 docker-next-lab
```

## Dockerfile

El [Dockerfile](Dockerfile) usa un **multi-stage build** de tres etapas. Las tres parten de la imagen oficial `node:24-alpine`:

1. **`deps`: instalación de dependencias.** Copia solo `package.json` y `package-lock.json` y ejecuta `npm ci`. Como el código fuente todavía no se ha copiado, esta capa queda en caché y solo se repite cuando cambian las dependencias.
2. **`builder`: compilación.** Toma el `node_modules` de la etapa anterior, copia el código y ejecuta `npm run build`. Con `output: "standalone"` en `next.config.ts`, Next.js genera `.next/standalone`: un `server.js` mínimo junto con únicamente los módulos que el servidor necesita.
3. **`runner`: imagen final.** Parte otra vez de `node:24-alpine` y copia solo tres cosas: `.next/standalone`, `.next/static` y `public`. Estas dos últimas se copian aparte porque la salida standalone no las incluye. El código fuente, las herramientas de desarrollo y el `node_modules` completo se quedan en las etapas anteriores y no forman parte de la imagen.

Configuración de la imagen final:

- `NODE_ENV=production` y `NEXT_TELEMETRY_DISABLED=1`.
- `PORT=3000` y `HOSTNAME=0.0.0.0`: el servidor escucha en todas las interfaces del contenedor. Sin esto no aceptaría las conexiones que llegan por el puerto publicado.
- `USER node`: el proceso se ejecuta con el usuario sin privilegios que trae la imagen oficial, no como `root`.
- `EXPOSE 3000`: documenta el puerto interno.
- `HEALTHCHECK`: cada 30 segundos consulta `/api/health` con el `fetch` nativo de Node.js, sin instalar `curl` ni `wget`.
- `CMD ["node", "server.js"]`: arranca directamente el servidor de producción generado por Next.js.

La imagen resultante ocupa unos **75 MB comprimida** (299 MB en disco). De ese total, las capas propias de la aplicación suman unos 43 MB; el resto corresponde a la imagen base de Node.js.

## .dockerignore

El archivo [.dockerignore](.dockerignore) define qué archivos no se envían a Docker como contexto de construcción:

- **`node_modules`, `.next`, `out`, `build`:** son dependencias y compilaciones del equipo local. La imagen instala y compila las suyas. Además, si se copiaran se sobrescribiría el resultado de `npm ci` con módulos compilados para otro sistema operativo.
- **`.git`:** el historial no se necesita para compilar y aumentaría mucho el contexto.
- **`.env` y `.env.*`, `*.pem`:** evitan que variables de entorno o claves terminen dentro de una capa de la imagen.
- **Registros, temporales y archivos de editor** (`*.log`, `.vscode`, `.idea`, `.DS_Store`…): no aportan nada al build.
- **`README.md`, `AGENTS.md`:** documentación que no interviene en la compilación.

El `Dockerfile` **no** se excluye, porque la página lo lee durante el build para mostrarlo en la sección correspondiente.

## Buenas prácticas aplicadas

- **Imagen oficial y versión LTS:** `node:24-alpine`, una base pequeña y mantenida.
- **Multi-stage build:** las herramientas de compilación no llegan a la imagen final.
- **Caché de capas:** los manifiestos de npm se copian antes que el código.
- **Dependencias reproducibles:** `npm ci` instala exactamente lo registrado en `package-lock.json`.
- **Imagen reducida:** la salida `standalone` evita copiar el `node_modules` completo.
- **Usuario no privilegiado:** `USER node`.
- **Sin secretos:** no hay archivos `.env` en el proyecto, y `.gitignore` y `.dockerignore` los excluyen por si se crean. La aplicación no necesita variables de entorno privadas.
- **Puerto publicado solo en `127.0.0.1`:** la aplicación no queda expuesta a otros equipos de la red.
- **Desarrollo y producción separados:** `npm run dev` para desarrollar en el equipo y la imagen Docker para producción.
- **Finales de línea LF:** `.gitattributes` evita que Git convierta el `Dockerfile` a CRLF al clonar en Windows.

## Desarrollo local (opcional)

Solo hace falta para modificar la aplicación. Requiere Node.js 20.9 o superior.

```bash
npm ci
npm run dev      # servidor de desarrollo en http://localhost:3000
npm run lint     # ESLint
npm run build    # compilación de producción
```

## Pruebas realizadas

Se ejecutaron en Windows 11, con Node.js 24.16 para las pruebas locales y Docker Engine 29.1.3 en WSL 2 (Ubuntu 24.04) para las pruebas de contenedor.

| Prueba | Comando | Resultado |
| --- | --- | --- |
| Verificación de tipos | `npx tsc --noEmit` | Sin errores |
| Análisis estático | `npm run lint` | Sin errores ni advertencias |
| Compilación de Next.js | `npm run build` | Correcta: `/` estática y `/api/health` dinámica |
| Construcción de la imagen | `docker build -t docker-next-lab .` | Correcta, con las tres etapas |
| Ejecución del contenedor | `docker run -d --name docker-next-lab -p 127.0.0.1:3100:3000 docker-next-lab` | Estado `Up (healthy)` |
| Registros | `docker logs docker-next-lab` | El servidor de Next.js inicia sin errores |
| Página principal | `curl http://localhost:3100/` | HTTP 200, título «Docker Next Lab» y las cinco secciones presentes |
| Endpoint de estado | `curl http://localhost:3100/api/health` | HTTP 200, `{"status":"ok","node":"v24.22.2",...}` |
| Recursos estáticos | `curl` sobre `/logo.svg`, `/icon.svg` y los archivos CSS y JS de `/_next/static/` | HTTP 200 en todos |
| Usuario del proceso | `docker exec docker-next-lab id` | `uid=1000(node)` |
| Independencia del equipo local | `docker exec docker-next-lab ls /app` | Solo `server.js`, `package.json`, `public`, `.next`, `Dockerfile` y un `node_modules` mínimo generado dentro de la imagen. No contiene `src/` ni usa el `node_modules` del equipo |
| Revisión visual | Capturas con Chrome sin interfaz gráfica a 1366 px y 500 px de ancho | Diseño correcto en escritorio y en pantallas angostas |

## Autoría

**Yami Linares**: proyecto académico de contenerización de aplicaciones web con Docker y Next.js.
