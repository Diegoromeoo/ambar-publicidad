"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Wordmark, Mandala } from "@/components/ui/brand-logo";
import { WhatsAppIcon, InstagramIcon, TikTokIcon, FacebookIcon } from "@/components/icons/brand-icons";
import { site } from "@/lib/site";
import { WA_DEFAULT_LINK } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/ui/magnetic";
import { NAV } from "./nav";
import { MotionToggle } from "./motion-toggle";

export function Header() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > prev && y > 480 && !open);
  });

  // Scroll spy: resalta la sección visible
  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter((el): el is HTMLElement => Boolean(el));
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Menú móvil: bloquea scroll, cierra con Escape y enfoca el primer enlace
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      root.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-luxe",
          hidden && "-translate-y-[120%]",
        )}
      >
        <m.div aria-hidden style={{ scaleX: progress }} className="bg-gold absolute inset-x-0 top-0 h-[2px] origin-left" />
        <div className="mx-auto max-w-7xl px-3 pt-3 sm:px-6">
          <nav
            aria-label="Principal"
            className={cn(
              "flex items-center justify-between gap-3 rounded-full border py-2 pl-5 pr-2 transition-[background-color,border-color,box-shadow] duration-500",
              scrolled || open ? "glass shadow-luxe-md border-white/10" : "border-transparent bg-transparent",
            )}
          >
            <a href="#inicio" className="shrink-0" aria-label={`${site.name}, ir al inicio`} onClick={() => setOpen(false)}>
              <Wordmark className="w-[96px] sm:w-[112px]" />
            </a>

            <ul className="hidden items-center gap-0.5 lg:flex">
              {NAV.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={cn(
                      "relative isolate rounded-full px-4 py-2 text-[13px] font-medium tracking-wide transition-colors",
                      active === item.id ? "text-white" : "text-mist hover:text-white",
                    )}
                  >
                    {active === item.id ? (
                      <m.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-white/[0.06] ring-1 ring-gold-400/30"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    ) : null}
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <Magnetic className="hidden sm:inline-block" strength={0.25} max={8}>
                <a
                  href={WA_DEFAULT_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-semibold"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Cotizar
                </a>
              </Magnetic>
              <a
                href={WA_DEFAULT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Cotizar por WhatsApp"
                className="btn-gold inline-flex h-10 w-10 items-center justify-center rounded-full sm:hidden"
              >
                <WhatsAppIcon className="h-[18px] w-[18px]" />
              </a>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="menu-movil"
                aria-label={open ? "Cerrar menú" : "Abrir menú"}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-silver ring-1 ring-white/15 transition hover:ring-gold-400/60 lg:hidden"
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <m.div
            id="menu-movil"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menú"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            className="fixed inset-0 z-40 overflow-x-hidden overflow-y-auto bg-obsidian-950/95 backdrop-blur-xl lg:hidden"
          >
            <Mandala className="animate-spin-slow pointer-events-none absolute -right-40 top-24 w-[520px] opacity-[0.07]" />
            <div className="relative flex min-h-full flex-col px-6 pb-10 pt-28">
              <ul className="space-y-1">
                {NAV.map((item, i) => (
                  <m.li
                    key={item.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.06 + i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
                  >
                    <a
                      href={`#${item.id}`}
                      onClick={() => setOpen(false)}
                      className="group flex items-baseline gap-4 border-b border-white/[0.06] py-4"
                    >
                      <span className="font-display text-sm italic text-gold-500">0{i + 1}</span>
                      <span className="font-display text-4xl text-white transition-colors group-hover:text-gold-300">{item.label}</span>
                      <ArrowUpRight className="ml-auto h-5 w-5 self-center text-gold-500/70" />
                    </a>
                  </m.li>
                ))}
              </ul>

              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.35, duration: 0.6 } }}
                className="mt-auto space-y-6 pt-10"
              >
                <a
                  href={WA_DEFAULT_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold flex items-center justify-center gap-2.5 rounded-full px-6 py-4 text-base font-semibold"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Cotizar por WhatsApp
                </a>
                <div className="flex items-center justify-center gap-3">
                  {[
                    { href: site.socials.instagram.url, label: "Instagram", Icon: InstagramIcon },
                    { href: site.socials.tiktok.url, label: "TikTok", Icon: TikTokIcon },
                    { href: site.socials.facebook.url, label: "Facebook", Icon: FacebookIcon },
                  ].map(({ href, label, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${label} de ${site.name}`}
                      className="inline-flex h-12 w-12 items-center justify-center rounded-full text-silver ring-1 ring-white/12 transition hover:text-gold-300 hover:ring-gold-400/50"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
                <p className="text-center text-xs tracking-wide text-mist">
                  {site.phone.display} · {site.location.city}, {site.location.state}
                </p>
                <div className="flex justify-center">
                  <MotionToggle />
                </div>
              </m.div>
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
