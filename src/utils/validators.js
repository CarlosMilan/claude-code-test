// Email regex: local@domain.tld — rejects leading/consecutive dots in domain,
// empty local part, and double @ signs (RFC 5321 compliant subset).
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

/**
 * Returns true if the email address is valid per RFC 5321 (subset).
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (typeof email !== 'string' || email.trim().length === 0) return false;
  return EMAIL_REGEX.test(email.trim());
}
