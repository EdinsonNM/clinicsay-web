FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json
RUN corepack enable && pnpm install --filter web... --frozen-lockfile

FROM deps AS build
COPY . .
RUN pnpm --filter web build

FROM node:22-alpine AS runtime
WORKDIR /app
COPY --from=build /app ./
EXPOSE 5173
CMD ["pnpm", "--filter", "web", "preview", "--host", "0.0.0.0"]
