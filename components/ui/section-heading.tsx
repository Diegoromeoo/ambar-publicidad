import type { ReactNode } from "react";
import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  id,
  index,
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  id?: string;
  index: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <Reveal className={cn("max-w-3xl", centered && "mx-auto text-center", className)}>
      <p className={cn("flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.34em] text-gold-400", centered && "justify-center")}>
        <span className="font-display text-base font-medium italic tracking-normal text-gold-500">{index}</span>
        <span aria-hidden className="h-px w-10 bg-gradient-to-r from-gold-500/80 to-transparent" />
        {eyebrow}
      </p>
      <h2 id={id} className="mt-5 font-display text-[2.55rem] font-medium leading-[1.02] tracking-[-0.01em] text-white text-balance sm:text-5xl lg:text-[4rem]">
        {title}
      </h2>
      {description ? <p className="mt-5 text-pretty text-[15px] leading-relaxed text-mist sm:text-lg">{description}</p> : null}
    </Reveal>
  );
}

/** Palabra o frase en cursiva dorada para títulos editoriales. */
export function Accent({ children }: { children: ReactNode }) {
  return <em className="text-gold-animated pr-[0.06em] font-normal italic">{children}</em>;
}
