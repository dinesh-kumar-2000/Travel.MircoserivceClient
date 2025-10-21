// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

export const getPasswordStrength = (password: string): {
  strength: 'weak' | 'medium' | 'strong';
  score: number;
} => {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z\d]/.test(password)) score++;

  if (score <= 2) return { strength: 'weak', score };
  if (score <= 4) return { strength: 'medium', score };
  return { strength: 'strong', score };
};

// Phone number validation
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  const cleaned = phone.replace(/\D/g, '');
  return phoneRegex.test(phone) && cleaned.length >= 10;
};

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Credit card validation
export const isValidCreditCard = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\D/g, '');
  if (cleaned.length < 13 || cleaned.length > 19) return false;

  // Luhn algorithm
  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

// Date validation
export const isValidDate = (date: string | Date): boolean => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};

export const isFutureDate = (date: string | Date): boolean => {
  const d = new Date(date);
  const now = new Date();
  return d > now;
};

export const isPastDate = (date: string | Date): boolean => {
  const d = new Date(date);
  const now = new Date();
  return d < now;
};

// File validation
export const isValidFileType = (
  file: File,
  allowedTypes: string[]
): boolean => {
  return allowedTypes.includes(file.type);
};

export const isValidFileSize = (file: File, maxSizeInBytes: number): boolean => {
  return file.size <= maxSizeInBytes;
};

// Subdomain validation
export const isValidSubdomain = (subdomain: string): boolean => {
  const subdomainRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;
  const reservedSubdomains = ['admin', 'www', 'api', 'app', 'mail', 'ftp'];
  return (
    subdomainRegex.test(subdomain) && !reservedSubdomains.includes(subdomain)
  );
};

// Form validation helpers
export const validateRequired = (value: any): string | null => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return 'This field is required';
  }
  return null;
};

export const validateMinLength = (
  value: string,
  minLength: number
): string | null => {
  if (value.length < minLength) {
    return `Must be at least ${minLength} characters`;
  }
  return null;
};

export const validateMaxLength = (
  value: string,
  maxLength: number
): string | null => {
  if (value.length > maxLength) {
    return `Must be no more than ${maxLength} characters`;
  }
  return null;
};

export const validateRange = (
  value: number,
  min: number,
  max: number
): string | null => {
  if (value < min || value > max) {
    return `Value must be between ${min} and ${max}`;
  }
  return null;
};

