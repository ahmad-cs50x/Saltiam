interface OTPEntry {
  otp: string;
  expires: number; // timestamp in ms
  resetToken?: string;
  resetTokenExpires?: number;
}

class OTPStore {
  private store: Map<string, OTPEntry> = new Map();

  set(email: string, otp: string, ttlMs: number = 5 * 60 * 1000) {
    const expires = Date.now() + ttlMs;
    this.store.set(email, { otp, expires });
  }

  get(email: string): OTPEntry | undefined {
    const entry = this.store.get(email);
    if (!entry) return undefined;
    if (entry.expires < Date.now()) {
      this.store.delete(email);
      return undefined;
    }
    return entry;
  }

  setResetToken(email: string, ttlMs: number = 10 * 60 * 1000) {
    const entry = this.get(email);
    if (!entry) return undefined;
    const resetToken = Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
    entry.resetToken = resetToken;
    entry.resetTokenExpires = Date.now() + ttlMs;
    this.store.set(email, entry);
    return resetToken;
  }

  validateResetToken(email: string, token: string) {
    const entry = this.get(email);
    if (!entry || !entry.resetToken || !entry.resetTokenExpires) return false;
    if (entry.resetTokenExpires < Date.now()) {
      this.store.delete(email);
      return false;
    }
    return entry.resetToken === token;
  }

  delete(email: string) {
    this.store.delete(email);
  }
}

export const otpStore = new OTPStore();
