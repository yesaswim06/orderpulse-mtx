/**
 * Central API & WebSocket configuration for OrderPulse.
 * Handles automatic seamless connection to Railway Cloud Backend:
 * https://orderpulse-mtx.up.railway.app
 * 
 * Connected to live Railway PostgreSQL 16 (ACID Relational WAL)
 * and MongoDB Atlas v7.0 (AWS Mumbai Cluster).
 */

export const RAILWAY_API_URL = 'https://orderpulse-mtx.up.railway.app';
export const RAILWAY_WS_URL = 'wss://orderpulse-mtx.up.railway.app/ws';

export const getBackendTarget = (): 'railway' | 'local' => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('orderpulse_backend_target');
    if (saved === 'local' || saved === 'railway') return saved;
    // Default to Railway Cloud for production resilience & zero-config local dev
    return 'railway';
  }
  return 'railway';
};

export const setBackendTarget = (target: 'railway' | 'local'): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('orderpulse_backend_target', target);
  }
};

export const getApiBase = (): string => {
  const target = getBackendTarget();
  if (target === 'local') return '';
  return RAILWAY_API_URL;
};

export const getWsUrl = (): string => {
  const target = getBackendTarget();
  if (target === 'local' && typeof window !== 'undefined') {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}/ws`;
  }
  return RAILWAY_WS_URL;
};
