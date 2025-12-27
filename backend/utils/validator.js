import validator from 'validator';

export const validateEmail = (email) => {
  return validator.isEmail(email) && email.endsWith('@jaduniv.edu.in');
};

export const sanitizeInput = (input) => {
  return validator.escape(input.trim());
};