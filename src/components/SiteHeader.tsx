"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { profile } from "@/data/content";

const links = [
  { href: "/#about", label: "About" },
  { href: "/#intelligence", label: "AI / ML" },
  { href: "/#architecture", label: "Cloud" },
  { href: "/#systems", label: "Systems lab" },
  { href: "/projects", label: "Projects" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label={`${profile.name}, home`} onClick={close}>
        <span className="brand-mark">MS<span>.</span></span>
        <span className="brand-name">{profile.name}</span>
      </Link>
      <button
        className="menu-toggle"
        type="button"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="main-nav"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={19} /> : <Menu size={19} />}
      </button>
      <nav id="main-nav" className={`main-nav${open ? " is-open" : ""}`} aria-label="Main navigation">
        {links.map((link, index) => {
          const current = link.href === "/projects" && pathname.startsWith("/projects");
          return (
            <Link key={link.href} href={link.href} className={current ? "is-current" : undefined} aria-current={current ? "page" : undefined} onClick={close}>
              <span className="nav-index">0{index + 1}</span>{link.label}
            </Link>
          );
        })}
        <Link className="nav-contact" data-tilt href="/#contact" onClick={close}>
          Opportunities <ArrowUpRight size={14} strokeWidth={1.6} />
        </Link>
      </nav>
    </header>
  );
}
