const WORDS = [
  "Hot Stamping",
  "Barniz UV Selectivo",
  "Realce",
  "Suaje",
  "Serigrafía",
  "Gran Formato",
  "Offset",
  "Impresión Digital",
  "Empaques de Lujo",
  "Material POP",
  "Editorial",
];

/** Cinta infinita de capacidades (CSS puro, se pausa al pasar el mouse). */
export function Marquee() {
  const row = (hidden?: boolean) => (
    <ul aria-hidden={hidden} className="flex shrink-0 items-center">
      {WORDS.map((w) => (
        <li key={w} className="flex items-center">
          <span className="px-6 font-display text-2xl italic text-silver/85 sm:px-9 sm:text-4xl">{w}</span>
          <svg aria-hidden viewBox="0 0 12 12" className="h-3 w-3 text-gold-400">
            <path fill="currentColor" d="M6 0 7.2 4.8 12 6 7.2 7.2 6 12 4.8 7.2 0 6l4.8-1.2Z" />
          </svg>
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label="Técnicas y acabados" className="relative border-y border-white/[0.06] bg-obsidian-950/60 py-6 sm:py-8">
      <div className="marquee overflow-hidden">
        <div className="animate-marquee flex w-max">
          {row()}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
