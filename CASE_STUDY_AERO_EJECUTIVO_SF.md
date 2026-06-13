# Case Study — Aero Ejecutivo SF

**Sistema digital de captación para taxi aéreo privado**

*Por ZENTRA Studio · studio-zentra.com*

---

> Diseño y desarrollo de la presencia digital completa de un operador de taxi
> aéreo privado: un sitio premium que no solo comunica, sino que **convierte
> visitantes en solicitudes de vuelo registradas y gestionables**.

| | |
|---|---|
| **Cliente** | Operador de taxi aéreo privado · Cessna 402 |
| **Base de operaciones** | Aeropuerto de San Fernando (SADF), Buenos Aires |
| **Industria** | Aviación privada / charter regional |
| **Alcance** | Estrategia · Diseño · Desarrollo · Backend · Panel de gestión |
| **Entregable** | Sitio web premium + sistema de captación de leads + panel de administración |

---

## El problema

Un operador de aviación privada que recién inicia enfrenta un desafío que no es
de marketing tradicional, sino de **confianza y conversión**:

- **Las consultas se perdían.** Los interesados llegaban por canales sueltos
  —un WhatsApp, un llamado, un contacto en común— sin registro ni seguimiento.
  Sin el operador frente al teléfono (que muchas veces está volando), el lead se
  enfriaba o desaparecía.
- **Cero presencia digital seria.** No existía un lugar donde un cliente
  ejecutivo pudiera evaluar el servicio y percibir el nivel premium que la
  aviación privada exige.
- **Sin forma de comunicar el valor real.** El cliente de un taxi aéreo no
  compra un avión: compra **tiempo**. Ese argumento no estaba articulado en
  ningún lado.
- **Información sensible.** En aviación, comunicar de más es un riesgo legal. Se
  necesitaba un mensaje potente pero **prudente**, sin prometer cifras ni
  certificaciones no confirmadas.

## La solución propuesta

ZENTRA Studio diseñó y construyó un **sistema comercial digital**, no una página
de presentación. La pieza visible —el sitio— está al servicio de un objetivo
medible: que cada visita interesada se convierta en un lead capturado, con
respaldo y trazabilidad.

Tres principios guiaron el proyecto:

1. **Premium real, no decorativo.** Estética de aviación ejecutiva nocturna
   —navy profundo, plata, acentos cian, grilla de radar— que posiciona la marca
   en la categoría correcta desde el primer segundo.
2. **Conversión por diseño.** Cada sección empuja hacia una acción: cotizar.
   Múltiples caminos (formulario, WhatsApp directo) sin fricción.
3. **El dato nunca se pierde.** Arquitectura de captación redundante que registra
   cada solicitud aunque el visitante no complete el contacto.

---

## Features del sitio

**Landing premium de una página**, con narrativa de venta de principio a fin:

- **Portada cinematográfica** con grilla de radar, luces de pista y trayectoria
  animada —atmósfera de aviación privada, sin clichés de stock—.
- **Mapa de rutas animado** que posiciona San Fernando como base y traza las
  conexiones regionales (Córdoba, Rosario, Mendoza, Mar del Plata, Punta del
  Este, Neuquén, Bariloche y aeródromos privados).
- **Calculadora "Comprás tiempo"** — el núcleo comercial: compara, puerta a
  puerta, auto vs. aerolínea comercial vs. taxi aéreo privado por destino,
  traduciendo el servicio a horas de vida recuperadas.
- **Flujo concierge en 4 pasos** (Solicitud → Cotización → Coordinación → Vuelo)
  que transmite simpleza y control.
- **Página dedicada de la aeronave** (`/cessna-402`) con overview, experiencia a
  bordo, perfil operativo y lenguaje de seguridad —redactada con prudencia
  profesional, sin inventar specs—.
- **Conversión por WhatsApp** omnipresente pero no invasiva: botón flotante,
  portada y formulario.
- **Detalles de oficio:** FAQ, página 404 de marca, microinteracciones sutiles,
  tipografía editorial, y un sistema visual coherente basado en tokens.

**Excelencia técnica de base:** accesibilidad (labels, foco visible, landmarks,
`prefers-reduced-motion`), SEO completo (metadata, Open Graph, JSON-LD, sitemap,
robots), performance alta (páginas estáticas pre-renderizadas) y responsive
impecable de mobile a desktop.

---

## Arquitectura de captación de leads

El corazón del sistema es lo que llamamos **"doble disparo"**: cuando un
visitante solicita una cotización, ocurren dos cosas simultáneas.

```
VISITANTE
  └─ completa el formulario o toca "Cotizar por WhatsApp"
        │
        ├─ A) Se abre WhatsApp con el mensaje ya armado  → contacto inmediato
        │
        └─ B) Se registra la solicitud en el backend     → el dato queda guardado
                  │
                  ├─ Almacenamiento persistente (base de datos)
                  ├─ Email de aviso al operador (opcional)
                  └─ Webhook a CRM / planilla (opcional)
```

**Por qué importa:** aunque el visitante se arrepienta, cierre WhatsApp o tenga
el navegador bloqueando ventanas, **la solicitud ya fue capturada**. El operador
la ve en su panel y puede contactar él. Validación de datos, protección
anti-bots (honeypot) y rate-limiting completan una entrada robusta.

---

## Sistema de administración

Un **panel privado** (`/admin`), protegido por contraseña, convierte al sitio en
una herramienta de trabajo diaria:

- **Bandeja de solicitudes** con ruta, fechas, pasajeros, requerimientos y
  contacto de cada lead.
- **Gestión de estado** por solicitud: nuevo → contactado → cotizado → ganado /
  perdido —un pipeline comercial básico—.
- **Notas internas** y **respuesta por WhatsApp con un clic** (mensaje
  pre-armado con los datos del cliente).
- **Métricas rápidas:** total de solicitudes, nuevas, vuelos próximos.
- **Búsqueda y filtros** por estado, nombre, teléfono o destino.

Es, en la práctica, un **mini-CRM a medida**: el operador tiene en un solo lugar
el historial de todos sus clientes y en qué quedó cada conversación.

---

## Stack tecnológico

| Capa | Tecnología | Rol |
|---|---|---|
| **Framework** | Next.js 16 (App Router) · React 19 | Renderizado híbrido, rutas, API |
| **Lenguaje** | TypeScript | Tipado estricto end-to-end |
| **Estilos** | Tailwind CSS 4 + design tokens | Sistema visual coherente |
| **Animación** | Framer Motion | Microinteracciones, reveals (respeta reduced-motion) |
| **Validación** | Zod | Esquema compartido cliente/servidor |
| **Base de datos** | Supabase (PostgreSQL) | Persistencia de leads en producción |
| **Email** | Resend | Aviso por cada solicitud |
| **Automatización** | Webhook (n8n) | Integración opcional a CRM/Sheets |
| **Analytics** | Plausible | Medición de conversiones, privacy-first |
| **Deploy** | Vercel / Netlify | Hosting serverless, edge |

Decisiones de ingeniería destacadas: **almacén con adaptador dual** (archivo
local en desarrollo, Supabase en producción, sin cambiar código);
**autenticación sin dependencias** mediante cookie firmada con HMAC; y
**renderizado determinista** (cero valores aleatorios en render) para garantizar
estabilidad y performance.

---

## Beneficios para el negocio

- **Ningún cliente se pierde.** Cada interesado queda registrado, con respaldo y
  seguimiento — el activo comercial más valioso de un operador que inicia.
- **Posicionamiento premium inmediato.** El sitio ubica a la marca en la
  categoría de aviación ejecutiva, justificando el precio del servicio.
- **El argumento de venta, articulado.** La calculadora de tiempo convierte una
  intuición ("es más rápido") en una comparación concreta y persuasiva.
- **Operación más simple.** Un solo interlocutor, un solo panel, respuestas con
  un clic. Menos fricción para cerrar vuelos.
- **Medible y escalable.** Con analytics y captación instrumentadas, cada peso
  invertido en difusión se puede medir contra leads reales.
- **Bajo riesgo legal.** Redacción prudente y datos de operador verificables,
  apropiados para un sector regulado.

---

## Roadmap futuro

El sistema está diseñado para crecer con el negocio:

- **Contenido real:** fotografía y video aéreo profesional del avión y la cabina
  —el mayor salto de conversión disponible—.
- **SEO local y Google Business** para capturar búsquedas de intención alta
  ("taxi aéreo San Fernando", "charter Buenos Aires").
- **Campañas de performance** (Google / Instagram Ads) apalancando los eventos de
  conversión ya instrumentados.
- **Versión multilingüe** (inglés) para turismo ejecutivo y corporativo
  internacional.
- **Panel ampliado:** exportación a Excel, métricas de conversión por canal,
  pipeline avanzado y recordatorios de seguimiento.
- **Automatización de cotización** y notificaciones push al operador en tiempo
  real.

---

## En síntesis

Para Aero Ejecutivo SF, ZENTRA Studio no entregó una página: entregó un **sistema
comercial completo** que captura, registra y gestiona clientes, con una estética
a la altura de la aviación privada. La promesa central, cumplida en producto:

> **Nunca más se pierde un cliente, y cada vuelo que se vende arranca acá.**

---

*¿Tenés un proyecto que merece este nivel? — **ZENTRA Studio** · [studio-zentra.com](https://studio-zentra.com/)*
