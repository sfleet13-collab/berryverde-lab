import { getCurrentUser, isAdmin } from "@/lib/auth";
import { signOut } from "@/lib/actions/auth";
import { L } from "@/i18n/lab";
import LabNavLinks from "./LabNavLinks";
import styles from "./lab.module.css";

/** Navigation im App-Bereich: Rezepturen, Rohstoffe, Verwaltung (nur Admin), Abmelden. */
export default async function LabNav() {
  const user = await getCurrentUser();
  if (!user?.mitglied) return null;
  const links = [
    { href: "/de/app", label: L.nav.rezepturen, start: true },
    { href: "/de/app/rohstoffe", label: L.nav.rohstoffe },
    ...(isAdmin(user) ? [{ href: "/de/app/admin", label: L.nav.admin }] : []),
  ];
  return (
    <div className={`${styles.labNav} no-print`}>
      <div className={`container ${styles.labNavInnen}`}>
        <nav aria-label={L.nav.label}>
          <LabNavLinks links={links} />
        </nav>
        <form action={signOut} className={styles.labNavKonto}>
          <input type="hidden" name="lang" value="de" />
          <span className={styles.labNavMail}>{user.email}</span>
          <button type="submit">{L.nav.abmelden}</button>
        </form>
      </div>
    </div>
  );
}
