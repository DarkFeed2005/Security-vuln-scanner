FROM golang:1.25-alpine AS builder

WORKDIR /app

# Copy go mod files
COPY go.mod ./
RUN go mod download 2>/dev/null || true

# Copy source code
COPY . .

# Build
RUN go build -o port-scanner .

# Final stage
FROM alpine:latest

WORKDIR /app

RUN apk --no-cache add ca-certificates

# Copy binary
COPY --from=builder /app/port-scanner .

RUN chmod +x port-scanner

EXPOSE 8081

CMD ["./port-scanner"]