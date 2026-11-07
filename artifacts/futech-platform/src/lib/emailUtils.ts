/**
 * Sanitizes email strings:
 * - Trims leading and trailing whitespace
 * - Strips invisible Unicode direction marks (LRM \u200E, RLM \u200F, ZWSP, BOM)
 * - Converts Arabic-Indic numbers (٠-٩) to standard ASCII (0-9)
 * - Removes internal whitespace
 * - Converts to lowercase
 */
export function sanitizeEmail(email: string): string {
  if (!email) return '';
  return email
    .trim()
    .replace(/[\u200B-\u200D\uFEFF\u200E\u200F\u00A0\u202A-\u202E]/g, '')
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString())
    .replace(/\s+/g, '')
    .toLowerCase();
}

/**
 * Validates email format using standard web RFC 5322 pattern
 */
export function isValidEmailFormat(email: string): boolean {
  const sanitized = sanitizeEmail(email);
  if (!sanitized || sanitized.length < 5) return false;
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return re.test(sanitized);
}
