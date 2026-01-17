-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create scans table
CREATE TABLE IF NOT EXISTS scans (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    target_url VARCHAR(500) NOT NULL,
    scan_type VARCHAR(50) NOT NULL,
    results JSON,
    severity_score INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_scans_user_id (user_id),
    INDEX idx_scans_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert a test user (optional)
INSERT INTO users (id, email, password_hash) 
VALUES (UUID(), 'admin@vulnscanner.local', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eM7eU8tCh3Wy')
ON DUPLICATE KEY UPDATE email=email;
```


