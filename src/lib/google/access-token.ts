import { importPKCS8, SignJWT } from "jose";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPES = [
  "https://www.googleapis.com/auth/analytics.readonly",
  "https://www.googleapis.com/auth/webmasters.readonly",
].join(" ");

interface ServiceAccount {
  clientEmail: string;
  privateKey: string;
}

let cachedToken: { value: string; expiresAt: number } | null = null;
let cachedKey: { pem: string; key: CryptoKey } | null = null;

export function readServiceAccount(): ServiceAccount | null {
  const encoded = process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64?.trim();
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim();
  const source = encoded ? Buffer.from(encoded, "base64").toString("utf8") : raw;
  if (!source) return null;

  let parsed: { client_email?: string; private_key?: string };
  try {
    parsed = JSON.parse(source) as { client_email?: string; private_key?: string };
  } catch {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON.");
  }

  if (!parsed.client_email || !parsed.private_key) {
    throw new Error("The service account JSON is missing client_email or private_key.");
  }

  return {
    clientEmail: parsed.client_email,
    privateKey: parsed.private_key.replace(/\\n/g, "\n"),
  };
}

export async function getGoogleAccessToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }

  const account = readServiceAccount();
  if (!account) {
    throw new Error("Add GOOGLE_SERVICE_ACCOUNT_JSON to connect Google.");
  }

  if (!cachedKey || cachedKey.pem !== account.privateKey) {
    cachedKey = {
      pem: account.privateKey,
      key: await importPKCS8(account.privateKey, "RS256"),
    };
  }

  const assertion = await new SignJWT({ scope: SCOPES })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(account.clientEmail)
    .setSubject(account.clientEmail)
    .setAudience(TOKEN_URL)
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(cachedKey.key);

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    cache: "no-store",
  });

  const payload = (await response.json()) as { access_token?: string; expires_in?: number; error_description?: string };
  if (!response.ok || !payload.access_token) {
    throw new Error(payload.error_description || "Google did not return an access token.");
  }

  cachedToken = {
    value: payload.access_token,
    expiresAt: Date.now() + (payload.expires_in ?? 3600) * 1000,
  };
  return payload.access_token;
}
