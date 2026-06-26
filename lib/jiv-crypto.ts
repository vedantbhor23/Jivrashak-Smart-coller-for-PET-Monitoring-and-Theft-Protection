export async function sha256Hex(input: string): Promise<string> {
  const enc = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  const bytes = new Uint8Array(buf);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Demo-grade deterministic Pet ID generation based on Owner + SIM mobile numbers.
export async function generatePetId(ownerMobile: string, simMobile: string) {
  const normalized = `${ownerMobile.trim()}|${simMobile.trim()}`;
  const hash = await sha256Hex(normalized);
  // Short, display-friendly id; still collision-resistant for demo usage.
  return `JIV-${hash.slice(0, 10).toUpperCase()}`;
}

