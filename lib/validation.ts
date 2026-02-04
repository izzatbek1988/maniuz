/**
 * Phone validation for Uzbekistan format: +998XXXXXXXXX (13 characters total)
 * Format: +998 + 9 digits = 13 characters
 */
export const validatePhone = (phone: string): boolean => {
  return /^\+998\d{9}$/.test(phone);
};

/**
 * Format phone input as user types - ensures +998 prefix and max 13 characters
 * Handles: +998XXXXXXXXX (13 chars total: + + 998 + 9 digits)
 */
export const formatPhoneInput = (input: string): string => {
  // Remove all non-digits
  const digits = input.replace(/\D/g, '');
  
  // If starts with 998, add + prefix
  if (digits.startsWith('998')) {
    const phoneDigits = digits.substring(0, 12); // 998XXXXXXXXX (12 digits)
    return '+' + phoneDigits; // +998XXXXXXXXX (13 chars total)
  }
  
  // Otherwise, ensure +998 prefix and limit to 9 digits after
  const withoutPrefix = digits.replace(/^998/, ''); // Remove leading 998 if any
  const limitedDigits = withoutPrefix.substring(0, 9);
  return '+998' + limitedDigits;
};

/**
 * Nickname validation rules:
 * - 3-20 characters
 * - Must start with a letter
 * - Lowercase a-z, 0-9, underscore allowed
 */
export const validateNickname = (nickname: string) => {
  if (nickname.length < 3) {
    return { valid: false, error: 'nickname_too_short' };
  }
  
  if (nickname.length > 20) {
    return { valid: false, error: 'nickname_too_long' };
  }
  
  // Must start with a letter and contain only lowercase letters, numbers, and underscores
  if (!/^[a-z][a-z0-9_]*$/.test(nickname)) {
    return { valid: false, error: 'nickname_invalid' };
  }
  
  return { valid: true };
};

/**
 * Format nickname input as user types
 * - Convert to lowercase
 * - Remove invalid characters
 * - Limit to 20 characters
 */
export const formatNicknameInput = (input: string): string => {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
    .substring(0, 20);
};
