import { Order, OrderBookSnapshot, PriceLevel, Side } from './types';

export class OrderBook {
  private symbol: string;
  // Bids: priceTicks -> Order[] (FIFO)
  private bids: Map<number, Order[]> = new Map();
  // Asks: priceTicks -> Order[] (FIFO)
  private asks: Map<number, Order[]> = new Map();
  // orderId -> { side, priceTicks }
  private orderIndex: Map<string, { side: Side; priceTicks: number }> = new Map();

  constructor(symbol = 'DEMO') {
    this.symbol = symbol;
  }

  public addOrder(order: Order): void {
    const book = order.side === 'BUY' ? this.bids : this.asks;
    let queue = book.get(order.priceTicks);
    if (!queue) {
      queue = [];
      book.set(order.priceTicks, queue);
    }
    queue.push(order);
    this.orderIndex.set(order.orderId, { side: order.side, priceTicks: order.priceTicks });
  }

  public removeOrder(orderId: string): Order | null {
    const loc = this.orderIndex.get(orderId);
    if (!loc) return null;

    const book = loc.side === 'BUY' ? this.bids : this.asks;
    const queue = book.get(loc.priceTicks);
    if (!queue) {
      this.orderIndex.delete(orderId);
      return null;
    }

    const idx = queue.findIndex(o => o.orderId === orderId);
    if (idx === -1) {
      this.orderIndex.delete(orderId);
      return null;
    }

    const [removed] = queue.splice(idx, 1);
    if (queue.length === 0) {
      book.delete(loc.priceTicks);
    }
    this.orderIndex.delete(orderId);
    return removed;
  }

  public findOrder(orderId: string): Order | null {
    const loc = this.orderIndex.get(orderId);
    if (!loc) return null;

    const book = loc.side === 'BUY' ? this.bids : this.asks;
    const queue = book.get(loc.priceTicks);
    if (!queue) return null;

    return queue.find(o => o.orderId === orderId) || null;
  }

  public getBestBid(): number | null {
    if (this.bids.size === 0) return null;
    let maxPrice = -Infinity;
    for (const price of this.bids.keys()) {
      if (price > maxPrice) maxPrice = price;
    }
    return maxPrice === -Infinity ? null : maxPrice;
  }

  public getBestAsk(): number | null {
    if (this.asks.size === 0) return null;
    let minPrice = Infinity;
    for (const price of this.asks.keys()) {
      if (price < minPrice) minPrice = price;
    }
    return minPrice === Infinity ? null : minPrice;
  }

  public getSpread(): number | null {
    const bb = this.getBestBid();
    const ba = this.getBestAsk();
    if (bb !== null && ba !== null) {
      return ba - bb;
    }
    return null;
  }

  public getBidsMap(): Map<number, Order[]> {
    return this.bids;
  }

  public getAsksMap(): Map<number, Order[]> {
    return this.asks;
  }

  public getSnapshot(sequenceId: number): OrderBookSnapshot {
    const sortedBidPrices = Array.from(this.bids.keys()).sort((a, b) => b - a);
    const sortedAskPrices = Array.from(this.asks.keys()).sort((a, b) => a - b);

    const bidLevels: PriceLevel[] = sortedBidPrices.slice(0, 20).map(price => {
      const orders = this.bids.get(price) || [];
      const totalQuantity = orders.reduce((sum, o) => sum + o.remainingQuantity, 0);
      return { priceTicks: price, totalQuantity, orderCount: orders.length };
    });

    const askLevels: PriceLevel[] = sortedAskPrices.slice(0, 20).map(price => {
      const orders = this.asks.get(price) || [];
      const totalQuantity = orders.reduce((sum, o) => sum + o.remainingQuantity, 0);
      return { priceTicks: price, totalQuantity, orderCount: orders.length };
    });

    return {
      symbol: this.symbol,
      sequenceId,
      bids: bidLevels,
      asks: askLevels,
      bestBidTicks: this.getBestBid(),
      bestAskTicks: this.getBestAsk(),
      spreadTicks: this.getSpread(),
      timestampNs: Date.now() * 1000000,
    };
  }

  public clear(): void {
    this.bids.clear();
    this.asks.clear();
    this.orderIndex.clear();
  }
}
