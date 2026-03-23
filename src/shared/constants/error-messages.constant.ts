export const ERROR_MESSAGES = {
  required: 'This field is required.',

  minLength: (min: number) => `Minimum ${min} characters.`,
  maxLength: (max: number) => `Maximum ${max} characters.`,
  exactLength: (len: number) => `Must be exactly ${len} characters.`,

  invalidType: 'Invalid value.',
  invalidBoolean: 'Must be true or false.',
  invalidEmail: 'Invalid email format.',
  invalidUrl: 'Invalid URL format.',
  invalidUuid: 'Invalid UUID format.',
  invalidDate: 'Invalid date format.',
  invalidEnum: (allowedValues: string[]) =>
    `Invalid value. Allowed values are: ${allowedValues.join(', ')}.`,

  positiveNumber: 'Value must be greater than 0.',
  nonNegativeNumber: 'Value cannot be negative.',
  minValue: (min: number) => `Value must be at least ${min}.`,
  maxValue: (max: number) => `Value must be at most ${max}.`,

  minPasswordLength: (min: number) => `Password must be at least ${min} characters.`,
} as const;
