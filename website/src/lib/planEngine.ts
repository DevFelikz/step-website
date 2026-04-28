/**
 * Plan engine — generates a month-by-month delivery schedule for a STEP subscription.
 *
 * Nicotine step-down logic:
 *  - Start at `startStrengthMg`
 *  - Decrease each month toward 0 mg
 *  - Uses a roughly even step-down curve depending on duration
 */

export interface DeliverySlot {
  deliveryIndex: number; // 1-based
  strengthMg: number;
  quantityCans: number;
  scheduledDate: Date;
}

/**
 * Standard step-down curves for common durations.
 * Values represent nicotine strength in mg per portion for each month.
 * Index 0 = month 1 (first delivery).
 */
const STEP_DOWN_CURVES: Record<number, number[]> = {
  3: [20, 10, 4],
  6: [20, 14, 10, 6, 3, 0],
  12: [20, 16, 12, 10, 8, 6, 5, 4, 3, 2, 1, 0],
};

/**
 * Generate a custom step-down curve from startStrengthMg to 0 over `months` steps.
 * Uses a slightly front-weighted linear ramp so early drops feel intentional.
 */
function buildCurve(startMg: number, months: number): number[] {
  if (months <= 0) return [startMg];
  const curve: number[] = [];
  for (let i = 0; i < months; i++) {
    const raw = startMg * (1 - i / (months - 1));
    curve.push(Math.max(0, Math.round(raw)));
  }
  // Force last month to exactly 0
  curve[months - 1] = 0;
  return curve;
}

/**
 * Resolve which step-down curve to use.
 * If startStrengthMg matches the standard 20mg curves, use them as-is.
 * Otherwise scale the nearest duration curve proportionally.
 */
function resolveCurve(startStrengthMg: number, durationMonths: number): number[] {
  const standard = STEP_DOWN_CURVES[durationMonths];
  if (standard) {
    if (startStrengthMg === 20) return standard;
    // Scale proportionally
    return standard.map((v) => Math.max(0, Math.round((v / 20) * startStrengthMg)));
  }
  return buildCurve(startStrengthMg, durationMonths);
}

export interface PlanEngineInput {
  startStrengthMg: number;
  durationMonths: number;
  /** Cans per month. Default 1 (maps to whatever quantity the plan specifies). */
  quantityCans?: number;
  /** Date of first delivery. Defaults to today. */
  startDate?: Date;
}

/**
 * Generate the full delivery schedule for a subscription.
 */
export function generateDeliverySchedule(input: PlanEngineInput): DeliverySlot[] {
  const {
    startStrengthMg,
    durationMonths,
    quantityCans = 1,
    startDate = new Date(),
  } = input;

  const curve = resolveCurve(startStrengthMg, durationMonths);

  return curve.map((strengthMg, i) => {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);
    date.setHours(12, 0, 0, 0); // Noon UTC-ish — avoids DST edge cases

    return {
      deliveryIndex: i + 1,
      strengthMg,
      quantityCans,
      scheduledDate: date,
    };
  });
}

/** Human-readable label for a strength value, e.g. "6 mg" or "0 mg (nicotinfritt)" */
export function strengthLabel(mg: number): string {
  if (mg === 0) return "0 mg — nicotinfritt";
  return `${mg} mg`;
}

/** Status badge config for admin/konto display */
export const DELIVERY_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Planerad", color: "text-step-muted" },
  SHIPPED: { label: "Skickad", color: "text-amber-300" },
  DELIVERED: { label: "Levererad", color: "text-emerald-400" },
  SKIPPED: { label: "Hoppades", color: "text-step-muted/60" },
  FAILED: { label: "Misslyckades", color: "text-red-400" },
};

export const SUBSCRIPTION_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Avvaktar betalning", color: "text-amber-300" },
  ACTIVE: { label: "Aktiv", color: "text-emerald-400" },
  PAUSED: { label: "Pausad", color: "text-amber-200" },
  CANCELLED: { label: "Avslutad", color: "text-red-400" },
};

export const ORDER_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Väntar", color: "text-amber-300" },
  PAID: { label: "Betald", color: "text-emerald-400" },
  FAILED: { label: "Misslyckades", color: "text-red-400" },
  REFUNDED: { label: "Återbetald", color: "text-step-muted" },
};
