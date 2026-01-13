use serde::{Deserialize, Serialize};
use std::time::Instant;

#[derive(Debug, Serialize, Deserialize)]
pub struct ScanResult {
    pub vulnerabilities: Vec<Vulnerability>,
    pub severity_score: u32,
    pub scan_duration_ms: u64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Vulnerability {
    pub vuln_type: String,
    pub severity: String,
    pub description: String,
    pub location: String,
    pub recommendation: String,
}

pub struct VulnerabilityScanner;

impl VulnerabilityScanner {
    pub async fn scan_url(url: &str) -> Result<ScanResult, Box<dyn std::error::Error>> {
        let start = Instant::now();
        let mut vulnerabilities = Vec::new();

        println!("🔍 Scanning URL: {}", url);

        // Check if URL is valid
        if !url.starts_with("http://") && !url.starts_with("https://") {
            return Err("URL must start with http:// or https://".into());
        }

        // Perform security checks
        vulnerabilities.extend(Self::check_security_headers(url).await?);
        vulnerabilities.extend(Self::check_ssl(url).await?);
        vulnerabilities.extend(Self::check_common_vulns(url).await?);

        let severity_score = Self::calculate_severity(&vulnerabilities);
        
        println!("✅ Scan completed. Found {} vulnerabilities", vulnerabilities.len());

        Ok(ScanResult {
            vulnerabilities,
            severity_score,
            scan_duration_ms: start.elapsed().as_millis() as u64,
        })
    }

    async fn check_security_headers(url: &str) -> Result<Vec<Vulnerability>, Box<dyn std::error::Error>> {
        let mut vulns = Vec::new();
        
        let client = reqwest::Client::builder()
            .danger_accept_invalid_certs(true)
            .timeout(std::time::Duration::from_secs(10))
            .build()?;
            
        match client.get(url).send().await {
            Ok(response) => {
                let headers = response.headers();
                
                if !headers.contains_key("strict-transport-security") {
                    vulns.push(Vulnerability {
                        vuln_type: "Missing HSTS Header".to_string(),
                        severity: "Medium".to_string(),
                        description: "HTTP Strict Transport Security (HSTS) header not found. This allows downgrade attacks.".to_string(),
                        location: url.to_string(),
                        recommendation: "Add 'Strict-Transport-Security: max-age=31536000; includeSubDomains' header".to_string(),
                    });
                }
                
                if !headers.contains_key("x-frame-options") {
                    vulns.push(Vulnerability {
                        vuln_type: "Missing X-Frame-Options".to_string(),
                        severity: "Medium".to_string(),
                        description: "X-Frame-Options header not set. Site may be vulnerable to clickjacking attacks.".to_string(),
                        location: url.to_string(),
                        recommendation: "Add 'X-Frame-Options: DENY' or 'X-Frame-Options: SAMEORIGIN' header".to_string(),
                    });
                }
                
                if !headers.contains_key("x-content-type-options") {
                    vulns.push(Vulnerability {
                        vuln_type: "Missing X-Content-Type-Options".to_string(),
                        severity: "Low".to_string(),
                        description: "X-Content-Type-Options header not found. Browser may interpret files as different MIME type.".to_string(),
                        location: url.to_string(),
                        recommendation: "Add 'X-Content-Type-Options: nosniff' header".to_string(),
                    });
                }
                
                if !headers.contains_key("content-security-policy") {
                    vulns.push(Vulnerability {
                        vuln_type: "Missing Content-Security-Policy".to_string(),
                        severity: "High".to_string(),
                        description: "Content Security Policy (CSP) not implemented. Site may be vulnerable to XSS attacks.".to_string(),
                        location: url.to_string(),
                        recommendation: "Implement a strong Content-Security-Policy header to prevent XSS attacks".to_string(),
                    });
                }
            }
            Err(e) => {
                println!("⚠️  Could not fetch headers: {}", e);
            }
        }
        
        Ok(vulns)
    }

    async fn check_ssl(url: &str) -> Result<Vec<Vulnerability>, Box<dyn std::error::Error>> {
        let mut vulns = Vec::new();
        
        if url.starts_with("http://") && !url.contains("localhost") {
            vulns.push(Vulnerability {
                vuln_type: "Insecure Connection (HTTP)".to_string(),
                severity: "Critical".to_string(),
                description: "Website is using HTTP instead of HTTPS. All data is transmitted in plaintext.".to_string(),
                location: url.to_string(),
                recommendation: "Implement HTTPS with a valid SSL/TLS certificate. Use Let's Encrypt for free certificates.".to_string(),
            });
        }
        
        Ok(vulns)
    }

    async fn check_common_vulns(url: &str) -> Result<Vec<Vulnerability>, Box<dyn std::error::Error>> {
        let mut vulns = Vec::new();
        
        // Check for common exposed files
        let sensitive_paths = vec![
            "/.git/config",
            "/.env",
            "/config.php",
            "/wp-config.php",
            "/admin",
            "/phpmyadmin",
        ];
        
        let client = reqwest::Client::builder()
            .danger_accept_invalid_certs(true)
            .timeout(std::time::Duration::from_secs(5))
            .build()?;
        
        for path in sensitive_paths {
            let test_url = format!("{}{}", url.trim_end_matches('/'), path);
            
            if let Ok(response) = client.get(&test_url).send().await {
                if response.status().is_success() {
                    vulns.push(Vulnerability {
                        vuln_type: "Sensitive File Exposed".to_string(),
                        severity: "High".to_string(),
                        description: format!("Sensitive file or directory accessible: {}", path),
                        location: test_url,
                        recommendation: "Restrict access to sensitive files and directories. Use .htaccess or server configuration.".to_string(),
                    });
                }
            }
        }
        
        Ok(vulns)
    }

    fn calculate_severity(vulnerabilities: &[Vulnerability]) -> u32 {
        vulnerabilities.iter().map(|v| match v.severity.as_str() {
            "Critical" => 10,
            "High" => 7,
            "Medium" => 4,
            "Low" => 1,
            _ => 0,
        }).sum()
    }
}