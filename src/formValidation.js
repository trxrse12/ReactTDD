// a validator
export const required = description => value =>
  !value || value.trim() === ''
    ? description
    : undefined;

// another validator
export const match = (re, description) => value =>
  !value.match(re) ? description : undefined;

// function that is composing the validators
export const list = (...validators) => value =>
  validators.reduce(
    (result, validator) => result || validator(value),
    undefined
  );

export const hasError = (validationErrors, fieldName) =>
  validationErrors[fieldName] !== undefined;

// function that validates many fields in one go
export const validateMany = (validators, fields) =>
  Object.entries(fields).reduce(
    (result, [name, value]) => ({
      ...result,
      [name]: validators[name](value)
    }),
    {}
  );

export const anyErrors = errors =>
  Object.values(errors).some(error => error !== undefined);