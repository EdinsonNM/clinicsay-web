# Guía De Agentes Web

## Alcance

Este proyecto posee el frontend React Vite, Clean Architecture frontend, componentes UI, cliente API y tests frontend.
Debe poder operar como entrega autocontenida desde `apps/web`, consumiendo API solo mediante `VITE_API_BASE_URL`.

## Reglas UX

- La primera pantalla después del login debe ser una herramienta usable de gestión de citas admin.
- Implementar login dummy, calendario, creación de cita, búsqueda/creación de paciente, especialidades y doctores por especialidad.
- Hacer visible el detalle de cita y el comportamiento de proyección cuando aplique.
- Proveer estados loading, empty, error y success.
- No agregar secciones tipo marketing/landing page.

## Reglas Técnicas

- Usar TypeScript y Tailwind CSS.
- Usar la estructura `src/core`, `src/domains`, `src/infra`, `src/presentation` y `src/main`.
- Mantener schemas Zod en archivos `*.schema.ts`.
- Usar DTOs delgados con bases compartidas cuando aplique.
- Usar modelos de dominio limpios en inglés, aunque la API externa use nombres inconsistentes.
- Usar mappers `*api.mapper.ts` para traducir contratos externos a dominio.
- Usar TSyringe con `@registry()` en use cases; evitar una lista central larga de DI.
- Usar TanStack Query en `infra/hooks`.
- La capa `presentation` consume hooks y no repositories directamente.
- Usar un cliente API tipado contra la API NestJS.
- Mantener la URL base de API configurable con `VITE_API_BASE_URL`.
- No importar codigo ni configuracion interna de `apps/api`.

## Comandos

- Desde la raíz: `pnpm --filter web dev`
- Desde `apps/web`: `pnpm dev`
- Desde `apps/web`: `pnpm test`
- Desde `apps/web`: `pnpm test:coverage`
- Desde `apps/web`: `pnpm e2e`
- Desde `apps/web`: `docker compose config`
