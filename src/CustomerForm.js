import React, {useState} from 'react';
import {anyErrors, hasError, list, match, required, validateMany} from './formValidation';
import {addCustomer} from "./sagas/customer";
import { connect } from 'react-redux';

const Error = () => (
  <div className="error">An error occurred during the save.</div>
);

const validators = {
  firstName: required('First name is required'),
  lastName: required('Last name is required'),
  phoneNumber: list(
    required('Phone number is required'),
    match(
      /^[0-9+()\- ]*$/,
      'Only numbers, spaces and these symbols are allowed: ( ) + -'
    )
  ),
};

const mapToStateProps = () => ({});
const mapDispatchToProps = {
  addCustomerRequest: customer => ({
    type: 'ADD_CUSTOMER_REQUEST',
    customer,
  })
};

export const CustomerForm = connect(
    mapToStateProps,
    mapDispatchToProps
  )(
    ({
    firstName,
    lastName,
    phoneNumber,
    onSave,
    addCustomerRequest
                             }) => {
    const [submitting, setSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [error, setError] = useState(false);
    const [customer, setCustomer] = useState({
      firstName,
      lastName,
      phoneNumber,
    });


    function validateSingleField(fieldName, fieldValue) {
      const result = validateMany(validators, {
        [fieldName]: fieldValue,
      });
      setValidationErrors({
        ...validationErrors, ...result,
      });
    }

    const handleChange = ({target}) => {
      setCustomer(customer => ({
        ...customer,
        [target.name]: target.value
      }));
      if (hasError(validationErrors, target.name)){
        validateSingleField(target.name, target.value);
      }
    };

    const doSave = async () => {
      setSubmitting(true);
      const result = await window.fetch('/customers', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(customer),
      });
      setSubmitting(false);
      if (result.ok) {
        setError(false);
        const customerWithId = await result.json();
        onSave(customerWithId)
      } else if (result.status === 422) {
        const response = await result.json();
        setValidationErrors(response.errors);
      } else {
        setError(true);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const validationResult = validateMany(validators, customer);
      if (!anyErrors(validationResult)){
        await doSave();
        addCustomerRequest(customer);
      } else {
        setValidationErrors(validationResult);
      }
    };

    const handleBlur = ({target}) => {
      const result = validateMany(validators, {
        [target.name]: target.value,
      });
      setValidationErrors({
        ...validationErrors, ...result,
      })
    };

    const renderError = fieldName => {
      if (hasError(validationErrors, fieldName)){
        return (
          <span className="error">
            {validationErrors[fieldName]}
          </span>
        );
      }
    };

    return (
      <form id="customer" onSubmit={handleSubmit}>
        { error ? <Error /> : null }
        <label htmlFor="firstName">First name</label>
        <input
          type="text"
          name="firstName"
          id="firstName"
          value={firstName}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {renderError('firstName')}

        <label htmlFor="lastName">Last name</label>
        <input
          type="text"
          name="lastName"
          id="lastName"
          value={lastName}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {renderError('lastName')}

        <label htmlFor="phoneNumber">Phone number</label>
        <input
          type="text"
          name="phoneNumber"
          id="phoneNumber"
          value={phoneNumber}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {renderError('phoneNumber')}

        <input type="submit" value="Add" disabled={submitting}/>
        {submitting ? <span className="submittingIndicator" /> : null}
      </form>
    )
  }
);

CustomerForm.defaultProps = {
  onSave: () => {}
}