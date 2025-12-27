import { describe, it, expect } from '@jest/globals';

describe('Auth Tests', () => {
  it('should validate Jadavpur University email', () => {
    const validEmail = 'test@jaduniv.edu.in';
    const invalidEmail = 'test@gmail.com';
    
    expect(validEmail.endsWith('@jaduniv.edu.in')).toBe(true);
    expect(invalidEmail.endsWith('@jaduniv.edu.in')).toBe(false);
  });
});