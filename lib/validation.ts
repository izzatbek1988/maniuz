/**
 * Phone validation for Uzbekistan format: +998XXXXXXXXX (12 characters total)
 */
export const validatePhone = (phone: string): boolean => {
  return /^\+998[0-9]{9}$/.test(phone);
};

/**
 * Format phone input as user types - ensures +998 prefix and max 12 characters
 */
export const formatPhoneInput = (input: string): string => {
  // Remove all non-digit characters except +
  let cleaned = input.replace(/[^\d+]/g, '');
  
  // If doesn't start with +998, add it
  if (!cleaned.startsWith('+998')) {
    // Remove any existing + or 998 at the start
    cleaned = cleaned.replace(/^[+998]*/g, '');
    cleaned = '+998' + cleaned;
  }
  
  // Limit to 12 characters (+998 + 9 digits)
  return cleaned.substring(0, 12);
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
    return { valid: false, error: 'nickname_invalid_format' };
  }
  
  return { valid: true };
};
