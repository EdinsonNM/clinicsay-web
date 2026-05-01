# ClinicSay Web

Cliente React Vite del reto ClinicSay. Esta entrega es autocontenida para poder vivir como repositorio Git independiente y consume una API compatible mediante `VITE_API_BASE_URL`.

## Requisitos

- Node.js 22 o compatible
- pnpm 9.15.4
- Docker Desktop o Docker Engine
- API ClinicSay disponible para ejecutar el flujo completo

## Variables

| Variable | Requerida | Proposito | Ejemplo |
| --- | --- | --- | --- |
| `VITE_API_BASE_URL` | Si | URL base de la API ClinicSay | `http://localhost:3000/api/v1` |

## Instalacion

```bash
pnpm install
cp .env.example .env
```

## Desarrollo

```bash
pnpm dev
```

URL esperada:

- Web: `http://localhost:5173`

## Validacion

```bash
pnpm build
pnpm test
pnpm test:cov
pnpm lint
pnpm e2e
docker compose config
```

Coverage esperado:

```text
coverage/lcov.info
```

## Docker

```bash
VITE_API_BASE_URL=http://localhost:3000/api/v1 docker compose up --build
```

El valor de `VITE_API_BASE_URL` se usa en build porque Vite empaqueta variables `VITE_*` en el cliente.

## Flujo Funcional

- Login dummy de administrador.
- Calendario de citas.
- Creacion de cita con paciente existente o nuevo.
- Filtro de doctores por especialidad.
- Detalle de cita con `include` y `fields[resource]`.
- Estados de error claros cuando la API configurada no esta disponible.

## Troubleshooting

- Si aparece `No se pudo contactar la API configurada`, revisar que `VITE_API_BASE_URL` apunte a una API activa.
- Si Docker sigue usando una URL vieja, reconstruir con `docker compose build --no-cache`.
- Si E2E falla por API no disponible, levantar primero la API o usar el compose raiz del orquestador.
