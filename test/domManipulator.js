import ReactDOM from 'react-dom';
import ReactTestUtils, {act} from 'react-dom/test-utils';

export const withEvent = (name, value) => ({
  target: { name, value }
});

export const createContainer = () => {
  const container = document.createElement('div');

  // retrieve a form by its id:
  const form = id => container.querySelector(`form[id="${id}"]`);

  // generic TDD helper that returns the attached form'e element for any element:
  const field = (formId, name) => {
    return form(formId).elements[name];
  }

  // generic TDD helpe that searches for a label given its attached HTML element
  const labelFor = formElement =>
    container.querySelector(`label[for="${formElement}`);

  const element = selector =>
    container.querySelector(selector);

  const elements = selector =>
    Array.from(container.querySelectorAll(selector));

  const simulateEvent = eventName => (element, eventData) =>{
    ReactTestUtils.Simulate[eventName](element, eventData);
  }


  const simulateEventAndWait = eventName => async (
    element,
    eventData
  ) =>
    await act(async () =>
      ReactTestUtils.Simulate[eventName](element, eventData)
    );

  const children = element => Array.from(element.childNodes);

  return {
    render: component => {
      act(() => {
        ReactDOM.render(component, container)
      })
    },
    container,
    form,
    field,
    labelFor,
    element,
    elements,
    children,
    click: simulateEvent('click'),
    change: simulateEvent('change'),
    submit: simulateEventAndWait('submit'),
    renderAndWait: async component =>
      await act(async () => ReactDOM.render(component, container)),
    blur: simulateEvent('blur'),
  };
};

