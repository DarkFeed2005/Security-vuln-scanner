FROM rust:1.82-slim

WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy everything
COPY . .

# Build in release mode
RUN cargo build --release

# Expose port
EXPOSE 8080

# Run the application
CMD ["./target/release/vuln_scanner_api"]