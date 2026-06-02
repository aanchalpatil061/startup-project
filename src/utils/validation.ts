export const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const isStrongPassword = (password: string) =>
  password.length >= 8;

export const isValidRollNumber = (roll: string) =>
  roll.trim().length >= 3;

export const isValidEmployeeId = (id: string) =>
  id.trim().length >= 3;

export const passwordsMatch = (a: string, b: string) => a === b;

export const getFieldError = (value: string, field: string): string | undefined => {
  if (!value.trim()) return `${field} is required`;
  return undefined;
};
