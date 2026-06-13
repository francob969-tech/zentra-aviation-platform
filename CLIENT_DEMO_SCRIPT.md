# Guion de demo para el dueño de la aeronave

Objetivo: presentar esto como un **sistema comercial de captación de clientes**,
no como "una página". El sitio es la punta visible; lo que vende es que **cada
visitante se convierte en un lead registrado y gestionable**.

> Regla de oro: no hablés de tecnología (Next.js, Supabase, etc.). Hablás de
> **clientes, tiempo y plata**. Mostrá, no expliques.

---

## Antes de empezar (preparación, 2 min)
- Tené el sitio abierto en `localhost:3000` (o el deploy de demo) en pantalla grande.
- Tené una segunda pestaña con `/admin` ya logueada, lista para mostrar.
- Tené tu celular a mano para mostrar el WhatsApp en vivo.
- Modo demo activo: aclarale de entrada que **la marca, las fotos y los datos
  son de muestra** — "esto se personaliza con lo tuyo, hoy te muestro el motor".

---

## Guion de presentación (2 minutos)

**[0:00 — Apertura, el problema]**
> "Hoy, cuando alguien quiere un vuelo privado con vos, ¿cómo te llega? Un
> WhatsApp suelto, un llamado, un conocido. Se pierde, no queda registro, y si
> estás volando no lo ves. Te armé un sistema para que **ningún interesado se te
> escape**."

**[0:20 — La portada]**
> "Esta es la cara del negocio. Aviación privada, seria, nocturna —nada de
> avioncitos de stock—. El que entra entiende en 3 segundos: taxi aéreo privado,
> desde San Fernando, a tu medida."
*(scroll lento por el mapa de rutas animado)*
> "Mirá el mapa: San Fernando como base, las rutas a Córdoba, Mendoza, Bariloche,
> Punta del Este. Esto posiciona que ya operás regional."

**[0:50 — El argumento que cierra]**
*(scroll a la calculadora "Comprás tiempo")*
> "Este es el corazón comercial. El cliente no compra un avión, compra **tiempo**.
> Elige Córdoba: por auto 8 horas y media, comercial 4, con vos 2 y media. Le
> mostramos en números lo que gana. Eso es lo que justifica el precio del vuelo."

**[1:15 — La conversión]**
*(scroll al formulario / botón de WhatsApp)*
> "Y acá está la magia: el que se interesa, completa esto o aprieta 'Cotizar por
> WhatsApp'. Te llega el pedido **armado**: origen, destino, fecha, pasajeros,
> nombre y teléfono. No más '¿a dónde era? ¿qué día?'."

**[1:35 — El panel, el cierre de venta]**
*(cambiás a la pestaña `/admin`)*
> "Y esto es lo que **vos** ves, privado, solo con tu clave: todas las
> solicitudes en un tablero. Las marcás 'contactado', 'cotizado', 'ganado'.
> Respondés por WhatsApp con un clic. Es tu agenda de clientes. **Esto no es una
> página, es una herramienta de trabajo.**"

**[1:55 — Cierre]**
> "Le ponemos tu marca, tus fotos y tu número, y en una semana estás recibiendo
> consultas reales. ¿Lo armamos?"

---

## Qué mostrar primero (orden de impacto)
1. **Portada** (3 seg de impacto visual — define la categoría premium).
2. **Mapa de rutas** (muestra alcance/cobertura).
3. **Calculadora de tiempo** (el argumento de venta emocional + racional).
4. **Formulario + WhatsApp** (cómo entra el cliente).
5. **Panel `/admin`** (el "guau" — esto lo diferencia de cualquier web).

> No arranques por el panel. Construí el valor primero (lo que ve el cliente) y
> cerrá con el panel (lo que gana él). El orden importa.

---

## Cómo explicar el formulario de cotización
- **Qué decir:** "El interesado carga su viaje en 30 segundos: a dónde, cuándo,
  cuántos. Vos recibís todo listo para cotizar, sin ida y vuelta."
- **Mostralo en vivo:** elegí un destino, cambiá pasajeros, marcá ida y vuelta —
  que vea cómo el itinerario se arma solo a la derecha.
- **El gancho:** "Si no quiere llenar nada, tiene el botón de WhatsApp. Igual le
  llega el pedido armado a tu teléfono."

## Cómo explicar el panel de administración
- **Qué decir:** "Esta es tu bandeja privada. Cada consulta queda registrada acá,
  aunque la persona no termine de mandarte el WhatsApp."
- **Mostrá:** el listado, cambiá un estado (nuevo → contactado), agregá una nota,
  apretá 'Responder por WhatsApp'.
- **El cierre:** "Tenés el historial de todos tus clientes y en qué quedó cada
  uno. Es un mini-CRM hecho para vos."

## Cómo explicar WhatsApp + captura de leads ("doble disparo")
> Este es el concepto más fuerte, explicalo simple:
- "Cuando alguien aprieta cotizar pasan **dos cosas a la vez**: se abre tu
  WhatsApp con el mensaje listo, **y** queda guardado en tu panel."
- "Así, aunque la persona se arrepienta o no mande el WhatsApp, **el dato no se
  pierde**. Lo tenés igual y lo podés contactar vos."
- (Si pregunta por costo de WhatsApp) "Usa tu WhatsApp normal, no hay costo extra
  ni API cara. Abre el chat directo con vos."

---

## Datos que todavía necesito del cliente
Pedíselos al final, como "lo único que falta para arrancar". Lista corta para la
reunión (el detalle está en `CLIENT_DATA_REQUIRED.md`):
- **Nombre comercial y logo** (si tiene; si no, lo definimos juntos).
- **Número de WhatsApp** y **email** donde quiere recibir las consultas.
- **3 o 4 fotos del avión** (exterior, cabina, en pista). "Esto es lo que más
  vende — si no tenés buenas, te coordino una sesión."
- **Datos de la empresa**: razón social, CUIT, habilitación ANAC, matrícula
  (para el pie de página — da confianza y suele ser requerido).
- **Destinos** que más le piden y **tiempos reales** de cada tramo (para ajustar
  la calculadora).
- **Dominio** (si ya tiene; si no, lo gestiono yo).

> Framealo así: "Vos me pasás esto y yo me encargo de todo lo técnico."

---

## Posicionamiento de precio (sugerido — ajustá a tu mercado)

No vendas "una web", vendé **un sistema de captación de clientes premium**. El
ancla mental del cliente: un solo vuelo privado que cierre por la web ya paga
varias veces el sitio.

**Tres formas de presentarlo (elegí según el cliente):**

1. **Setup único (build):** posicionalo como inversión de marca + herramienta de
   ventas, no como gasto de diseño. Rango orientativo para un sitio de este nivel
   (premium, con panel y captación): **lo equivalente a 1–2 vuelos regionales**.
   Esa comparación la entiende al instante y la hace barata en su cabeza.

2. **Setup + retainer:** un precio de armado más bajo + un mensual de
   mantenimiento (ver abajo). Baja la barrera de entrada y te deja ingreso
   recurrente.

3. **Anclaje por valor:** "Si esto te trae **un cliente nuevo por mes** que no
   tenías, ¿cuánto vale?" Dejá que él ponga el número primero.

> Tips: dá UN precio con seguridad, no un menú largo. Ofrecé el sitio "llave en
> mano, con tu marca y tus fotos, funcionando en X días". Mostrá el panel ANTES
> de decir el precio — sube el valor percibido.

---

## Oferta de mantenimiento mensual (opcional, recomendada)

Posicionala como "que el sistema siga trabajando para vos":

**Plan mensual incluye (elegí qué ofrecer):**
- Hosting gestionado y dominio (que nunca se caiga ni se venza).
- El panel y la captación de leads funcionando (Supabase + email de aviso por
  cada consulta).
- Cambios menores: actualizar destinos, fotos, textos, precios.
- Reporte mensual: cuántas visitas, cuántas consultas, de dónde vienen.
- Soporte: si algo falla, lo arreglo yo.

> Pitch: "El sitio es tuyo; el mensual es para que no te tengas que preocupar de
> nada y siga generando consultas. Si un mes te trae un solo cliente, ya se pagó."

**Upsells para más adelante** (no los menciones todos en la primera reunión):
- Sesión de fotos / video aéreo del avión.
- Google Business + SEO local ("taxi aéreo San Fernando").
- Campañas de anuncios (Google/Instagram) — la web ya mide conversiones.
- Versión en inglés para turismo ejecutivo extranjero.
- Panel ampliado: exportar a Excel, métricas de conversión.

---

### Recordatorio final
Lo que estás vendiendo no es HTML. Es: **"nunca más se te pierde un cliente, y
cada vuelo que vendés arranca acá."** Si el dueño se va pensando en eso, ganaste.
