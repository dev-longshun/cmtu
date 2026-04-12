FROM oven/bun:latest AS builder

WORKDIR /build
COPY web/package.json .
COPY web/bun.lock .
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install
COPY ./VERSION .
COPY ./web .
RUN echo "=== DEBUG: public/ files ===" && ls -la public/cmtu.png public/logo.png 2>&1 || true \
    && echo "=== DEBUG: cmtu.png md5 ===" && md5sum public/cmtu.png 2>&1 || true \
    && echo "=== DEBUG: logo.png md5 ===" && md5sum public/logo.png 2>&1 || true
RUN DISABLE_ESLINT_PLUGIN='true' VITE_REACT_APP_VERSION=$(cat VERSION) bun run build
RUN echo "=== DEBUG: dist/ logo files ===" && ls -la dist/cmtu.png dist/logo.png 2>&1 || true \
    && echo "=== DEBUG: dist/cmtu.png md5 ===" && md5sum dist/cmtu.png 2>&1 || true

FROM golang:alpine AS builder2
ENV GO111MODULE=on CGO_ENABLED=0

ARG TARGETOS
ARG TARGETARCH
ENV GOOS=${TARGETOS:-linux} GOARCH=${TARGETARCH:-amd64}
ENV GOEXPERIMENT=greenteagc

WORKDIR /build

ADD go.mod go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
    go mod download

COPY . .
COPY --from=builder /build/dist ./web/dist
RUN echo "=== DEBUG GO STAGE: web/dist/ logo files ===" && ls -la web/dist/cmtu.png web/dist/logo.png 2>&1 || true \
    && echo "=== DEBUG GO STAGE: cmtu.png md5 ===" && md5sum web/dist/cmtu.png 2>&1 || true
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    go build -ldflags "-s -w -X 'github.com/QuantumNous/new-api/common.Version=$(cat VERSION)'" -o new-api

FROM debian:bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates tzdata libasan8 wget \
    && rm -rf /var/lib/apt/lists/* \
    && update-ca-certificates

COPY --from=builder2 /build/new-api /
EXPOSE 3000
WORKDIR /data
ENTRYPOINT ["/new-api"]
