/**
 * Swish Handel API client (v2).
 *
 * Uses Node.js https module with PKCS#12 client certificate (mTLS).
 * Docs: https://developer.swish.nu/api/payment-request/v2
 */
import https from "https";
import { randomUUID } from "crypto";
import type { SwishConfig } from "./paymentConfig";

const PROD_HOST = "cpc.getswish.net";
const TEST_HOST = "mss.cpc.getswish.net";

export interface SwishPaymentRequest {
  /** Swish merchant alias, e.g. "1234679304" */
  payeeAlias: string;
  /** Amount in SEK (integer or up to 2 decimals) */
  amount: number;
  currency?: "SEK";
  /** Optional order message (max 50 chars) */
  message?: string;
  /** URL where Swish calls back when payment is done */
  callbackUrl: string;
  /** Optional: payer's Swish number (for M-Commerce; omit for E-Commerce QR) */
  payerAlias?: string;
}

export interface SwishPaymentResponse {
  /** UUID of the payment request (from Location header) */
  id: string;
  /** Token for mobile deeplink */
  token?: string;
}

export interface SwishPaymentStatus {
  id: string;
  status: "CREATED" | "PAID" | "DECLINED" | "ERROR" | "CANCELLED";
  amount?: number;
  payerAlias?: string;
  errorCode?: string;
  errorMessage?: string;
}

function makeAgent(cfg: SwishConfig): https.Agent {
  return new https.Agent({
    pfx: Buffer.from(cfg.certBase64, "base64"),
    passphrase: cfg.certPassword,
    // If custom CA provided (Swish root cert), use it — otherwise default Node CAs
    ...(cfg.caBase64 ? { ca: Buffer.from(cfg.caBase64, "base64") } : {}),
    rejectUnauthorized: !cfg.testMode, // relax in test mode if needed
  });
}

function swishRequest<T = unknown>(
  cfg: SwishConfig,
  method: "GET" | "POST" | "DELETE" | "PUT",
  path: string,
  body?: object,
): Promise<{ status: number; headers: Record<string, string | string[]>; data: T }> {
  return new Promise((resolve, reject) => {
    const host = cfg.testMode ? TEST_HOST : PROD_HOST;
    const payload = body ? JSON.stringify(body) : undefined;

    const options: https.RequestOptions = {
      hostname: host,
      path,
      method,
      agent: makeAgent(cfg),
      headers: {
        "Content-Type": "application/json",
        ...(payload ? { "Content-Length": Buffer.byteLength(payload) } : {}),
      },
    };

    const req = https.request(options, (res) => {
      let raw = "";
      res.on("data", (chunk: Buffer) => (raw += chunk.toString()));
      res.on("end", () => {
        let data: T;
        try {
          data = raw ? (JSON.parse(raw) as T) : ({} as T);
        } catch {
          data = raw as unknown as T;
        }
        resolve({
          status: res.statusCode ?? 0,
          headers: res.headers as Record<string, string | string[]>,
          data,
        });
      });
    });

    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

/** Create a Swish E-Commerce payment request. Returns request ID + token. */
export async function createSwishPayment(
  cfg: SwishConfig,
  req: SwishPaymentRequest,
): Promise<SwishPaymentResponse> {
  const instructionUUID = randomUUID().replace(/-/g, "").toUpperCase();
  const path = `/swish-cpcapi/api/v2/paymentrequests/${instructionUUID}`;

  const body = {
    payeeAlias: req.payeeAlias,
    amount: req.amount,
    currency: req.currency ?? "SEK",
    callbackUrl: req.callbackUrl,
    message: req.message?.slice(0, 50) ?? "STEP prenumeration",
    ...(req.payerAlias ? { payerAlias: req.payerAlias } : {}),
  };

  const res = await swishRequest(cfg, "PUT", path, body);

  if (res.status !== 201) {
    throw new Error(`Swish error ${res.status}: ${JSON.stringify(res.data)}`);
  }

  // Extract ID from Location header: …/paymentrequests/{id}
  const location = String(res.headers["location"] ?? "");
  const id = location.split("/").pop() ?? instructionUUID;
  const token = String(res.headers["paymentrequesttoken"] ?? "");

  return { id, token };
}

/** Poll the status of a Swish payment request. */
export async function getSwishPaymentStatus(
  cfg: SwishConfig,
  id: string,
): Promise<SwishPaymentStatus> {
  const path = `/swish-cpcapi/api/v2/paymentrequests/${id}`;
  const res = await swishRequest<SwishPaymentStatus>(cfg, "GET", path);
  return res.data;
}

/** Cancel a pending Swish payment request. */
export async function cancelSwishPayment(cfg: SwishConfig, id: string): Promise<void> {
  const path = `/swish-cpcapi/api/v2/paymentrequests/${id}`;
  await swishRequest(cfg, "DELETE", path);
}

/** Generate a Swish deeplink URL (opens Swish app on the same device). */
export function swishDeeplink(token: string, callbackUrl: string): string {
  return `swish://paymentrequest?token=${encodeURIComponent(token)}&callbackurl=${encodeURIComponent(callbackUrl)}&defaultview=qr`;
}
