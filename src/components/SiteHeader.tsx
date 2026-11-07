import Image from "next/image";
import styles from "./SiteHeader.module.css";

const links = [
  { href: "#conceptos", label: "Conceptos" },
  { href: "#arquitectura", label: "Arquitectura" },
  { href: "#dockerfile", label: "Dockerfile" },
  { href: "#comandos", label: "Comandos" },
  { href: "#buenas-practicas", label: "Buenas prácticas" },
];

export default function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <a href="#inicio" className={styles.brand}>
          <Image src="/logo.svg" alt="" width={28} height={28} priority />
          <span>Docker Next Lab</span>
        </a>
        <nav aria-label="Secciones">
          <ul className={styles.nav}>
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
