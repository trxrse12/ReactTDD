import { required, match } from '../src/formValidation';

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