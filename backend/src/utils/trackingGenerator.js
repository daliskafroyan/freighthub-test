import crypto from 'crypto';

/**
 * Generate a unique tracking number for orders
 * Format: TRK + timestamp (last 6 digits) + random string (6 chars)
 * Example: TRK859243AB7D2F
 */
export function generateTrackingNumber() {
  // Get timestamp and take last 6 digits
  const timestamp = Date.now().toString().slice(-6);
  
  // Generate random alphanumeric string (6 characters)
  const randomBytes = crypto.randomBytes(3);
  const randomString = randomBytes.toString('hex').toUpperCase();
  
  return `TRK${timestamp}${randomString}`;
}

/**
 * Validate tracking number format
 * @param {string} trackingNumber - The tracking number to validate
 * @returns {boolean} - True if valid format
 */
export function isValidTrackingNumberFormat(trackingNumber) {
  // Should be TRK + 12 characters (6 digits + 6 hex chars)
  const trackingRegex = /^TRK\d{6}[A-F0-9]{6}$/;
  return trackingRegex.test(trackingNumber);
}

/**
 * Generate multiple unique tracking numbers (for batch operations)
 * @param {number} count - Number of tracking numbers to generate
 * @returns {string[]} - Array of unique tracking numbers
 */
export function generateMultipleTrackingNumbers(count) {
  const trackingNumbers = new Set();
  
  while (trackingNumbers.size < count) {
    trackingNumbers.add(generateTrackingNumber());
    // Small delay to ensure different timestamps if generating many quickly
    if (trackingNumbers.size < count) {
      // Use different random bytes to avoid duplicates
      continue;
    }
  }
  
  return Array.from(trackingNumbers);
}

/**
 * Extract information from tracking number (for debugging/logging)
 * @param {string} trackingNumber - The tracking number to analyze
 * @returns {object} - Object with extracted information
 */
export function analyzeTrackingNumber(trackingNumber) {
  if (!isValidTrackingNumberFormat(trackingNumber)) {
    return { valid: false, error: 'Invalid tracking number format' };
  }
  
  const timestampPart = trackingNumber.slice(3, 9); // Remove TRK prefix, get 6 digits
  const randomPart = trackingNumber.slice(9); // Get last 6 characters
  
  return {
    valid: true,
    prefix: 'TRK',
    timestamp: timestampPart,
    randomPart: randomPart,
    fullNumber: trackingNumber
  };
}

export default {
  generateTrackingNumber,
  isValidTrackingNumberFormat,
  generateMultipleTrackingNumbers,
  analyzeTrackingNumber
}; 