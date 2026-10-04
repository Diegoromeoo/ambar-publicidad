"use client";

import { useEffect, useRef, useState, type ComponentType, type SVGProps } from "react";
import { m, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { WhatsAppIcon, InstagramIcon, TikTokIcon } from "@/components/icons/brand-icons";
import { site } from "@/lib/site";
import { WA_DEFAULT_LINK } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type DockItem = {
  label: string;
  detail: string;
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  primary?: boolean;
};

const ITEMS: DockItem[] = [
  { label: "WhatsApp", detail: site.phone.display, href: WA_DEFAULT_LINK, Icon: WhatsAppIcon, primary: true },
  { label: "Instagram", detail: site.socials.instagram.handle, href: site.socials.instagram.url, Icon: InstagramIcon },
  { label: "TikTok", detail: site.socials.tiktok.handle, href: site.socials.tiktok.url, Icon: TikTokIcon },
];

/** Dock flotante de conversión: aparece después del hero y se oculta sobre la barra del cotizador. */
export function SocialDock() {
  const [visible, setVisible] = useState(false);
  const mouseX = useMotionValue(Infinity);

  useEffect(() => {
    const hero = document.getElementById("inicio");
    if (!hero) return;
    const io = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), { threshold: 0.35 });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  return (
    <nav
      aria-label="Contacto rápido"
      data-visible={visible}
      className="social-dock pb-safe fixed bottom-0 left-1/2 z-40 -translate-x-1/2 px-3"
    >
      <div
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="glass flex items-end gap-2 rounded-full border border-white/10 p-1.5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.95)] sm:gap-2.5 sm:p-2"
      >
        {ITEMS.map((item) => (
          <DockLink key={item.label} item={item} mouseX={mouseX} />
        ))}
      </div>
    </nav>
  );
}

function DockLink({ item, mouseX }: { item: DockItem; mouseX: MotionValue<number> }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const distance = useTransform(mouseX, (x) => {
    const b = ref.current?.getBoundingClientRect();
    return b ? x - b.left - b.width / 2 : Infinity;
  });
  const scale = useSpring(useTransform(distance, [-150, 0, 150], [1, 1.32, 1]), { mass: 0.1, stiffness: 170, damping: 14 });
  const { Icon } = item;

  return (
    <m.a
      ref={ref}
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ scale }}
      aria-label={`${item.label} ${item.detail}`}
      className={cn(
        "group relative flex h-12 origin-bottom items-center justify-center rounded-full transition-colors",
        item.primary
          ? "btn-gold gap-2 px-5 text-sm font-semibold [transition:box-shadow_0.35s] sm:w-12 sm:px-0"
          : "w-12 bg-white/[0.04] text-silver ring-1 ring-white/10 hover:text-gold-200 hover:ring-gold-400/50",
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {item.primary ? <span className="sm:hidden">WhatsApp</span> : null}
      {/* Tooltip (escritorio) */}
      <span className="pointer-events-none absolute -top-12 left-1/2 hidden -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-full border border-white/10 bg-obsidian-800/95 px-3 py-1.5 text-xs font-medium text-silver opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:block">
        {item.label} · <span className="text-gold-300">{item.detail}</span>
      </span>
    </m.a>
  );
}
