# Roadmap 30 días — De demo a producto comercial

*ZENTRA Studio · priorizado por impacto de negocio, no por complejidad técnica*

El producto ya está construido y deployado. El riesgo ahora no es técnico: es
**no validar mercado**. Este roadmap mueve el foco de *construir* a *vender*.

URL en vivo (demo): https://zentra-aviation-platform.vercel.app/

---

## Fase 1 · Demo → Cliente real (días 1–10)
**Objetivo: que el dueño del avión use esto como herramienta real y, si es
posible, que pague por ella.** Acá está el 80% del valor.

| Prioridad | Acción | Por qué importa | Esfuerzo |
|---|---|---|---|
| 🔴 1 | **Reunión con el dueño + demo en vivo** | El demo ES la herramienta de venta. Mostrale el panel `/admin` como cierre. | 1 reunión |
| 🔴 2 | **Cerrar el trato / acordar alcance y precio** | Valida que hay negocio antes de seguir invirtiendo. | — |
| 🔴 3 | **Recibir datos reales** (WhatsApp, email, fotos, legales, tiempos) | Sin esto no hay sitio real. Pedilos con `CLIENT_DATA_REQUIRED.md`. | cliente |
| 🟠 4 | **Conectar Supabase + Resend** | Que los leads **persistan** y llegue un email por cada consulta. Es el core del producto. | ~30 min |
| 🟠 5 | **Cargar datos en config + assets** | Editar `lib/aero.ts` + reemplazar logo/fotos. ~3 h (template ya listo). | ~3 h |
| 🟠 6 | **Dominio propio + contraseña admin fuerte** | Profesionalismo + seguridad. | ~30 min |

**Entregable de la fase:** un sitio real, en dominio propio, captando y guardando
leads del operador. **Primer ingreso + primer caso real.**

---

## Fase 2 · Cliente real → Activo de portfolio (días 10–20)
**Objetivo: convertir un proyecto en una máquina de venta para ZENTRA.**

| Prioridad | Acción | Por qué importa | Esfuerzo |
|---|---|---|---|
| 🔴 1 | **Fotos/video aéreo reales del avión** | El mayor salto de conversión y la mejor pieza de portfolio. | sesión |
| 🟠 2 | **Activar analytics (Plausible)** | Medir visitas y conversiones → números reales para vender. | ~20 min |
| 🟠 3 | **Esperar 1–2 semanas de tráfico y capturar métricas** | "Generó X consultas" vende más que cualquier feature. | pasivo |
| 🟠 4 | **Publicar el case study** (ya escrito) en studio-zentra.com | Tu vidriera. Con capturas reales + resultados. | ~2 h |
| 🟡 5 | **Publicar LinkedIn post + gig de Fiverr** (ya escritos) | Generar inbound con prueba social. | ~1 h |
| 🟡 6 | **Pedir testimonio al dueño** | Prueba social = baja la fricción de la próxima venta. | 1 pedido |

**Entregable de la fase:** un caso real con números y testimonio, publicado y
listo para atraer al próximo cliente.

---

## Fase 3 · Activo de portfolio → Producto de aviación repetible (días 20–30)
**Objetivo: que cada nuevo cliente sea casi sin costo marginal.**

| Prioridad | Acción | Por qué importa | Esfuerzo |
|---|---|---|---|
| 🟠 1 | **Outreach a 15–20 operadores de aviación** | El demo + el caso son el pitch. Acá se escala el ingreso. | continuo |
| 🟠 2 | **Definir paquetes y precios** (setup + mensual) | Productizar = vender más rápido y con recurrencia. | ~2 h |
| 🟡 3 | **Crear 1 demo de otro vertical** (escuela de vuelo o charter) | Probar que el template sirve para los 5 segmentos. Usa los flags `SECTIONS`. | ~4 h |
| 🟡 4 | **Convertir el repo en template** (GitHub template / CLI) | Lanzar un cliente en <4 h ya es posible; automatizar el setup. | ~1 día |
| 🟡 5 | **Oferta de mantenimiento mensual** | Ingreso recurrente: hosting + leads + cambios. | venta |

**Entregable de la fase:** un producto con pricing, un pipeline de prospectos y
la capacidad de lanzar un cliente nuevo en horas.

---

## Principio rector

> Cada hora invertida en **vender** (reuniones, outreach, publicar el caso) vale
> hoy más que una hora invertida en **construir** (otra sección, otra animación).
> El producto ya está. El cuello de botella es la demanda, no la oferta.

*ZENTRA Studio · [studio-zentra.com](https://studio-zentra.com/)*
