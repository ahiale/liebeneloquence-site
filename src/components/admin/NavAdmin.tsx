"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/ui/Icons";

/** Menu latéral de l'admin : le module ouvert est mis en avant. */
export function NavAdmin({ modules }: { modules: { href: string; label: string; icone: IconName }[] }) {
  const chemin = usePathname();
  const actif = (href: string) => (href === "/admin" ? chemin === "/admin" : chemin.startsWith(href));
  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col">
      {modules.map((m) => (
        <Link
          key={m.href}
          href={m.href}
          className={`flex shrink-0 items-center gap-2.5 rounded-[12px] px-3 py-2.5 text-[14.5px] no-underline ${actif(m.href) ? "bg-white/12 font-semibold text-white" : "text-white/70 hover:bg-white/6 hover:text-white"}`}
        >
          <Icon name={m.icone} size={18} />
          {m.label}
        </Link>
      ))}
    </nav>
  );
}
