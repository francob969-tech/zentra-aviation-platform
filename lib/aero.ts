/* ───────────────────────────────────────────────────────────
   Aero Ejecutivo SF — Configuración de marca
   Taxi aéreo privado · Base: Aeropuerto de San Fernando (SADF)

   ⚠ DATOS A REEMPLAZAR cuando llegue la marca real:
   - SITE_NAME / SITE_TAGLINE   → nombre comercial definitivo
   - WA_NUMBER                  → WhatsApp real (formato 549XXXXXXXXXX, sin +)
   - CONTACT_EMAIL              → email real
   - SITE_URL                   → dominio final
   Todo lo de aviación (ICAO, modelo) es real y verificable, pero
   conviene revalidarlo antes de publicar.
   ─────────────────────────────────────────────────────────── */

/* ═══════════════════════════════════════════════════════════
   DEMO_MODE — estado actual del sitio (entrega para presentación)
   ───────────────────────────────────────────────────────────
   El sitio se muestra como DEMO premium al dueño de la aeronave
   ANTES de recibir marca y fotos reales. Mientras DEMO_MODE.active
   sea true, asumir que:
     • La marca (nombre, logo, colores) es PLACEHOLDER.
     • Las imágenes de la aeronave son PLACEHOLDER ("foto pendiente").
     • Los tiempos de ruta de la calculadora son ESTIMADOS.
     • Los datos legales / de operador (CUIT, ANAC, matrícula) están PENDIENTES.
   Checklist de datos a recibir: ver CLIENT_DATA_REQUIRED.md
   Al pasar a producción con datos reales, poner active:false.
   ═══════════════════════════════════════════════════════════ */
export const DEMO_MODE = {
  active: true,
  brandIsPlaceholder: true,
  imagesArePlaceholder: true,
  routeTimesAreEstimates: true,
  legalDataPending: true,
};

/* ═══════════════════════════════════════════════════════════
   SECTIONS — activar/ocultar secciones por cliente (verticalización)
   Cada flag enciende o apaga una parte del sitio sin tocar código.
   Permite cubrir taxi aéreo / escuela / charter / broker / aeroclub
   desde el mismo motor. Todo en true = el sitio actual sin cambios.
   ═══════════════════════════════════════════════════════════ */
export const SECTIONS = {
  aircraftPage: true,    // página dedicada de la aeronave (/cessna-402)
  timeCalculator: true,  // sección "Comprás tiempo" (#tiempo)
  routeMap: true,        // mapa de rutas animado en Destinos
  adminCRM: true,        // panel /admin + API de administración
  faq: true,             // sección de preguntas frecuentes
};

export const SITE_NAME = "Aero Ejecutivo SF";
export const SITE_TAGLINE = "Taxi aéreo privado";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://aeroejecutivosf.com";

// Configurables por entorno (ver .env.example). Los fallbacks son placeholders.
export const WA_NUMBER =
  process.env.NEXT_PUBLIC_WA_NUMBER ?? "5491100000000";
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "vuelos@aeroejecutivosf.com";

// Datos legales del operador — completar cuando el dueño los pase.
// Los campos vacíos no se muestran en el sitio (ver AeroFooter).
export const LEGAL = {
  razonSocial: "", // p. ej. "Aero Ejecutivo SF S.R.L."
  cuit: "",        // p. ej. "30-12345678-9"
  anac: "",        // habilitación / certificado de explotador (CETA / TAA)
  matricula: "",   // matrícula de la aeronave, p. ej. "LV-XXX"
};

// Base de operaciones
export const BASE = {
  name: "Aeropuerto de San Fernando",
  city: "Buenos Aires, Argentina",
  icao: "SADF",
  // Coordenadas aproximadas de referencia (uso decorativo en el radar)
  coords: "S 34°27' · O 058°35'",
};

// Aeronave — redacción cauta, sin inventar cifras exactas
export const AIRCRAFT = {
  model: "Cessna 402",
  type: "Bimotor a pistón",
  description:
    "Bimotor regional ideal para operaciones privadas y vuelos a demanda.",
};

export type Service = {
  code: string;
  title: string;
  desc: string;
};

export const SERVICES: Service[] = [
  {
    code: "01",
    title: "Vuelos ejecutivos",
    desc: "Traslados de negocios puerta a puerta entre aeródromos, sin esperas ni conexiones.",
  },
  {
    code: "02",
    title: "Traslados regionales",
    desc: "Conexión directa con ciudades y destinos del interior en una fracción del tiempo terrestre.",
  },
  {
    code: "03",
    title: "Viajes corporativos",
    desc: "Equipos completos a una reunión y de regreso el mismo día, con agenda bajo tu control.",
  },
  {
    code: "04",
    title: "Vuelos familiares privados",
    desc: "Viajes personales con la comodidad, la privacidad y la flexibilidad de un avión propio.",
  },
  {
    code: "05",
    title: "Operaciones especiales",
    desc: "Logística para campo, estancias y necesidades específicas, coordinadas bajo consulta.",
  },
];

export type Destination = {
  city: string;
  icao: string; // código ICAO real del aeropuerto principal
  region: string;
  // posición normalizada (0–100) sobre el mapa estilizado del hero/sección
  x: number;
  y: number;
};

// Códigos ICAO reales de los aeropuertos principales (verificar antes de publicar)
export const DESTINATIONS: Destination[] = [
  { city: "Rosario", icao: "SAAR", region: "Santa Fe", x: 59, y: 41 },
  { city: "Córdoba", icao: "SACO", region: "Córdoba", x: 47, y: 31 },
  { city: "Mendoza", icao: "SAME", region: "Cuyo", x: 21, y: 45 },
  { city: "Mar del Plata", icao: "SAZM", region: "Costa Atlántica", x: 74, y: 67 },
  { city: "Punta del Este", icao: "SULS", region: "Uruguay", x: 85, y: 53 },
  { city: "Neuquén", icao: "SAZN", region: "Patagonia", x: 29, y: 66 },
  { city: "Bariloche", icao: "SAZS", region: "Patagonia", x: 21, y: 78 },
];

// Hub de salida para el mapa de rutas
export const HUB = { city: "San Fernando", icao: BASE.icao, x: 67, y: 53 };

export const WHY_US = [
  {
    code: "AHORRO",
    title: "Ahorro de tiempo",
    desc: "Lo que por tierra es una jornada, por aire son horas. Llegás, resolvés y volvés el mismo día.",
  },
  {
    code: "FLEX",
    title: "Horarios flexibles",
    desc: "Vos definís el día y la hora. El vuelo se adapta a tu agenda, no al revés.",
  },
  {
    code: "SADF",
    title: "Salida desde San Fernando",
    desc: "Operamos desde un aeropuerto ágil del AMBA, sin las demoras de las terminales comerciales.",
  },
  {
    code: "DIRECTO",
    title: "Comunicación directa",
    desc: "Hablás siempre con quien opera el vuelo. Sin intermediarios ni call centers.",
  },
  {
    code: "PRIVADO",
    title: "Experiencia privada",
    desc: "Tu vuelo es solo tuyo. Privacidad, discreción y trato personalizado de principio a fin.",
  },
];

/* ═══════════════════════════════════════════════════════════
   CONTENIDO — textos y datos de secciones (Capa 2 · config)
   Antes estaba hardcodeado en cada componente; centralizado acá
   para reutilizar la plataforma con otros clientes de aviación.
   Editar SOLO este archivo para cambiar el contenido del sitio.
   ═══════════════════════════════════════════════════════════ */

/* ── Métricas de confianza (sección bajo el hero) ── */
export type TrustMetric = { code: string; value: string; sub: string };
export const TRUST_METRICS: TrustMetric[] = [
  { code: "BASE", value: BASE.name, sub: BASE.city },
  { code: "AERONAVE", value: `${AIRCRAFT.model} · bimotor`, sub: AIRCRAFT.type },
  { code: "OPERACIÓN", value: "Vuelos privados", sub: "A demanda · sin horarios fijos" },
];

/* ── Flujo concierge "De la consulta al despegue" ── */
export type ProcessStep = { code: string; title: string; desc: string };
export const PROCESS: ProcessStep[] = [
  { code: "01", title: "Solicitud", desc: "Contanos trayecto, fecha y pasajeros por el formulario o por WhatsApp. Sin compromiso." },
  { code: "02", title: "Cotización", desc: "Te respondemos personalmente con el valor cerrado del vuelo y las alternativas del tramo." },
  { code: "03", title: "Coordinación", desc: "Confirmás y coordinamos todo a tu medida: horarios, equipaje, catering y traslados en tierra." },
  { code: "04", title: "Vuelo", desc: "Te presentás en San Fernando minutos antes de la salida. Embarcás sin filas y despegás." },
];

/* ── Calculadora de tiempo ahorrado ──
   Valores APROXIMADOS y conservadores (horas puerta a puerta). Validar con el operador. */
export type TimeRoute = {
  code: string; city: string; km: number;
  car: number; airline: number; private: number;
};
export const TIME_ROUTES: TimeRoute[] = [
  { code: "SACO", city: "Córdoba",        km: 700,  car: 8.5,  airline: 4.25, private: 2.5 },
  { code: "SAAR", city: "Rosario",        km: 300,  car: 4,    airline: 3.5,  private: 1.25 },
  { code: "SAME", city: "Mendoza",        km: 1050, car: 13,   airline: 4.75, private: 3.25 },
  { code: "SAZM", city: "Mar del Plata",  km: 415,  car: 5,    airline: 3.75, private: 1.5 },
  { code: "SULS", city: "Punta del Este", km: 390,  car: 7.5,  airline: 5,    private: 1.75 },
];
export type TimeMode = { key: "car" | "airline" | "private"; label: string; sub: string };
export const TIME_MODES: TimeMode[] = [
  { key: "car", label: "En auto", sub: "Ruta, peajes y paradas" },
  { key: "airline", label: "Aerolínea comercial", sub: "Traslados, espera y embarque" },
  { key: "private", label: "Taxi aéreo privado", sub: "Desde San Fernando, sin esperas" },
];

/* ── Preguntas frecuentes ── */
export type Faq = { q: string; a: string };
export const FAQS: Faq[] = [
  { q: "¿Cuánto cuesta un vuelo?", a: "Cada trayecto se cotiza a medida según destino, fechas y cantidad de pasajeros. Pedí tu cotización sin compromiso: te respondemos personalmente con el valor cerrado del vuelo." },
  { q: "¿Con cuánta anticipación tengo que reservar?", a: "Lo ideal es contactarnos con 48 horas de anticipación para coordinar tripulación y aeronave. De todas formas operamos a demanda: si tu salida es más próxima, consultanos igual y evaluamos la disponibilidad." },
  { q: "¿Qué incluye el servicio?", a: "El avión completo para vos y tus acompañantes, tripulación profesional y coordinación integral del vuelo. Extras como catering, traslado en tierra o necesidades especiales se coordinan bajo pedido." },
  { q: "¿Puedo llevar equipaje o mascotas?", a: "Sí, sujeto a la capacidad y configuración de la aeronave para tu trayecto. Indicalo en los requerimientos de tu solicitud y lo confirmamos en la cotización." },
  { q: "¿Qué pasa si hay mal clima?", a: "La seguridad es siempre la prioridad. Si las condiciones no permiten operar, reprogramamos el vuelo de común acuerdo y sin costo adicional." },
  { q: "¿Desde dónde salen los vuelos?", a: "Nuestra base es el Aeropuerto de San Fernando (SADF), en el norte del AMBA. También podemos coordinar salidas desde otros aeródromos según el itinerario." },
];

/* ── Página de la aeronave (/cessna-402) ── */
export type AircraftFeature = { title: string; desc: string };
export type AircraftMission = { code: string; title: string; desc: string };
export type Spec = { k: string; v: string };

export const AIRCRAFT_EXPERIENCE: AircraftFeature[] = [
  { title: "Cabina privada", desc: "El avión vuela solo para vos y tus acompañantes. Privacidad y discreción de principio a fin, sin pasajeros desconocidos." },
  { title: "Rutas directas", desc: "Del punto A al punto B sin escalas técnicas innecesarias ni conexiones. El itinerario se arma alrededor de tu destino." },
  { title: "Horarios flexibles", desc: "La salida se programa según tu agenda y puede ajustarse si tu día cambia. El avión te espera a vos, no al revés." },
];
export const AIRCRAFT_OPERATIONS: AircraftMission[] = [
  { code: "01", title: "Traslados ejecutivos", desc: "Reuniones en el interior con regreso el mismo día, partiendo desde un aeropuerto ágil del norte del AMBA." },
  { code: "02", title: "Destinos regionales", desc: "Conexión directa con ciudades del interior y de la región, incluyendo plazas con poca o ninguna frecuencia comercial." },
  { code: "03", title: "Vuelos familiares", desc: "Escapadas y viajes personales con la comodidad y la tranquilidad de un avión privado." },
  { code: "04", title: "Estancias y aeródromos", desc: "Operación en aeródromos y pistas del interior, coordinada bajo consulta según las condiciones de cada campo." },
];
export const AIRCRAFT_SAFETY: AircraftFeature[] = [
  { title: "Planificación de cada vuelo", desc: "Cada tramo se planifica de manera individual: ruta, alternativas y combustible se definen para las condiciones del día." },
  { title: "Meteorología primero", desc: "Las condiciones meteorológicas se evalúan antes de confirmar cada salida. Si no acompañan, el vuelo se reprograma de común acuerdo." },
  { title: "Mantenimiento coordinado", desc: "El mantenimiento de la aeronave se coordina con talleres y profesionales habilitados, según los programas que corresponden al equipo." },
  { title: "Tripulación profesional", desc: "Operación a cargo de tripulación profesional, con comunicación directa entre quien vuela y quien viaja." },
];
export const AIRCRAFT_SPECS: Spec[] = [
  { k: "Modelo", v: AIRCRAFT.model },
  { k: "Tipo", v: "Bimotor a pistón" },
  { k: "Categoría", v: "Transporte regional liviano" },
  { k: "Configuración", v: "Cabina ejecutiva privada" },
  { k: "Base", v: `${BASE.name} (${BASE.icao})` },
  { k: "Operación", v: "Vuelos privados a demanda" },
];

/* ── Galería de la aeronave (placeholders hasta tener fotos reales) ──
   Completar `src` con rutas en public/aircraft/ cuando lleguen las fotos. */
export type GalleryPhoto = { src: string | null; alt: string; label: string };
export const AIRCRAFT_GALLERY: GalleryPhoto[] = [
  { src: null, alt: "Cessna 402 en plataforma", label: "Exterior" },
  { src: null, alt: "Interior de la cabina ejecutiva", label: "Cabina" },
  { src: null, alt: "Embarque en el Aeropuerto de San Fernando", label: "Plataforma SADF" },
];

/* ── Tema visual (colores de marca) ──
   Única fuente de verdad de la paleta. layout.tsx los inyecta como variables
   CSS (--aero-*) en <html>; el resto del CSS las consume. Cambiar acá = rebrand. */
export const THEME = {
  colors: {
    void: "#060A10",                    // fondo de página (navy casi-negro)
    deep: "#090E16",                    // secciones alternas
    panel: "#0D141D",                   // superficies elevadas
    line: "rgba(214, 228, 238, 0.10)",  // hairlines
    text: "#EDF2F6",                    // texto principal (blanco plata)
    muted: "#97A4B0",                   // texto secundario
    dim: "#76838F",                     // texto terciario (AA)
    accent: "#7FD9EC",                  // acento (cian · luces de pista)
    accentDim: "#3E6B78",               // acento apagado (bordes)
    silver: "#C6D1DA",                  // plata clara
  },
};

/* ── Marca: fuentes y logo (puntos de cambio para rebrand) ──
   Las fuentes se cargan vía next/font en app/layout.tsx (constraint de Next:
   son macro de build, no runtime). El logo es el SVG de components/aero/ui/Logo.tsx
   + app/icon.svg (favicon). Documentado acá como referencia de swap. */
export const BRAND = {
  fonts: { display: "Cormorant Garamond", body: "Inter" },
  logo: "delta", // marca actual: delta de vuelo en components/aero/ui/Logo.tsx
};

/* ── Firma del estudio (footer) ── */
export const STUDIO = {
  name: "Zentra Studio",
  url: "https://studio-zentra.com/",
};

/* ── SEO — home ── */
export const SEO = {
  title: `${SITE_NAME} — Taxi aéreo privado desde San Fernando`,
  description:
    "Taxi aéreo privado desde el Aeropuerto de San Fernando, Buenos Aires. Vuelos regionales directos y a demanda a bordo de un Cessna 402. Comunicación directa.",
  ogTitle: `${SITE_NAME} — Taxi aéreo privado desde San Fernando`,
  ogDescription:
    "Vuelos privados regionales, directos y flexibles desde el Aeropuerto de San Fernando.",
  twitterDescription:
    "Vuelos privados regionales, directos y flexibles desde San Fernando.",
  locale: "es_AR",
  // Datos estructurados (JSON-LD)
  schemaDescription:
    "Taxi aéreo privado desde el Aeropuerto de San Fernando (SADF). Vuelos regionales directos y a demanda a bordo de un Cessna 402.",
  schemaAddress: { locality: "San Fernando", region: "Buenos Aires", country: "AR" },
  areaServed: ["Argentina", "Uruguay"],
  offerName: "Vuelos privados a demanda",
};

/* ── SEO — página de la aeronave ── */
export const AIRCRAFT_SEO = {
  title: "Cessna 402 — Bimotor para vuelos privados regionales",
  description:
    "Conocé la aeronave de Aero Ejecutivo SF: un Cessna 402, bimotor utilizado en aviación regional, operado de forma privada y a demanda desde el Aeropuerto de San Fernando.",
  ogDescription:
    "Bimotor regional operado de forma privada y a demanda desde San Fernando (SADF).",
};

/* ── Etiquetas de CTA (texto de botones reutilizables) ── */
export const CTA = {
  cotizar: "Cotizar vuelo",
  cotizarWhatsApp: "Cotizar por WhatsApp",
  verDestinos: "Ver destinos",
  consultarDisponibilidad: "Consultar disponibilidad",
  conocerAeronave: "Conocer la aeronave",
  whatsapp: "WhatsApp",
};

/* ═══════════════════════════════════════════════════════════
   COPY — títulos, eyebrows, subtítulos y texto de marketing
   Centraliza el texto que estaba inline en los componentes. Los
   títulos con acento se guardan por partes (pre / accent / post);
   los espacios están horneados en las strings para que el render
   sea idéntico al original. La estructura JSX (spans, <br>) queda
   en los componentes; acá viven solo las palabras.
   ═══════════════════════════════════════════════════════════ */
export const COPY = {
  hero: {
    eyebrow: "Aviación privada · San Fernando",
    h1Line1: "Taxi aéreo privado",
    h1Muted: "desde ",
    h1Accent: "San Fernando",
    subtitle:
      "Vuelos regionales privados, traslados ejecutivos y horarios a tu medida. Salís cuando lo necesitás, con trato directo de principio a fin.",
    availability: "Disponible para vuelos a demanda",
  },
  services: {
    eyebrow: "Servicios",
    titlePre: "Una operación, ",
    titleAccent: "muchas formas de volar.",
    sub: "Cada vuelo se arma a medida. Estos son los formatos más habituales; si tu caso es distinto, lo coordinamos.",
  },
  aircraftHome: {
    eyebrow: "La aeronave",
    titleLine1: "Cessna 402.",
    titleAccent: "Bimotor regional.",
    intro:
      " Una plataforma pensada para tramos directos entre Buenos Aires y el interior, con la flexibilidad de salir cuando vos lo necesitás.",
    specsNote:
      "Capacidad, autonomía y velocidad se confirman según la configuración de cabina y el tramo solicitado.",
  },
  destinations: {
    eyebrow: "Destinos",
    titlePre: "Una red que ",
    titleAccent: "crece con tu agenda.",
    sub: "Conectamos San Fernando con los principales destinos del país y la región. Estos son algunos de los más solicitados.",
    privateLabel: "Estancias y aeródromos privados",
    closing:
      "¿No ves tu destino? Operamos a demanda: contanos a dónde necesitás llegar y lo evaluamos.",
  },
  whyUs: {
    eyebrow: "Por qué elegirnos",
    titlePre: "El tiempo es ",
    titleAccent: "el activo",
    titlePost: " que recuperás.",
    sub: "Volar privado no es un lujo: es convertir una jornada perdida en tierra en una reunión más, una noche en casa, un negocio cerrado a tiempo.",
    nextLabel: "Siguiente paso",
    nextTitle: "Contanos tu próximo viaje.",
  },
  timeSaved: {
    eyebrow: "Tu tiempo",
    titlePre: "No comprás un avión. ",
    titleAccent: "Comprás tiempo.",
    sub: "Elegí un destino y comparálo puerta a puerta. La diferencia no es el vuelo: es todo lo que lo rodea.",
    recoveredLabel: "Tiempo recuperado por tramo",
    recoveredNote:
      "frente a la mejor alternativa tradicional. En ida y vuelta el mismo día, la diferencia se duplica.",
    disclaimer:
      "Tiempos estimados sujetos a ruta, meteorología, operación y disponibilidad. Comparación puerta a puerta orientativa sobre valores promedio.",
  },
  process: {
    eyebrow: "Cómo funciona",
    titlePre: "De la consulta ",
    titleAccent: "al despegue.",
    sub: "Un solo interlocutor de principio a fin. Cuatro pasos, sin vueltas: el proceso completo puede resolverse en el día.",
  },
  quote: {
    eyebrow: "Solicitud de vuelo",
    titlePre: "Diseñemos ",
    titleAccent: "tu vuelo.",
    sub: "Indicanos el trayecto y coordinamos disponibilidad, aeronave y detalles a tu medida. Un asesor te responde personalmente.",
    directPrefix: "¿Preferís hablar directo?",
    privacy: "Usamos tus datos únicamente para responder tu solicitud de vuelo.",
  },
  faq: {
    eyebrow: "Preguntas frecuentes",
    titlePre: "Lo que vas a querer ",
    titleAccent: "saber antes.",
    sub: "Si tu duda no está acá, escribinos directo: la respuesta siempre la da quien opera el vuelo.",
  },
  finalCta: {
    eyebrow: "Próximo vuelo",
    titleLine1: "Consultá disponibilidad para",
    titleLine2: " tu próximo vuelo.",
    subPre: "Decinos a dónde y cuándo. Coordinamos el resto desde ",
    subPost: " · San Fernando.",
  },
  aircraftPage: {
    heroEyebrow: "La aeronave",
    h1Pre: "Cessna 402, ",
    h1Accent: "bimotor",
    h1Post: " para vuelos privados regionales.",
    heroSubtitle:
      "Una plataforma utilizada en aviación regional, operada acá de forma privada y a demanda: tu trayecto, tu horario y tu cabina, desde el Aeropuerto de San Fernando.",
    overviewEyebrow: "Visión general",
    overviewTitlePre: "Pensado para ",
    overviewTitleAccent: "la región.",
    overviewSub: "El Cessna 402 es un bimotor liviano con larga trayectoria en la aviación regional. En nuestra operación está dedicado a vuelos privados a demanda: tramos directos entre Buenos Aires y el interior, con la agenda bajo control del pasajero.",
    overviewSpecsNote:
      "Capacidad, autonomía y tiempos de vuelo se confirman en cada cotización, según la configuración de cabina y el tramo solicitado.",
    experienceEyebrow: "A bordo",
    experienceTitlePre: "La experiencia es ",
    experienceTitleAccent: "tuya.",
    operationsEyebrow: "Perfil operativo",
    operationsTitlePre: "Las misiones que ",
    operationsTitleAccent: "vuela.",
    safetyEyebrow: "Seguridad",
    safetyTitlePre: "La seguridad ordena ",
    safetyTitleAccent: "cada decisión.",
    safetySub: "Volar privado no es saltarse pasos: es hacerlos con más cuidado y con un solo responsable de punta a punta.",
    galleryEyebrow: "Galería",
    galleryTitlePre: "La aeronave, ",
    galleryTitleAccent: "de cerca.",
    gallerySub: "Fotos reales del avión y su cabina, próximamente.",
    finalTitlePre: "¿Tu próximo tramo, ",
    finalTitleAccent: "en este avión?",
    finalSub: "Contanos a dónde y cuándo. Te confirmamos disponibilidad y el valor cerrado del vuelo.",
  },
  admin: {
    loginTitlePre: "Panel de ",
    loginTitleAccent: "administración.",
    dashTitlePre: "Solicitudes de ",
    dashTitleAccent: "vuelo.",
  },
};

export function buildWaLink(message: string): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}
