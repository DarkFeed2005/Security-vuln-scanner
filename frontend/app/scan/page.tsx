'use client';

import { useState } from 'react';

interface ScanFormData {
  url: string;
  scanType: 'quick' | 'deep' | 'comprehensive';
}

interface Vulnerability {
  vuln_type: string;
  severity: string;
  description: string;
  location: string;
  recommendation: string;
}

interface ScanResult {
  vulnerabilities: Vulnerability[];
  severity_score: number;
  scan_duration_ms: number;
}

export default function ScanPage() {
  const [results, setResults] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<ScanFormData>({
    url: '',
    scanType: 'quick'
  });

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch {
      return false;
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResults(null);

    // Validation
    if (!formData.url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!validateUrl(formData.url)) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    setLoading(true);
    
    try {
      console.log('🔍 Sending scan request...');
      console.log('URL:', formData.url);
      console.log('Scan Type:', formData.scanType);
      
      const response = await fetch('http://localhost:8080/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: formData.url,
          scanType: formData.scanType
        }),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || `Server error: ${response.statusText}`;
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      console.log('✅ Scan results:', result);
      setResults(result);
    } catch (err) {
      console.error('❌ Scan error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Network error. Please check if the backend is running.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string): string => {
    const severityLower = severity.toLowerCase();
    switch (severityLower) {
      case 'critical': return 'border-red-700 bg-red-50';
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getSeverityBadgeColor = (severity: string): string => {
    const severityLower = severity.toLowerCase();
    switch (severityLower) {
      case 'critical': return 'bg-red-700 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const clearForm = () => {
    setFormData({ url: '', scanType: 'quick' });
    setResults(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              🔐 Security Vulnerability Scanner
            </h1>
            <p className="text-gray-300 text-base md:text-lg">
              Analyze websites for security vulnerabilities and weaknesses
            </p>
          </div>

          {/* Scan Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 shadow-2xl border border-white/20 mb-8">
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 font-semibold text-white text-lg">
                  Target URL
                </label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full p-4 border border-gray-300 rounded-lg bg-white/90 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900"
                  disabled={loading}
                />
                {error && (
                  <div className="mt-3 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <p className="text-red-300 text-sm font-medium">⚠️ {error}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block mb-2 font-semibold text-white text-lg">
                  Scan Type
                </label>
                <select
                  value={formData.scanType}
                  onChange={(e) => setFormData({ ...formData, scanType: e.target.value as any })}
                  className="w-full p-4 border border-gray-300 rounded-lg bg-white/90 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900"
                  disabled={loading}
                >
                  <option value="quick">⚡ Quick Scan (Fast, Basic Checks)</option>
                  <option value="deep">🔍 Deep Scan (Thorough Analysis)</option>
                  <option value="comprehensive">🎯 Comprehensive Scan (Full Security Audit)</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transform transition hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Scanning...
                    </span>
                  ) : (
                    '🔍 Start Security Scan'
                  )}
                </button>
                
                {results && (
                  <button
                    type="button"
                    onClick={clearForm}
                    className="px-6 py-4 bg-white/20 text-white rounded-lg font-bold hover:bg-white/30 transition"
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Results Section */}
          {results && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 shadow-2xl border border-white/20 animate-fadeIn">
              <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
                📊 Scan Results
              </h2>
              
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white/20 rounded-lg p-5 border border-white/30 hover:bg-white/25 transition">
                  <p className="text-gray-300 text-sm mb-1">Severity Score</p>
                  <p className="text-4xl font-bold text-white">{results.severity_score}</p>
                </div>
                <div className="bg-white/20 rounded-lg p-5 border border-white/30 hover:bg-white/25 transition">
                  <p className="text-gray-300 text-sm mb-1">Vulnerabilities Found</p>
                  <p className="text-4xl font-bold text-white">{results.vulnerabilities.length}</p>
                </div>
                <div className="bg-white/20 rounded-lg p-5 border border-white/30 hover:bg-white/25 transition">
                  <p className="text-gray-300 text-sm mb-1">Scan Duration</p>
                  <p className="text-4xl font-bold text-white">{results.scan_duration_ms}ms</p>
                </div>
              </div>

              {/* Vulnerabilities List */}
              <div>
                <h3 className="text-2xl font-semibold mb-5 text-white flex items-center gap-2">
                  🔓 Vulnerabilities Detected
                  <span className="text-lg font-normal text-gray-300">({results.vulnerabilities.length})</span>
                </h3>
                
                {results.vulnerabilities.length === 0 ? (
                  <div className="bg-green-500/20 border-2 border-green-500/50 rounded-lg p-8 text-center">
                    <div className="text-6xl mb-3">✅</div>
                    <p className="text-green-300 text-xl font-semibold mb-2">
                      No vulnerabilities detected!
                    </p>
                    <p className="text-green-400/80">
                      Your site appears to have good security measures in place.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {results.vulnerabilities.map((vuln, idx) => (
                      <div
                        key={idx}
                        className={`${getSeverityColor(vuln.severity)} rounded-lg p-6 border-l-4 shadow-lg hover:shadow-xl transition-all`}
                      >
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3 gap-2">
                          <h4 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                            <span className="text-xl">⚠️</span>
                            {vuln.vuln_type}
                          </h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getSeverityBadgeColor(vuln.severity)} w-fit`}>
                            {vuln.severity.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="mb-3">
                          <p className="text-sm text-gray-700 font-semibold mb-1">📍 Location:</p>
                          <p className="text-sm text-gray-800 bg-white/50 p-2 rounded break-all">{vuln.location}</p>
                        </div>
                        
                        <div className="mb-3">
                          <p className="text-sm text-gray-700 font-semibold mb-1">📝 Description:</p>
                          <p className="text-gray-800">{vuln.description}</p>
                        </div>
                        
                        <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded">
                          <p className="text-sm font-semibold text-blue-900 mb-1 flex items-center gap-2">
                            <span>💡</span> Recommendation:
                          </p>
                          <p className="text-sm text-blue-800">{vuln.recommendation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Info Section */}
          {!results && !loading && (
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">ℹ️ About This Scanner</h3>
              <div className="text-gray-300 space-y-2 text-sm md:text-base">
                <p>• Checks for missing security headers (HSTS, CSP, X-Frame-Options)</p>
                <p>• Detects insecure HTTP connections</p>
                <p>• Identifies exposed sensitive files and directories</p>
                <p>• Analyzes SSL/TLS configuration</p>
                <p>• Provides actionable recommendations for fixing vulnerabilities</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}