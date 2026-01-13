use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub id: String,
    pub email: String,
    pub password_hash: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Scan {
    pub id: String,
    pub user_id: Option<String>,
    pub target_url: String,
    pub scan_type: String,
    pub results: Option<String>,
    pub severity_score: Option<i32>,
}