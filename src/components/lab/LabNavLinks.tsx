"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = { href: string; label: string; start?: boolean };

/** Markiert den aktiven Bereich (aria-current), damit man immer weiß, wo man ist. */
export default function LabNavLinks({ links }: { links: NavLink[] }) {
  const pfad = usePathname();
  const aktiv = (l: NavLink) =>
    l.start ? pfad === l.href || pfad.startsWith("/de/app/rezeptur") : pfad === l.href || pfad.startsWith(`${l.href}/`);
  return (
    <ul>
      {links.map((l) => (
        <li key={l.href}>
          <Link href={l.href} aria-current={aktiv(l) ? "page" : undefined}>
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
