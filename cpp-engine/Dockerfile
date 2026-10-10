# Multi-stage Dockerfile for MTX Matching Engine
FROM gcc:13 AS builder

RUN apt-get update && apt-get install -y \
    cmake \
    libboost-all-dev \
    libpq-dev \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .

RUN mkdir -p build && cd build && \
    cmake -DCMAKE_BUILD_TYPE=Release .. && \
    cmake --build . --parallel $(nproc)

# Minimal runtime image
FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y \
    libstdc++6 \
    libpq5 \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=builder /app/build/matching_engine_server /app/
COPY --from=builder /app/build/matching_engine_tests /app/
COPY --from=builder /app/build/matching_engine_benchmark /app/

EXPOSE 8080
ENV PORT=8080
ENV SYMBOL=DEMO
ENV BREAKER_REFERENCE_PRICE_RUPEES=100.00
ENV BREAKER_BAND_PERCENT=5.0
ENV DEMO_ADMIN_TOKEN=demo-admin-secret-mtx-2026

CMD ["/app/matching_engine_server"]
