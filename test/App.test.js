// valid tests are the ones with , as the ones with .skip were part of the old
//    architecture, the one without React Router


import React, {useState, useCallback} from 'react';
import {Link, Switch} from 'react-router-dom';
import {
  click,
  className,
  createShallowRenderer,
  type, childrenOf, id, prop
} from "./shallowHelpers";
import {createContainer} from '../test/domManipulator';
import {App, MainScreen} from '../src/App';
import {AppointmentsDayViewLoader} from "../src/AppointmentsDayViewLoader";
import {AppointmentFormLoader} from "../src/AppointmentFormLoader";
import {AppointmentForm} from "../src/AppointmentForm";
import {CustomerForm} from "../src/CustomerForm";
import {CustomerSearch} from "../src/CustomerSearch/CustomerSearch";
import {CustomerSearchRoute} from "../src/CustomerSearchRoute";

describe('Main screen', () => {
  let render, child, elementMatching;

  beforeEach(() => {
    ({render, child, elementMatching} = createShallowRenderer())
  });

  it('renders a button bas as the first child', () => {
    render(<MainScreen />);
    expect(child(0).type).toEqual('div');
    expect(child(0).props.className).toEqual('button-bar');
  });

  it('renders an AppointmentsDayViewLoader', () => {
    render(<MainScreen/>);
    expect(
      elementMatching(type(AppointmentsDayViewLoader))
    ).toBeDefined();
  });

  it('renders a link to /addCustomer', () => {
    render(<MainScreen/>);
    const links = childrenOf(
      elementMatching(className('button-bar'))
    );
    expect(links[0].type).toEqual(Link);
    expect(links[0].props.to).toEqual('/addCustomer');
    expect(links[0].props.className).toContain('button');
    expect(links[0].props.children).toEqual(
      'Add customer and appointment'
    )
  });

  it('renders a link to /searchCustomer', () => {
    render(<MainScreen/>);
    const links = childrenOf(
      elementMatching(className('button-bar'))
    );
    expect(links[1].type).toEqual(Link);
    expect(links[1].props.to).toEqual('/searchCustomer');
    expect(links[1].props.className).toContain('button');
    expect(links[1].props.children).toEqual(
      'Search customers'
    )
  });
});

describe('App', () => {
  let render, elementMatching, child;
  let historySpy;

  beforeEach(() => {
    ({render, elementMatching, child} = createShallowRenderer());
    historySpy = jest.fn();
  });

  const customer={id: 123};

  const childRoutes = () =>
    childrenOf(elementMatching(type(Switch)));

  const routeFor = path => childRoutes().find(prop('path', path));

  it('renders the MainScreen as the default route', () => {
    render(<App/>);
    const routes = childRoutes();
    const lastRoute = routes[routes.length - 1];
    expect(lastRoute.props.component).toEqual(MainScreen);
  });

  describe('within /addCustomer route', () => {
    // Route test of categ #1 (see 309 my notes)
    it('renders CustomerForm at the /addCustomer', () => {
      render(<App/>);
      expect(
        // routeFor('/addCustomer').props.render().type
        routeFor('/addCustomer').props.component
      ).toEqual(CustomerForm);
    });

    // Route test of categ #2 (see 309 my notes) not necessary here, as <CustomerForm/>
    //  doesn't have any param passed into it

    // Route test of categ #3 (see 309 my notes)
    // it('navigates to /addAppointment after the CustomerForm is submitted', () => {
    //   render(<App history={{push: historySpy}} />);
    //   const onSave = routeFor('/addCustomer').props.render().props.onSave;
    //   onSave(customer);
    //   expect(historySpy).toHaveBeenCalledWith('/addAppointment');
    // });
  });

  describe('within /searchCustomers route', () => {
    let dispatchSpy;
    beforeEach(() => {
      dispatchSpy = jest.fn();
    });

    //Route test of categ #1 (see 309 my notes)
    it('renders CustomerSearchRoute at the /searchCustomers', () => {
      render(<App/>);
      expect(
        routeFor('/searchCustomers').props.render().type
      ).toEqual(CustomerSearchRoute);
    });

    const renderSearchActionsForCustomer = customer => {
      render(<App
        history={{ push: historySpy }}
        setCustomerForAppointment={dispatchSpy}
      />);
      const customerSearchContainer = routeFor(
        '/searchCustomers'
      ).props.render();
      const searchActionComponentProp =
        customerSearchContainer.props.renderCustomerActions;
      return searchActionComponentProp(customer);
    };
    // Route test of categ #3 (see 309 my notes)
    it('passes a button to the CustomerSearch, button named Create Appointment', () => {
      const button = childrenOf(
        renderSearchActionsForCustomer()
      )[0];
      expect(button).toBeDefined();
      expect(button.type).toEqual('button');
      expect(button.props.role).toEqual('button');
      expect(button.props.children).toEqual('Create appointment');
    });

    // Route test of categ #3 (see 309 my notes)
    it('navigates to /addAppointment when clicking the Create appointment button', () => {
      const button = childrenOf(
        renderSearchActionsForCustomer()
      )[0];
      click(button);
      expect(historySpy).toHaveBeenCalledWith('/addAppointment');
    });
    // Route test of categ #3 (see 309 my notes)
    // it('passes saved customer to AppointmentFormLoader when clicking the Create appointment button', () => {
    //   const button = childrenOf(
    //     renderSearchActionsForCustomer(customer)
    //   )[0];
    //   click(button);
    //   const appointmentForm = routeFor('/addAppointment').props.render();
    //   expect(appointmentForm.props.customer).toEqual(customer);
    // })
    it('dispatches SET_CUSTOMER_FOR_APPOINTMENT when clicking the Create appointment button', async() => {
      const button = childrenOf(
        renderSearchActionsForCustomer(customer)
      )[0];
      click(button);
      expect(dispatchSpy).toHaveBeenCalledWith(customer);
    });
  });

  describe('within /addAppointment route', () => {
    // Route test of categ #1 (see 309 my notes)
    it('renders AppointmentFormLoader at /addAppointment', () => {
      render(<App/>);
      expect(
        routeFor('/addAppointment').props.component
      ).toEqual(AppointmentFormLoader);
    });

    // Route test of categ #2 (see 309 my notes)
    // it('passes saved customer to AppointmentFormLoader after the CustomerForm is submitted', () => {
    //   render(<App history={{push: historySpy}}/>);
    //   const onSave = routeFor('/addCustomer').props.render().props.onSave;
    //   onSave(customer);
    //   let renderFunc = routeFor('/addAppointment').props.render;
    //   expect(renderFunc().props.customer).toEqual(customer);
    // });

    // Route test of categ #3 (see 309 my notes)
    // it.skip('navigates to / after AppointmentFormLoader is saved', () => {
    //   render(<App history={{push: historySpy}} />);
    //   const onSave = routeFor('/addAppointment').props.render().props.onSave;
    //   onSave();
    //   expect(historySpy).toHaveBeenCalledWith('/');
    // });
  });

  it.skip('initially shows the AppointmentDayViewLoader', () => {
    render(<App/>);
    expect(
      elementMatching(type(AppointmentsDayViewLoader))
    ).toBeDefined();
  });

  it.skip('has a button bar as the first child', () => {
    render(<App/>);
    expect(child(0).type).toEqual('div');
    expect(child(0).props.className).toEqual('button-bar');
  });

  it.skip('has a button to initiate add customer and appointment action', () => {
    render(<App />);
    const buttons = childrenOf(
      elementMatching(className('button-bar'))
    );
    expect(buttons[0].type).toEqual('button');
    expect(buttons[0].props.children).toEqual(
      'Add customer and appointment'
    );
  });

  const beginAddingCustomerAndAppointment = () => {
    render(<App/>);
    click(elementMatching(id('addCustomer')));
  };

  it.skip('displays the CustomerForm when button is clicked', async () => {
    beginAddingCustomerAndAppointment();
    expect(elementMatching(type(CustomerForm))).toBeDefined()
  });

  it.skip('hides the AppointmentDayViewLoader when button is clicked', async () => {
    beginAddingCustomerAndAppointment();
    expect(elementMatching(type(AppointmentsDayViewLoader))).not.toBeDefined();
  });

  it.skip('hides the button bar when CustomerForm is being displayed', async () =>{
    beginAddingCustomerAndAppointment();
    expect(elementMatching(className('button-bar'))).not.toBeTruthy();
  });

  const saveCustomer = customer =>
    elementMatching(type(CustomerForm)).props.onSave(customer);
  it.skip('displays the AppointmentFormLoader after the CustomerForm is submitted', async() => {
    beginAddingCustomerAndAppointment();
    saveCustomer();
    expect(
      elementMatching(type(AppointmentFormLoader))).toBeDefined();
  });

  // it('passes the customer to the AppointmentForm', async () => {
  //   const customer = {id: 123};
  //   beginAddingCustomerAndAppointment();
  //   saveCustomer(customer);
  //   expect(elementMatching(type(AppointmentFormLoader)).props.customer).toBe(customer);
  // });

  const saveAppointment = () => elementMatching(type(AppointmentFormLoader)).props.onSave();
  it.skip('renders AppointmentDayViewLoader after AppointmentForm is submitted', async() => {
    beginAddingCustomerAndAppointment();
    saveCustomer();
    saveAppointment();
    expect(type(AppointmentsDayViewLoader)).toBeDefined();
  });

  describe('search customers', () => {

    it.skip('has a button to initiate searching customers', () => {
      render(<App />);
      const buttons = childrenOf(
        elementMatching(className('button-bar'))
      );
      expect(buttons[1].type).toEqual('button');
      expect(buttons[1].props.children).toEqual(
        'Search customers'
      );
    });

    const beginSearchCustomer = async () => {
      render(<App
        history={{push: historySpy}}
          setCustomerForAppointment={dispatchSpy}
          />);
          click(elementMatching(id('searchCustomers')));
    };
    it.skip('displays the CustomerSearch when button is clicked', async() => {
      beginSearchCustomer();
      expect(elementMatching(type(CustomerSearch))).toBeDefined();
    });

    it.skip('hides the AppointmentDayViewLoader when button is clicked', async() => {
      beginSearchCustomer();
      expect(elementMatching(type(AppointmentsDayViewLoader))).not.toBeDefined();
    });

    it.skip('hides the button bar when CustomerSearch is being displayed', async () => {
      beginSearchCustomer();
      expect(elementMatching(className('button-bar'))).not.toBeTruthy();
    });

    const renderSearchActionsForCustomer = customer => {
      beginSearchCustomer();
      const customerSearch = elementMatching(type(CustomerSearch));
      const searchActionsComponent = customerSearch.props.renderCustomerActions;
      return searchActionsComponent(customer);
    };

    it.skip('passes a button to the CustomerSearch named Create appointment', async() => {
      const button = childrenOf(
        renderSearchActionsForCustomer()
      )[0];
      expect(button).toBeDefined();
      expect(button.type).toEqual('button');
      expect(button.props.role).toEqual('button');
      expect(button.props.children).toEqual('Create appointment');
    });

    it.skip('clicking appointment button shows the appointment form for that customer', async () => {
      const customer={id: 123};
      const button = childrenOf(
        renderSearchActionsForCustomer()
      )[0];
      click(button);
      // The two lines below produce an "Invalid Hook" error, which I don't know how to solve (yet)
      // expect(elementMatching(AppointmentFormLoader)).not.toBeNull();
      // expect(elementMatching(AppointmentFormLoader).props.customer).toBe(customer);
    });
  });
});

