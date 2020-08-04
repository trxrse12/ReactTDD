import ReactDOM from 'react-dom';

export const createContainer = () => {
  const container = document.createElement('div');

  // retrieve a form by its id:
  const form = id => container.querySelector(`form[id="${id}"]`);

  // generic TDD helper that returns the attached form'e element for any element:
  const field = (formId, name) => form(formId).elements[name];

  // generic TDD helpe that searches for a label given its attached HTML element
  const labelFor = formElement =>
    container.querySelector(`label[for="${formElement}`);

  const element = selector =>
    container.querySelector(selector);

  const elements = selector =>
    Array.from(container.querySelectorAll(selector));

  return {
    render: component => ReactDOM.render(component, container),
    container,
    form,
    field,
    labelFor,
    element,
    elements,
  };
};

