use actix_web::{web, App, HttpServer, middleware, HttpResponse, HttpRequest};
use actix_cors::Cors;
use serde::{Deserialize, Serialize};

mod models;
mod services;

#[derive(Debug, Serialize, Deserialize)]
struct ScanRequest {
    url: String,
    #[serde(rename = "scanType")]
    scan_type: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct ErrorResponse {
    error: String,
    message: String,
}

async fn health_check() -> HttpResponse {
    HttpResponse::Ok().json(serde_json::json!({
        "status": "healthy",
        "service": "vulnerability-scanner"
    }))
}

async fn handle_options(_req: HttpRequest) -> HttpResponse {
    HttpResponse::Ok().finish()
}

async fn scan_endpoint(
    scan_req: web::Json<ScanRequest>,
) -> HttpResponse {
    println!("📨 Received scan request:");
    println!("   URL: {}", scan_req.url);
    println!("   Type: {}", scan_req.scan_type);
    
    // Validate URL
    if scan_req.url.is_empty() {
        return HttpResponse::BadRequest().json(ErrorResponse {
            error: "Invalid input".to_string(),
            message: "URL cannot be empty".to_string(),
        });
    }

    if !scan_req.url.starts_with("http://") && !scan_req.url.starts_with("https://") {
        return HttpResponse::BadRequest().json(ErrorResponse {
            error: "Invalid URL".to_string(),
            message: "URL must start with http:// or https://".to_string(),
        });
    }
    
    // Perform the scan
    match services::scanner::VulnerabilityScanner::scan_url(&scan_req.url).await {
        Ok(result) => {
            println!("✅ Scan completed successfully");
            HttpResponse::Ok().json(result)
        },
        Err(e) => {
            eprintln!("❌ Scan error: {}", e);
            HttpResponse::InternalServerError().json(ErrorResponse {
                error: "Scan failed".to_string(),
                message: e.to_string(),
            })
        }
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    
    // Simple console logging
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    println!("🚀 Starting Vulnerability Scanner API...");

    // Connect to MySQL
    let database_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "mysql://root@localhost:3306/vuln_scanner".to_string());
    
    println!("📊 Connecting to MySQL database...");
    println!("   Connection string: {}", database_url);
    
    let pool = sqlx::mysql::MySqlPool::connect(&database_url)
        .await
        .expect("Failed to connect to MySQL. Make sure XAMPP MySQL is running!");

    println!("✅ Database connected successfully!");
    println!("🌐 Server starting on http://0.0.0.0:8080");
    println!("📡 Available endpoints:");
    println!("   - GET  /health");
    println!("   - POST /api/scan");

    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);
        
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .app_data(web::JsonConfig::default().limit(4096))
            .wrap(cors)
            .wrap(middleware::Logger::default())
            .route("/health", web::get().to(health_check))
            .route("/api/scan", web::post().to(scan_endpoint))
    })
    .bind(("0.0.0.0", 8080))?
    .workers(4)
    .run()
    .await
}