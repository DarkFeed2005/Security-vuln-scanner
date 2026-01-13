'use client';

import { useState, useEffect } from 'react';

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
  const [scanProgress, setScanProgress] = useState(0);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 95) return prev;
          return prev + Math.random() * 15;
        });
      }, 200);
      return () => clearInterval(interval);
    } else {
      setScanProgress(0);
    }
  }, [loading]);

  useEffect(() => {
    if (loading) {
      const messages = [
        '> Initializing security scanner...',
        '> Establishing secure connection...',
        '> Analyzing SSL/TLS certificates...',
        '> Checking security headers...',
        '> Scanning for vulnerabilities...',
        '> Probing common attack vectors...',
        '> Analyzing response patterns...',
        '> Compiling threat assessment...',
      ];
      
      let index = 0;
      const interval = setInterval(() => {
        if (index < messages.length) {
          setTerminalLines(prev => [...prev, messages[index]]);
          index++;
        }
      }, 400);
      
      return () => clearInterval(interval);
    } else {
      setTerminalLines([]);
    }
  }, [loading]);

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

    if (!formData.url.trim()) {
      setError('URL is required');
      return;
    }

    if (!validateUrl(formData.url)) {
      setError('Invalid URL format. Must start with http:// or https://');
      return;
    }

    setLoading(true);
    
    try {
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

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || `Error: ${response.statusText}`;
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      setScanProgress(100);
      setTimeout(() => {
        setResults(result);
      }, 500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error occurred';
      setError(errorMessage);
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  };

  const getSeverityColor = (severity: string): string => {
    const severityLower = severity.toLowerCase();
    switch (severityLower) {
      case 'critical': return 'border-l-red-500 bg-red-950/30 border-red-500/50';
      case 'high': return 'border-l-orange-500 bg-orange-950/30 border-orange-500/50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-950/30 border-yellow-500/50';
      case 'low': return 'border-l-cyan-500 bg-cyan-950/30 border-cyan-500/50';
      default: return 'border-l-gray-500 bg-gray-950/30 border-gray-500/50';
    }
  };

  const getSeverityBadge = (severity: string): string => {
    const severityLower = severity.toLowerCase();
    switch (severityLower) {
      case 'critical': return 'bg-red-500 text-black shadow-red-500/50';
      case 'high': return 'bg-orange-500 text-black shadow-orange-500/50';
      case 'medium': return 'bg-yellow-500 text-black shadow-yellow-500/50';
      case 'low': return 'bg-cyan-500 text-black shadow-cyan-500/50';
      default: return 'bg-gray-500 text-black';
    }
  };

  const getThreatLevel = (score: number): { text: string; color: string } => {
    if (score >= 50) return { text: 'CRITICAL', color: 'text-red-500' };
    if (score >= 30) return { text: 'HIGH', color: 'text-orange-500' };
    if (score >= 15) return { text: 'MEDIUM', color: 'text-yellow-500' };
    if (score > 0) return { text: 'LOW', color: 'text-cyan-500' };
    return { text: 'SECURE', color: 'text-green-500' };
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      
      {/* Glowing orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>

      <div className="relative z-10 container mx-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Cyber Header */}
          <div className="text-center mb-12 relative">
            <div className="inline-block mb-6">
              <div className="flex items-center gap-4 px-6 py-3 border border-cyan-500/30 rounded-lg bg-black/50 backdrop-blur-sm">
                <div className="relative">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                    <span className="text-2xl">🛡️</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                </div>
                <div className="text-left">
                  <h1 className="text-2xl md:text-4xl font-bold font-mono tracking-wider">
                    <span className="text-cyan-400">&lt;</span>
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                      VULN_SCANNER
                    </span>
                    <span className="text-cyan-400">/&gt;</span>
                  </h1>
                  <p className="text-cyan-500/70 text-xs font-mono mt-1">v2.5.1 | SYSTEM ONLINE</p>
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-sm md:text-base font-mono">
              [ ADVANCED THREAT DETECTION &amp; VULNERABILITY ANALYSIS BY KPOLITX ]
            </p>
          </div>

          {/* Scan Interface */}
          <div className="bg-black/40 backdrop-blur-xl rounded-lg border border-cyan-500/30 p-6 md:p-8 mb-8 shadow-2xl shadow-cyan-500/10">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-cyan-500/20">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div>
              </div>
              <span className="text-cyan-400 text-sm font-mono ml-2">SECURITY_TERMINAL://</span>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label className="block mb-3 font-mono text-cyan-400 text-sm flex items-center gap-2">
                  <span className="text-cyan-500">$</span> TARGET_URL
                </label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://target-domain.com"
                  className="w-full p-4 border border-cyan-500/30 rounded-lg bg-black/50 text-cyan-300 placeholder-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition font-mono shadow-inner"
                  disabled={loading}
                />
                {error && (
                  <div className="mt-3 p-3 bg-red-950/50 border border-red-500/50 rounded-lg">
                    <p className="text-red-400 text-sm font-mono flex items-center gap-2">
                      <span className="text-red-500">⚠</span> ERROR: {error}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block mb-3 font-mono text-cyan-400 text-sm flex items-center gap-2">
                  <span className="text-cyan-500">$</span> SCAN_MODE
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: 'quick', label: 'QUICK', icon: '⚡', desc: 'Fast scan' },
                    { value: 'deep', label: 'DEEP', icon: '🔍', desc: 'Thorough analysis' },
                    { value: 'comprehensive', label: 'FULL', icon: '🎯', desc: 'Complete audit' }
                  ].map((mode) => (
                    <label
                      key={mode.value}
                      className={`relative cursor-pointer ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                      <input
                        type="radio"
                        name="scanType"
                        value={mode.value}
                        checked={formData.scanType === mode.value}
                        onChange={(e) => setFormData({ ...formData, scanType: e.target.value as any })}
                        className="sr-only"
                        disabled={loading}
                      />
                      <div className={`p-4 border-2 rounded-lg transition-all ${
                        formData.scanType === mode.value
                          ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                          : 'border-cyan-500/30 bg-black/30 hover:border-cyan-500/50'
                      }`}>
                        <div className="text-2xl mb-2">{mode.icon}</div>
                        <div className="font-mono text-cyan-400 font-bold">{mode.label}</div>
                        <div className="text-gray-500 text-xs font-mono mt-1">{mode.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full relative overflow-hidden group"
              >
                <div className={`p-4 rounded-lg font-mono font-bold text-lg transition-all ${
                  loading
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black hover:shadow-2xl hover:shadow-cyan-500/50 transform hover:scale-[1.02]'
                }`}>
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      SCANNING... {Math.floor(scanProgress)}%
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>▶</span> INITIATE_SCAN
                    </span>
                  )}
                </div>
              </button>
            </form>

            {/* Terminal Output */}
            {loading && (
              <div className="mt-6 bg-black/80 rounded-lg border border-green-500/30 p-4 font-mono text-sm">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-green-500/20">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400">SCAN_LOG://</span>
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {terminalLines.map((line, idx) => (
                    <div key={idx} className="text-green-400 animate-pulse">
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          {results && (
            <div className="space-y-6 animate-fadeIn">
              {/* Stats Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-black/40 backdrop-blur-xl rounded-lg border border-cyan-500/30 p-6 relative overflow-hidden group hover:border-cyan-500/50 transition-all">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                    <div className="text-gray-400 text-xs font-mono mb-2">THREAT_LEVEL</div>
                    <div className={`text-3xl font-bold font-mono ${getThreatLevel(results.severity_score).color}`}>
                      {getThreatLevel(results.severity_score).text}
                    </div>
                    <div className="text-cyan-500 text-sm font-mono mt-1">SCORE: {results.severity_score}</div>
                  </div>
                </div>

                <div className="bg-black/40 backdrop-blur-xl rounded-lg border border-purple-500/30 p-6 relative overflow-hidden group hover:border-purple-500/50 transition-all">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                    <div className="text-gray-400 text-xs font-mono mb-2">VULNERABILITIES</div>
                    <div className="text-3xl font-bold font-mono text-purple-400">{results.vulnerabilities.length}</div>
                    <div className="text-purple-500 text-sm font-mono mt-1">DETECTED</div>
                  </div>
                </div>

                <div className="bg-black/40 backdrop-blur-xl rounded-lg border border-blue-500/30 p-6 relative overflow-hidden group hover:border-blue-500/50 transition-all">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                    <div className="text-gray-400 text-xs font-mono mb-2">SCAN_TIME</div>
                    <div className="text-3xl font-bold font-mono text-blue-400">{results.scan_duration_ms}</div>
                    <div className="text-blue-500 text-sm font-mono mt-1">MILLISECONDS</div>
                  </div>
                </div>

                <div className="bg-black/40 backdrop-blur-xl rounded-lg border border-green-500/30 p-6 relative overflow-hidden group hover:border-green-500/50 transition-all">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                    <div className="text-gray-400 text-xs font-mono mb-2">STATUS</div>
                    <div className="text-2xl font-bold font-mono text-green-400">COMPLETE</div>
                    <div className="text-green-500 text-sm font-mono mt-1">100%</div>
                  </div>
                </div>
              </div>

              {/* Vulnerabilities List */}
              <div className="bg-black/40 backdrop-blur-xl rounded-lg border border-cyan-500/30 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-cyan-500/20">
                  <span className="text-2xl">🔓</span>
                  <h3 className="text-2xl font-bold font-mono text-cyan-400">
                    VULNERABILITY_REPORT
                  </h3>
                  <span className="ml-auto text-cyan-500 font-mono text-sm">
                    [{results.vulnerabilities.length} FOUND]
                  </span>
                </div>

                {results.vulnerabilities.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">✓</div>
                    <div className="text-green-400 text-2xl font-bold font-mono mb-2">ALL_CLEAR</div>
                    <div className="text-gray-500 font-mono">No vulnerabilities detected</div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {results.vulnerabilities.map((vuln, idx) => (
                      <div
                        key={idx}
                        className={`border-l-4 ${getSeverityColor(vuln.severity)} rounded-lg p-6 backdrop-blur-sm hover:bg-opacity-50 transition-all group`}
                      >
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-4">
                          <h4 className="font-bold text-lg font-mono text-cyan-300 flex items-center gap-2">
                            <span className="text-red-500">[!]</span>
                            {vuln.vuln_type}
                          </h4>
                          <span className={`px-4 py-1 rounded-full text-xs font-bold font-mono ${getSeverityBadge(vuln.severity)} shadow-lg w-fit`}>
                            {vuln.severity.toUpperCase()}
                          </span>
                        </div>

                        <div className="space-y-3 font-mono text-sm">
                          <div>
                            <span className="text-gray-500">LOCATION:</span>
                            <div className="text-cyan-400 bg-black/50 p-2 rounded mt-1 break-all">{vuln.location}</div>
                          </div>

                          <div>
                            <span className="text-gray-500">DESCRIPTION:</span>
                            <div className="text-gray-300 mt-1">{vuln.description}</div>
                          </div>

                          <div className="bg-blue-950/30 border border-blue-500/30 rounded-lg p-4 mt-3">
                            <div className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                              <span>💡</span> RECOMMENDATION:
                            </div>
                            <div className="text-blue-300">{vuln.recommendation}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Info Panel */}
          {!results && !loading && (
            <div className="bg-black/40 backdrop-blur-xl rounded-lg border border-cyan-500/30 p-6 md:p-8">
              <h3 className="text-xl font-bold font-mono text-cyan-400 mb-4 flex items-center gap-2">
                <span>ℹ</span> SCANNER_CAPABILITIES
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-sm">
                {[
                  '→ SSL/TLS Certificate Analysis',
                  '→ Security Header Validation',
                  '→ Common Vulnerability Detection',
                  '→ Exposed File Scanning',
                  '→ HTTP Security Assessment',
                  '→ Real-time Threat Analysis'
                ].map((item, idx) => (
                  <div key={idx} className="text-gray-400 flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}