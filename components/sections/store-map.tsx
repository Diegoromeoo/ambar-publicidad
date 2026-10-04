"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Circle, MapContainer, Marker, Popup, TileLayer, ZoomControl } from "react-leaflet";
import { directionLinks, formatAddress, site, type LocationDetail } from "@/lib/site";

// Pin dorado con pulso (estilos en globals.css → .ambar-pin)
const pin = L.divIcon({ className: "", html: '<div class="ambar-pin"><span></span></div>', iconSize: [22, 22], iconAnchor: [11, 11], popupAnchor: [0, -14] });
const cityLabel = L.divIcon({
  className: "",
  html: '<div style="transform:translate(-50%,-50%);white-space:nowrap;font:600 11px/1 var(--font-sans);letter-spacing:.3em;text-transform:uppercase;color:#efd88e;text-shadow:0 2px 12px #000">Guadalajara</div>',
  iconSize: [0, 0],
});

/**
 * Mapa oscuro de una dirección del negocio. Teselas de OpenStreetMap
 * oscurecidas con CSS (sin API key). Con `location.exact = true` muestra el
 * pin dorado real; si no, dibuja una zona aproximada.
 */
export default function StoreMap({ location }: { location: LocationDetail }) {
  const { coords, exact } = location;
  const center: [number, number] = [coords.lat, coords.lng];
  const touch = window.matchMedia("(pointer: coarse)").matches;
  const address = formatAddress(location);
  const links = directionLinks(location);

  return (
    <MapContainer
      center={center}
      zoom={exact ? 15 : 12}
      minZoom={10}
      scrollWheelZoom={false}
      dragging={!touch}
      zoomControl={false}
      className="ambar-map h-full w-full"
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        maxZoom={19}
      />
      <ZoomControl position="bottomright" />
      {exact ? (
        <Marker position={center} icon={pin}>
          <Popup>
            <strong style={{ color: "#efd88e" }}>
              {site.name} · {location.label}
            </strong>
            <br />
            {address.full || `${site.location.city}, ${site.location.state}`}
            <br />
            <a href={links.google} target="_blank" rel="noopener noreferrer">
              Cómo llegar →
            </a>
          </Popup>
        </Marker>
      ) : (
        <>
          <Circle center={center} radius={2800} pathOptions={{ color: "#d4af37", weight: 1, opacity: 0.8, dashArray: "3 7", fillColor: "#d4af37", fillOpacity: 0.07 }} />
          <Marker position={center} icon={cityLabel} interactive={false} keyboard={false} />
        </>
      )}
    </MapContainer>
  );
}
