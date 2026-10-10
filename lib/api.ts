import {
  BreakerStatus,
  EngineMetrics,
  Order,
  OrderBookSnapshot,
  Side,
  Trade,
} from './types';

const LOCAL_API_URL = 'http://localhost:8080';
const RAILWAY_API_URL = 'https://orderpulse-mtx.up.railway.app';

export function getApiBaseUrl(): string {
  if (typeof window === 'undefined') return LOCAL_API_URL;
  const isLocal =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';
  return isLocal ? LOCAL_API_URL : RAILWAY_API_URL;
}

export function getWsUrl(): string {
  if (typeof window === 'undefined') return 'ws://localhost:8080/ws';
  const isLocal =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';
  if (isLocal) {
    return 'ws://localhost:8080/ws';
  }
  return 'wss://orderpulse-mtx.up.railway.app/ws';
}

export async function fetchOrderBook(): Promise<OrderBookSnapshot | null> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/api/book`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchBreakerStatus(): Promise<BreakerStatus | null> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/api/breaker`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchMetrics(): Promise<EngineMetrics | null> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/api/metrics`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchTrades(limit = 30): Promise<Trade[]> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/api/trades?limit=${limit}`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function fetchOrders(limit = 30): Promise<Order[]> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/api/orders?limit=${limit}`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function submitOrder(params: {
  participantId: string;
  symbol: string;
  side: Side;
  priceTicks: number;
  quantity: number;
}): Promise<{ success: boolean; message?: string; order?: Order }> {
  const requestId = `REQ-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  try {
    const res = await fetch(`${getApiBaseUrl()}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        requestId,
        participantId: params.participantId,
        symbol: params.symbol,
        side: params.side,
        priceTicks: params.priceTicks,
        quantity: params.quantity,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return {
        success: false,
        message: data.errorMessage || data.error || 'Failed to submit order',
      };
    }
    return { success: true, order: data.order };
  } catch (err: any) {
    return { success: false, message: err.message || 'Network connection failed' };
  }
}

export async function cancelOrder(orderId: string): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/api/orders/${orderId}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, message: data.errorMessage || data.error || 'Failed to cancel' };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message || 'Network error' };
  }
}

export async function triggerScenario(scenario: string): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/api/admin/scenario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, message: data.error || 'Scenario failed' };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to trigger scenario' };
  }
}

export async function resumeTrading(token = 'demo-admin-secret-mtx-2026'): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/api/admin/resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': token,
      },
      body: JSON.stringify({ adminToken: token }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, message: data.error || data.message || 'Resume failed' };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message || 'Network error' };
  }
}

export async function resetReferencePrice(
  newPriceRupees: number,
  reason: string,
  token = 'demo-admin-secret-mtx-2026'
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/api/admin/reference`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': token,
      },
      body: JSON.stringify({
        referencePriceRupees: newPriceRupees,
        reason,
        adminToken: token,
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, message: data.error || data.message || 'Reset failed' };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message || 'Network error' };
  }
}
