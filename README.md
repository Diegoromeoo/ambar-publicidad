# Ámbar Publicidad — Sitio web

Sitio de conversión para **Ámbar Publicidad** (imprenta premium en Guadalajara, Jalisco): convierte el tráfico de Instagram, TikTok y Facebook en conversaciones de WhatsApp y visitas al taller.

**Stack:** Next.js 16 (App Router, TypeScript) · Tailwind CSS 4 · Motion 13 · Lucide · Leaflet

## Cómo correrlo

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # pruebas del motor de precios
npm run build      # build de producción
```

## Dónde editar cada cosa

| Qué | Archivo |
| --- | --- |
| WhatsApp, teléfono, redes, dirección, coordenadas, horario, estacionamiento | `lib/site.ts` |
| 💰 Precios del **cotizador** (precio base, materiales, acabados, descuentos por volumen, amplitud del rango) | `lib/pricing.ts` |
| Productos del **catálogo** (textos, fotos, configuración base) | `lib/catalog.ts` |
| Directorio técnico (tiempos, mínimos, especificaciones, opciones para agencias) | `lib/directory.ts` |
| Videos del taller y pasos del proceso | `lib/showcase.ts` |
| Colores, tipografías y efectos | `app/globals.css` |

Los precios "Desde" del catálogo se **calculan con el mismo motor del cotizador** (usando la configuración `quote` de cada producto), así el catálogo y el cotizador siempre coinciden. Para fijar un precio manual, agrega `from` en el `price` del producto.

## Pendientes antes de publicar ⚠️

- `lib/site.ts`: **dirección, colonia, CP, coordenadas del local** (`exact: true` activa el pin en el mapa), **horario** y **estacionamiento** son de referencia.
- `lib/directory.ts`: especificaciones técnicas, tiempos y mínimos son valores típicos de la industria; valídalos con el taller.
- `lib/pricing.ts`: precios de referencia; ajústalos a la lista real.
- Fotos y videos: vienen de las carpetas `IMAGENES` y `VIDEOS` (stock de Pexels). Para usar fotos reales de trabajos terminados, reemplaza los archivos en `assets/images/` o `public/media/` con el mismo nombre (o cambia los imports en `lib/catalog.ts`).
- Al publicar, define `NEXT_PUBLIC_SITE_URL` con el dominio final (en Vercel se usa el dominio de producción automáticamente).

## Recursos de marca

El logo se extrajo **en vector** del PDF original (`LOGO/Ambar Publicidad Logo.pdf`) a `public/brand/` (`wordmark.svg`, `lockup.svg`, `mandala.svg`). Se usa como máscara CSS, por eso puede pintarse en oro, foil animado o cualquier color. El favicon (`app/icon.svg`) y la imagen para redes (`app/opengraph-image.jpg`) salen del mismo logo.
