# --- STAGE 1: Builder ---
FROM rust:1.85-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy the whole project
COPY . .

# Build the application
RUN cargo build --release

# --- STAGE 2: Runtime ---
FROM debian:bookworm-slim

WORKDIR /app

# Install only the runtime libraries needed (much smaller)
RUN apt-get update && apt-get install -y \
    libssl3 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy the binary from the builder stage to this tiny image
COPY --from=builder /app/target/release/vuln_scanner_api /app/vuln_scanner_api

# Set environment variable
ENV RUST_LOG=info

# Expose port
EXPOSE 8080

# Run the binary directly from /app
CMD ["./vuln_scanner_api"]