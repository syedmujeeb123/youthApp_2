// Security utilities for input validation and sanitization

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return {
    isValid: password.length >= 6,
    message: password.length < 6 ? 'Password must be at least 6 characters long' : ''
  };
};

export const validateFormData = (formData) => {
  const errors = [];
  
  Object.entries(formData).forEach(([key, field]) => {
    if (field.value && typeof field.value === 'string') {
      const sanitized = sanitizeInput(field.value);
      if (sanitized !== field.value) {
        errors.push(`${key} contains invalid characters`);
      }
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const rateLimitCheck = (() => {
  const attempts = new Map();
  const RATE_LIMIT_WINDOW = 60000; // 1 minute
  const MAX_ATTEMPTS = 5;

  return (identifier) => {
    const now = Date.now();
    const userAttempts = attempts.get(identifier) || [];
    
    // Remove old attempts
    const recentAttempts = userAttempts.filter(time => now - time < RATE_LIMIT_WINDOW);
    
    if (recentAttempts.length >= MAX_ATTEMPTS) {
      return false; // Rate limited
    }
    
    recentAttempts.push(now);
    attempts.set(identifier, recentAttempts);
    return true; // Allowed
  };
})();
