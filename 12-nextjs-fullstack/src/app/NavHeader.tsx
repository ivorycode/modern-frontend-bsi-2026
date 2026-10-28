"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./NavHeader.module.css";

export function NavHeader() {
  return (
    <div className={styles.navContainer}>
      <NavLink href={`/`}>Home</NavLink>
      <NavLink href={`/01-simple`}>Simple</NavLink>
      <NavLink href={`/02-backend`}>Backend</NavLink>
      <NavLink href={`/03-streaming`}>Streaming</NavLink>
      <NavLink href={`/04-clock`}>Clock</NavLink>
      <NavLink href={`/05-counter`}>Counter</NavLink>
      <NavLink href={`/06-composition`}>Composition</NavLink>
      <NavLink href={`/07-dataflow`}>Data Flow</NavLink>
      <NavLink href={`/08-serverfunctions`}>Server Functions</NavLink>
      <NavLink href={`/09-pendingui`}>Pending UI</NavLink>
    </div>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      className={pathname === href ? styles.navLinkActive : styles.navLink}
    >
      {children}
    </Link>
  );
}
