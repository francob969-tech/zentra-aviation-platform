# Aero Ejecutivo SF — Guía de presentación

Esta web es una **demo premium funcional** del sitio de taxi aéreo privado.
Se muestra antes de cargar la marca, las fotos y los datos reales del operador.
Todo lo que se ve ya funciona; solo falta reemplazar contenido de muestra por
contenido real (sin tocar el diseño).

---

## Qué incluye el sitio

**Página principal** (una sola página con scroll):
- Portada con animación de radar y rutas
- Servicios (ejecutivos, regionales, corporativos, familiares, especiales)
- Sección de la aeronave (Cessna 402) con esquema
- **Mapa de rutas animado** desde San Fernando a los destinos
- **Calculadora "Comprás tiempo"** — compara auto vs aerolínea vs taxi aéreo por destino
- "Por qué elegirnos"
- **Proceso en 4 pasos** — de la consulta al despegue
- **Formulario de cotización** + preguntas frecuentes
- Llamado a la acción final y pie de página

**Página dedicada de la aeronave** (`/cessna-402`): overview, experiencia a
bordo, perfil operativo, seguridad y galería.

**Panel de administración** (`/admin`): bandeja privada donde el operador ve
cada solicitud, le cambia el estado (nuevo, contactado, cotizado, ganado,
perdido), agrega notas y responde por WhatsApp con un clic. No es visible al
público ni aparece en Google.

---

## Cómo se captan los clientes (leads)

Cuando alguien completa el formulario, pasan **dos cosas a la vez**:
1. Se **guarda la solicitud** en el sistema (aparece en el panel `/admin`).
2. Se **abre WhatsApp** con el mensaje ya armado para enviar.

Así, aunque la persona no termine de mandar el WhatsApp, **el dato no se pierde**:
queda registrado. En producción, además, llega un **email** al operador con cada
solicitud (y opcionalmente se puede conectar a una planilla o CRM).

## Cómo funciona WhatsApp

Hay un botón **"Cotizar por WhatsApp"** flotante (siempre visible, sin molestar),
más botones en la portada y junto al formulario. Todos abren un chat con el
mensaje precargado. El número sale de **una sola configuración**: cuando se
cargue el número real, se actualiza en todos lados a la vez.

---

## Qué falta cargar (datos reales)

Resumen — el detalle está en `CLIENT_DATA_REQUIRED.md`:
- Nombre comercial definitivo y **logo**
- **WhatsApp** y **email** reales
- **Dominio** final
- Datos legales: razón social, **CUIT**, **habilitación ANAC**, **matrícula**
- **Fotos reales** del Cessna 402
- **Capacidad de pasajeros** a confirmar
- **Tiempos de ruta** validados y destinos preferidos

> Importante: todo esto es **reemplazo de contenido**, no rediseño. El sitio ya
> está terminado a nivel diseño y funcionamiento.

## Redacción cuidada (sin riesgo legal)

Mientras no estén los datos del operador, los textos usan lenguaje prudente:
"servicio sujeto a disponibilidad", "operaciones coordinadas según normativa
aplicable", "tiempos estimados", "consultar disponibilidad". No se afirman
cifras de velocidad/alcance/capacidad ni certificaciones que no estén
confirmadas.

---

## Mejoras premium que se pueden sumar más adelante

- **Captación gestionada**: notificación instantánea de cada lead al WhatsApp del
  dueño + registro en planilla/CRM (servicio mensual).
- **Sesión de fotos / video aéreo** del avión (el mayor salto de conversión).
- **Google Business + SEO local** ("taxi aéreo San Fernando", "charter Buenos Aires").
- **Campañas de anuncios** (Google / Instagram) — la web ya mide conversiones.
- **Versión en inglés** para turismo ejecutivo y corporativo extranjero.
- **Panel ampliado**: exportar a Excel, métricas de conversión, mini-CRM.
- **Mantenimiento mensual**: hosting gestionado, reportes y actualización de
  destinos/tarifas.
