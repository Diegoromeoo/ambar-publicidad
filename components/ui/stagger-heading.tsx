import type { CSSProperties, ElementType } from "react";

type Segment = { text: string; className?: string };

/**
 * Titular con animación escalonada palabra por palabra.
 * Es CSS puro (sin hidratación), así el texto se pinta desde el primer render: bueno para LCP.
 */
export function StaggerHeading({
  as: Tag = "h1",
  lines,
  className,
  baseDelay = 120,
}: {
  as?: ElementType;
  lines: Segment[][];
  className?: string;
  baseDelay?: number;
}) {
  let i = 0;
  return (
    <Tag className={className}>
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.map((segment, si) =>
            segment.text.split(" ").map((word, wi) => {
              const index = i++;
              return (
                <span key={`${si}-${wi}`}>
                  <span className="word-mask">
                    <span className={segment.className} style={{ "--i": index, "--base": `${baseDelay}ms` } as CSSProperties}>
                      {word}
                    </span>
                  </span>{" "}
                </span>
              );
            }),
          )}
        </span>
      ))}
    </Tag>
  );
}
