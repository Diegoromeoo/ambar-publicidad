/**
 * Videos del taller (optimizados desde /VIDEOS a public/media: H.264, sin audio, ~7 s).
 * 🎬 Para cambiar un video: coloca el .mp4 y su póster .jpg en public/media y edita esta lista.
 */
export interface ShowcaseClip {
  id: string;
  src: string;
  poster: string;
  title: string;
  caption: string;
  tag: string;
  orientation: "portrait" | "landscape";
}

export const SHOWCASE_CLIPS: ShowcaseClip[] = [
  {
    id: "offset",
    src: "/media/offset-rodillos.mp4",
    poster: "/media/offset-rodillos.jpg",
    title: "Offset de alta fidelidad",
    caption: "Color constante de la primera a la última hoja en tirajes largos.",
    tag: "Offset",
    orientation: "portrait",
  },
  {
    id: "taller",
    src: "/media/taller-offset.mp4",
    poster: "/media/taller-offset.jpg",
    title: "Producción en serie",
    caption: "Pliegos, tintas y registro vigilados en cada paso.",
    tag: "Producción",
    orientation: "landscape",
  },
  {
    id: "gran-formato",
    src: "/media/gran-formato-impresion.mp4",
    poster: "/media/gran-formato-impresion.jpg",
    title: "Gran formato a todo color",
    caption: "Lonas y viniles con negros profundos y colores que no se deslavan.",
    tag: "Gran formato",
    orientation: "portrait",
  },
  {
    id: "uv",
    src: "/media/impresion-uv.mp4",
    poster: "/media/impresion-uv.jpg",
    title: "Impresión UV en rígidos",
    caption: "Señalética directa sobre PVC, trovicel y acrílico.",
    tag: "UV",
    orientation: "landscape",
  },
  {
    id: "corte",
    src: "/media/corte-papel.mp4",
    poster: "/media/corte-papel.jpg",
    title: "Corte de precisión",
    caption: "Refinado a mano para bordes perfectos.",
    tag: "Acabados",
    orientation: "portrait",
  },
  {
    id: "sello",
    src: "/media/sello-kraft.mp4",
    poster: "/media/sello-kraft.jpg",
    title: "Detalles artesanales",
    caption: "Sellos, etiquetas y empaques con toque hecho a mano.",
    tag: "Empaque",
    orientation: "landscape",
  },
];

export const PROCESS_STEPS = [
  { n: "01", title: "Asesoría", text: "Nos cuentas tu idea por WhatsApp o en el taller y elegimos papel, técnica y acabados." },
  { n: "02", title: "Diseño y preprensa", text: "Revisamos tus archivos, ajustamos color y te enviamos prueba para aprobación." },
  { n: "03", title: "Impresión", text: "Producción digital, offset o gran formato con control de color en cada pliego." },
  { n: "04", title: "Acabados y entrega", text: "Foil, realce, suaje y empaque final. Recoges en el taller o lo enviamos." },
];
