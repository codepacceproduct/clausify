// Minimal TOTP utilities (RFC 6238) without external deps
export function generateBase32Secret(length = 20): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  const bytes = new Uint8Array(length)
  if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
    crypto.getRandomValues(bytes)
  } else {
    for (let i = 0; i < length; i++) bytes[i] = Math.floor(Math.random() * 256)
  }
  let bits = ''
  for (let i = 0; i < bytes.length; i++) bits += bytes[i].toString(2).padStart(8, '0')
  const pad = (5 - (bits.length % 5)) % 5
  bits = bits + '0'.repeat(pad)
  let out = ''
  for (let i = 0; i < bits.length; i += 5) out += alphabet[parseInt(bits.slice(i, i + 5), 2)]
  return out
}

export function base32ToBuffer(base32: string): Uint8Array {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  const clean = base32.replace(/=+$/g, '').toUpperCase()
  let bits = ''
  for (let i = 0; i < clean.length; i++) {
    const val = alphabet.indexOf(clean[i])
    if (val === -1) continue
    bits += val.toString(2).padStart(5, '0')
  }
  const bytes: number[] = []
  for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(parseInt(bits.slice(i, i + 8), 2))
  return new Uint8Array(bytes)
}

async function hmacSha1(key: Uint8Array, msg: Uint8Array): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, msg)
  return new Uint8Array(sig)
}

export async function verifyTOTP(secretBase32: string, token: string, step = 30, window = 1, digits = 6): Promise<boolean> {
  const key = base32ToBuffer(secretBase32)
  const time = Math.floor(Date.now() / 1000)
  const validate = async (counter: number) => {
    const ctrBuf = new Uint8Array(8)
    for (let i = 7; i >= 0; i--) {
      ctrBuf[i] = counter & 0xff
      counter = Math.floor(counter / 256)
    }
    const hmac = await hmacSha1(key, ctrBuf)
    const offset = hmac[hmac.length - 1] & 0x0f
    const binCode = ((hmac[offset] & 0x7f) << 24) | (hmac[offset + 1] << 16) | (hmac[offset + 2] << 8) | (hmac[offset + 3])
    const otp = (binCode % 10 ** digits).toString().padStart(digits, '0')
    return otp === token
  }
  const t0 = Math.floor(time / step)
  for (let w = -window; w <= window; w++) {
    if (await validate(t0 + w)) return true
  }
  return false
}
