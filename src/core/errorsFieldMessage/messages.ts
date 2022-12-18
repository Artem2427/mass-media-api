export const IS_REQUIRED = 'is required';
export const IS_STRING = 'must be a string';
export const MIN_LENGTH = (count: number) => {
  return `must be longer than or equal to ${count} characters`;
};
export const IS_EMAIL = 'must be an email';
export const IS_UUID = 'Not valid Id';
