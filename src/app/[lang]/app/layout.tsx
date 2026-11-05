import { Suspense } from "react";
import LabNav from "@/components/lab/LabNav";

/** Rahmen für den App-Bereich: Navigation von Dein Lab über jeder Seite. */
export default function AppLayout({ children }: LayoutProps<"/[lang]/app">) {
  return (
    <>
      <Suspense fallback={<div style={{ minHeight: 52 }} />}>
        <LabNav />
      </Suspense>
      {children}
    </>
  );
}
