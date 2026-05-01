FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json ./
RUN corepack enable && pnpm install --no-frozen-lockfile

FROM deps AS build
ARG VITE_API_BASE_URL=http://localhost:3000/api/v1
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
COPY . .
RUN pnpm build

FROM node:22-alpine AS runtime
WORKDIR /app
RUN corepack enable
COPY --from=build /app ./
EXPOSE 5173
CMD ["pnpm", "preview", "--host", "0.0.0.0", "--port", "5173"]
