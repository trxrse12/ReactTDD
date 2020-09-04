import { required, match, list, hasError, validateMany } from '../src/formValidation';

describe('the required validator', () => {
  const validationMessage = 'The field cannot be empty';
  const callValidator = (validationMessage, fieldValue) => {
    const validator = required(validationMessage);
    return validator(fieldValue);
  };
  it('returns undefined if the field value exists and is text', () => {
    const fieldValue = '123';
    expect(callValidator(validationMessage, fieldValue)).not.toBeDefined();
  });
  it('returns the actual validation message if the field is undefined', () => {
    const fieldValue = undefined;
    expect(callValidator(validationMessage, fieldValue)).toMatch(validationMessage);
  });
  it('returns the actual validation message if the field is null', () => {
    const fieldValue = null;
    const res = callValidator(validationMessage, fieldValue);
    expect(callValidator(validationMessage, fieldValue)).toMatch(validationMessage);
  });
  it('returns the actual validation message if the field is empty string', () => {
    const fieldValue = '';
    expect(callValidator(validationMessage, fieldValue)).toMatch(validationMessage);
  });
});

describe('the match validator', () => {
  const re = new RegExp(/^[0-9+()\- ]*$/);
  const validationMessage = 'The field doesn\'t match the necessary format';
  const callMatchValidator = (re, validationMessage, fieldValue) => {
    const validator = match(re, validationMessage);
    return validator(fieldValue);
  };
  it('returns undefined if the field value conforms to the regexp', () => {
    const fieldValue = '123';
    expect(callMatchValidator(re, validationMessage, fieldValue)).not.toBeDefined();
  });
  it('returns the actual validation message if the field is undefined', () => {
    const fieldValue = undefined;
    expect(callMatchValidator(re, validationMessage, fieldValue)).toMatch(validationMessage);
  });
  it('returns the actual validation message if the field is null', () => {
    const fieldValue = null;
    expect(callMatchValidator(re, validationMessage, fieldValue)).toMatch(validationMessage);
  });
  it('returns the actual validation message if the field is empty string', () => {
    const fieldValue = '';
    expect(callMatchValidator(re, validationMessage, fieldValue)).toMatch(validationMessage);
  });
  it('returns the actual validation message if the field does not fit the regexp', () => {
    const fieldValue = '...';
    expect(callMatchValidator(re, validationMessage, fieldValue)).toMatch(validationMessage);
  });
});

describe('the list validator composer', () => {
  const requiredValidationMessage = 'The field is required';
  const matchValidationMessage = 'The field does not fit the format requirements';
  const re = new RegExp(/^[0-9+()\- ]*$/);
  const requiredValidator = required(requiredValidationMessage);
  const matchValidator = match(re, matchValidationMessage);
  const validators = [requiredValidator, matchValidator];
  const callListComposer = list(...validators);
  it('returns undefined if the field is filled with a value that fits the regexp', () => {
    const fieldValue = "123";
    expect(callListComposer(fieldValue)).not.toBeDefined();
  });
  it('returns the actual validation message if the field is undefined', () => {
    const fieldValue = undefined;
    expect(callListComposer(fieldValue)).toMatch(requiredValidationMessage);
  });
  it('returns the actual validation message if the field is not undefined but it does not fit the format', () => {
    const fieldValue = '...';
    expect(callListComposer(fieldValue)).toMatch(matchValidationMessage);
  });
});

describe('the hasError', () => {
  it('returns undefined if the validationErrors object is missing for a specific field', () => {
    const validationErrors = {};
    expect(hasError(validationErrors, 'myField')).toEqual(false);
  });
  it('returns true if the validationErrors object is not undefined for a specific field', () => {
    const validationErrors = {
      myField: '',
    };
    expect(hasError(validationErrors, 'myField')).toEqual(true);
  });
});

describe('the validateMany() function', () => {
  const requiredValidationMessage = 'The field is required';
  const matchValidationMessage = 'Only numbers, spaces and these symbols are allowed: ( ) + -';
  const re = new RegExp(/^[0-9+()\- ]*$/);
  const requiredValidator = required(requiredValidationMessage);
  const matchValidator = match(re, matchValidationMessage);
  const validators = {
    firstName: requiredValidator,
    lastName: requiredValidator,
    phoneNumber: list(
      required('Phone number is required'),
      match(
        /^[0-9+()\- ]*$/,
        matchValidationMessage
      )
    )
  };

  const validFields = {
    firstName: 'Remus',
    lastName: 'Sepp',
    phoneNumber: '123456'
  };

  const partiallyValidFields = {
    firstName: '',
    lastName: 'Sepp',
    phoneNumber: '123456'
  };

  const invalidFields = {
    firstName: '',
    lastName: '',
    phoneNumber: '...'
  };

  it('returns undefined if the set of fields is valid', () => {
    const res = validateMany(validators, validFields);
    expect(res).toBeDefined();
    expect(res).toEqual({
      firstName: undefined,
      lastName: undefined,
      phoneNumber: undefined,
    })
  });

  it('returns the validation message for the corresponding missing field', () => {
    const res = validateMany(validators, partiallyValidFields);
    expect(res).toBeDefined();
    expect(res).toEqual({
      firstName: requiredValidationMessage,
      lastName: undefined,
      phoneNumber: undefined,
    })
  });

  it('returns the validation message for the corresponding missing field', () => {
    const res = validateMany(validators, invalidFields);
    expect(res).toBeDefined();
    expect(res).toEqual({
      firstName: requiredValidationMessage,
      lastName: requiredValidationMessage,
      phoneNumber: matchValidationMessage,
    })
  });
});