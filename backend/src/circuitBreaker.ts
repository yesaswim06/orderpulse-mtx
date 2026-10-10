import { BreakerState, BreakerStatus, ticksToRupees } from './types';

export interface BreakerAuditRecord {
  eventType: 'HALT' | 'RESUME' | 'REFERENCE_RESET';
  oldReferenceTicks: number;
  newReferenceTicks: number;
  candidateTicks: number;
  reason: string;
  sequenceId: number;
  timestampMs: number;
}

export class CircuitBreaker {
  private referencePriceTicks: number;
  private bandPercent: number;
  private lowerBandTicks: number;
  private upperBandTicks: number;
  private minHaltDurationSeconds: number;
  private state: BreakerState = 'RUNNING';
  private haltStartTimeMs: number = 0;
  private lastHaltReason: string = '';
  private lastBreachCandidateTicks: number | null = null;
  private lastBreakerSequence: number = 0;
  private auditLog: BreakerAuditRecord[] = [];

  constructor(
    initialReferenceTicks = 10000, // Rs 100.00
    bandPercent = 5.0,             // +/- 5%
    minHaltDurationSeconds = 30
  ) {
    this.referencePriceTicks = initialReferenceTicks;
    this.bandPercent = bandPercent;
    this.minHaltDurationSeconds = minHaltDurationSeconds;
    this.lowerBandTicks = 0;
    this.upperBandTicks = 0;
    this.recomputeBands();
  }

  private recomputeBands(): void {
    const delta = Math.round(this.referencePriceTicks * (this.bandPercent / 100.0));
    this.lowerBandTicks = this.referencePriceTicks - delta;
    this.upperBandTicks = this.referencePriceTicks + delta;
  }

  private updateInternalState(): void {
    if (this.state === 'HALTED') {
      const elapsedSec = (Date.now() - this.haltStartTimeMs) / 1000;
      if (elapsedSec >= this.minHaltDurationSeconds) {
        this.state = 'READY_TO_RESUME';
      }
    }
  }

  public validateExecutionPrice(candidatePriceTicks: number, sequenceId: number): { valid: boolean; reason?: string } {
    this.updateInternalState();

    if (this.state === 'HALTED') {
      return { valid: false, reason: 'Circuit breaker is currently HALTED. No trades allowed.' };
    }

    if (candidatePriceTicks < this.lowerBandTicks || candidatePriceTicks > this.upperBandTicks) {
      this.state = 'HALTED';
      this.haltStartTimeMs = Date.now();
      this.lastBreachCandidateTicks = candidatePriceTicks;
      this.lastBreakerSequence = sequenceId;

      this.lastHaltReason = `Volatility Band Breached: Candidate trade at Rs ${ticksToRupees(candidatePriceTicks).toFixed(2)} ` +
        `is outside permitted band [Rs ${ticksToRupees(this.lowerBandTicks).toFixed(2)} - Rs ${ticksToRupees(this.upperBandTicks).toFixed(2)}]. ` +
        `Reference: Rs ${ticksToRupees(this.referencePriceTicks).toFixed(2)} (+/- ${this.bandPercent}%).`;

      this.auditLog.push({
        eventType: 'HALT',
        oldReferenceTicks: this.referencePriceTicks,
        newReferenceTicks: this.referencePriceTicks,
        candidateTicks: candidatePriceTicks,
        reason: this.lastHaltReason,
        sequenceId,
        timestampMs: this.haltStartTimeMs,
      });

      return { valid: false, reason: this.lastHaltReason };
    }

    return { valid: true };
  }

  public canAcceptNewOrders(): boolean {
    this.updateInternalState();
    return this.state === 'RUNNING';
  }

  public canCancelOrders(): boolean {
    return true; // Always permitted
  }

  public resume(
    sequenceId: number,
    operatorToken: string,
    expectedToken: string,
    force: boolean = false
  ): { success: boolean; error?: string } {
    this.updateInternalState();

    if (operatorToken !== expectedToken) {
      return { success: false, error: 'Invalid demo admin token. Administrative authorization required.' };
    }

    if (this.state === 'RUNNING') {
      return { success: false, error: 'Trading engine is already RUNNING.' };
    }

    if (this.state === 'HALTED' && !force) {
      const elapsedSec = (Date.now() - this.haltStartTimeMs) / 1000;
      if (elapsedSec < this.minHaltDurationSeconds) {
        const remaining = Math.ceil(this.minHaltDurationSeconds - elapsedSec);
        return { success: false, error: `Minimum halt duration not yet elapsed. Remaining cooling period: ${remaining}s.` };
      }
    }

    this.state = 'RUNNING';
    this.lastHaltReason = '';
    this.lastBreachCandidateTicks = null;

    this.auditLog.push({
      eventType: 'RESUME',
      oldReferenceTicks: this.referencePriceTicks,
      newReferenceTicks: this.referencePriceTicks,
      candidateTicks: 0,
      reason: force ? 'Operator manual override resume initiated' : 'Operator resume initiated after cooling duration',
      sequenceId,
      timestampMs: Date.now(),
    });

    return { success: true };
  }

  public resetReferencePrice(
    newReferenceTicks: number,
    reason: string,
    sequenceId: number,
    operatorToken: string,
    expectedToken: string
  ): { success: boolean; error?: string } {
    if (operatorToken !== expectedToken) {
      return { success: false, error: 'Invalid demo admin token. Administrative authorization required.' };
    }

    if (newReferenceTicks <= 0) {
      return { success: false, error: 'Reference price ticks must be strictly positive (> 0).' };
    }

    const oldRef = this.referencePriceTicks;
    this.referencePriceTicks = newReferenceTicks;
    this.recomputeBands();
    this.state = 'RUNNING';
    this.lastHaltReason = '';
    this.lastBreachCandidateTicks = null;

    this.auditLog.push({
      eventType: 'REFERENCE_RESET',
      oldReferenceTicks: oldRef,
      newReferenceTicks,
      candidateTicks: 0,
      reason: reason || 'Operator manual reference reset',
      sequenceId,
      timestampMs: Date.now(),
    });

    return { success: true };
  }

  public getStatus(): BreakerStatus {
    this.updateInternalState();

    let remainingHaltSeconds = 0;
    if (this.state === 'HALTED') {
      const elapsedSec = (Date.now() - this.haltStartTimeMs) / 1000;
      remainingHaltSeconds = Math.max(0, Math.ceil(this.minHaltDurationSeconds - elapsedSec));
    }

    return {
      state: this.state,
      referencePriceTicks: this.referencePriceTicks,
      bandPercent: this.bandPercent,
      lowerBandTicks: this.lowerBandTicks,
      upperBandTicks: this.upperBandTicks,
      minHaltDurationSeconds: this.minHaltDurationSeconds,
      haltStartTimeMs: this.haltStartTimeMs,
      remainingHaltSeconds,
      lastHaltReason: this.lastHaltReason,
      lastBreachCandidateTicks: this.lastBreachCandidateTicks,
      lastBreakerSequence: this.lastBreakerSequence,
      settingsLabel: 'Trading Simulation Demo Policy (Demonstration Settings)',
    };
  }

  public getAuditLog(): BreakerAuditRecord[] {
    return [...this.auditLog];
  }
}
