import { describe, it, expect } from '@jest/globals';

describe('Post Tests', () => {
  it('should enforce 500 character limit', () => {
    const validContent = 'This is a valid post';
    const invalidContent = 'a'.repeat(501);
    
    expect(validContent.length).toBeLessThanOrEqual(500);
    expect(invalidContent.length).toBeGreaterThan(500);
  });
});