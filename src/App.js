import React, { useState, useCallback } from 'react';
import {Link, Switch, Route} from 'react-router-dom';
import { AppointmentFormLoader } from './AppointmentFormLoader';
import { AppointmentsDayViewLoader } from './AppointmentsDayViewLoader';
import { CustomerForm } from './CustomerForm';
import { CustomerSearch } from './CustomerSearch/CustomerSearch';
import {CustomerSearchRoute} from "./CustomerSearchRoute";

export const MainScreen = () => (
  <React.Fragment>
    <div className="button-bar">
      <Link to={'/addCustomer'} className="button">
        Add customer and appointment
      </Link>
      <Link to={'/searchCustomer'} className="button">
        Search customers
      </Link>
    </div>
    <AppointmentsDayViewLoader/>
  </React.Fragment>
);

export const App = ({history}) => {
  const [view, setView] = useState('dayView');
  const [customer, setCustomer] = useState();

  const transitionToAddAppointment = useCallback(
    customer => {
      setCustomer(customer);
      history.push('/addAppointment')
    }, [history]);

  const transitionToAddCustomer = useCallback(
    () => setView('addCustomer'),
    []
  );

  const transitionToDayView = useCallback(
    () => history.push('/'),
    [history]
  );

  const transitionToSearchCustomers = useCallback(
    () => setView('searchCustomers'),
    []
  );

  const searchActions = (customer) => {
    return (<React.Fragment>
        <button
          role="button"
          onClick={() => transitionToAddAppointment(customer)}>
          Create appointment
        </button>
      </React.Fragment>
    );
  };

  return (
    <Switch>
      <Route
        path="/addCustomer"
        render={() => (
          <CustomerForm
            onSave={transitionToAddAppointment}
          />
        )}
      />
      <Route
        path="/searchCustomers"
        render={props => {
          return (
          <CustomerSearchRoute
            {...props}
            renderCustomerActions={searchActions}
          />
        )}}
      />
      <Route
        path="/addAppointment"
        render={() => (
          <AppointmentFormLoader
            customer={customer}
            onSave={transitionToDayView}
          />
        )}
      />
      <Route component={MainScreen} />
    </Switch>
  )
};