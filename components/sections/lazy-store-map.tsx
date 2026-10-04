"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { LocationDetail } from "@/lib/site";

function MapSkeleton() {
  return (
    <div className="absolute inset-0 bg-obsidian-800">
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <span className="animate-ping-slow absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/60" />
    </div>
  );
}

// Leaflet solo se descarga cuando el usuario se acerca al mapa
const StoreMap = dynamic(() => import("./store-map"), { ssr: false, loading: () => <MapSkeleton /> });

export function LazyStoreMap({ location }: { location: LocationDetail }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 isolate">
      {/* `key` fuerza un remonte del mapa al cambiar de dirección (Leaflet no re-centra bien vía props) */}
      {near ? <StoreMap key={location.id} location={location} /> : <MapSkeleton />}
    </div>
  );
}
