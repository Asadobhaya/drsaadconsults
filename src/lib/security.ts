/**
 * Comprehensive Input Sanitization, Validation & Rate Limiting Module
 * Defense against XSS, Injection, Malicious Files, and Brute Force Attacks
 */

// --- 1. HTML / Script Sanitization (XSS Prevention) ---
export function sanitizeText(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

// Strips HTML tags completely for plain text fields
export function stripHtml(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input.replace(/<\/?[^>]+(>|$)/g, '').trim();
}

// --- 2. Input Format Validators ---
export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  // RFC 5322 standard compliant regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  if (!phone || phone.length > 25) return false;
  // Accepts international format e.g. +92 300 1234567, 03001234567
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
  return /^\+?[0-9]{8,15}$/.test(cleaned);
}

export function isValidDate(dateStr: string): boolean {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const d = new Date(dateStr);
  return d instanceof Date && !isNaN(d.getTime());
}

export function isValidTime(timeStr: string): boolean {
  if (!timeStr) return false;
  const clean = timeStr.trim().split(' ')[0];
  const parts = clean.split(':');
  if (parts.length < 2) return false;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  return !isNaN(h) && !isNaN(m) && h >= 0 && h <= 23 && m >= 0 && m <= 59;
}

export function isValidReferenceNo(refNo: string): boolean {
  if (!refNo) return false;
  // Format: SAAD-YYYY-XXXXXX
  return /^SAAD-\d{4}-\d{6}$/i.test(refNo.trim());
}

// --- 3. Secure File Upload Validator ---
export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.webp'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB limit

export function validateUploadedFile(file: File): FileValidationResult {
  if (!file) {
    return { valid: false, error: 'No file provided.' };
  }

  // Enforce size limit
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: 'File size exceeds maximum permitted limit (5MB).' };
  }

  if (file.size === 0) {
    return { valid: false, error: 'Uploaded file is empty.' };
  }

  // Check extension against dangerous list
  const name = file.name.toLowerCase();
  const ext = name.substring(name.lastIndexOf('.'));
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return { valid: false, error: 'Unsupported file type. Only PDF and JPG/PNG/WebP images are allowed.' };
  }

  // Prevent double extension attacks (e.g., invoice.pdf.exe)
  const segments = name.split('.');
  if (segments.length > 2) {
    const dangerous = ['exe', 'bat', 'cmd', 'sh', 'php', 'js', 'vbs', 'html', 'htm', 'dll', 'scr'];
    if (segments.some(seg => dangerous.includes(seg))) {
      return { valid: false, error: 'Disallowed file name extension detected.' };
    }
  }

  // Check declared MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { valid: false, error: 'Invalid file format. Please upload a standard medical document (PDF or Image).' };
  }

  return { valid: true };
}

// --- 4. Client-Side Abuse & Rate Limiting ---
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

class MemoryRateLimiter {
  private store: Map<string, RateLimitRecord> = new Map();

  /**
   * Check if action is allowed. If allowed, increments count.
   * @param key Unique identifier (e.g., 'login', 'contact-form', 'appointment-create')
   * @param maxRequests Maximum requests allowed in window
   * @param windowMs Window duration in milliseconds
   */
  isAllowed(key: string, maxRequests: number, windowMs: number): { allowed: boolean; remaining: number; retryAfterSec?: number } {
    const now = Date.now();
    const record = this.store.get(key);

    if (!record || now > record.resetTime) {
      this.store.set(key, { count: 1, resetTime: now + windowMs });
      return { allowed: true, remaining: maxRequests - 1 };
    }

    if (record.count >= maxRequests) {
      const retryAfterSec = Math.ceil((record.resetTime - now) / 1000);
      return { allowed: false, remaining: 0, retryAfterSec };
    }

    record.count += 1;
    return { allowed: true, remaining: maxRequests - record.count };
  }

  reset(key: string): void {
    this.store.delete(key);
  }
}

export const rateLimiter = new MemoryRateLimiter();
