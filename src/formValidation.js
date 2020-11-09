// a validator that accepts as input a string
export const required = description => value =>
  !value || value.trim() === ''
    ? description
    : undefined;

// another validator
export const match = (re, description) => value => {
  if (!value) {
    return description;
  }
  return !value.match(re) ? description : undefined;
};


// function that is composing the validators
export const list = (...validators) => value =>
  validators.reduce(
    (result, validator) => result || validator(value),
    undefined
  );

// returns true if there is a value inserted for the field name in discussion
export const hasError = (validationErrors, fieldName) =>
  validationErrors[fieldName] !== undefined;

// function that validates many fields in one go
// it accepts a "validators" object, one that has a separate entry
//    for each form's field, entry that has a corresponding validator function
//
// Obs. It is necessary that validators has EXACT the same fields as the fields object
export const validateMany = (validators, fields) => {
  console.log('MMMMMMMMMMMMMMMMMMMM fields=', fields);
  return Object.entries(fields).reduce(
    (result, [name, value]) => ({
      ...result,
      [name]: validators[name](value)
    }),
    {}
  );
};


export const anyErrors = errors =>
  Object.values(errors).some(error => error !== undefined);