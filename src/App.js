import React, { useCallback } from 'react';
import {Link, Switch, Route} from 'react-router-dom';
import { AppointmentFormLoader } from './AppointmentFormLoader';
import { AppointmentsDayViewLoader } from './AppointmentsDayViewLoader';
import { CustomerForm } from './CustomerForm';
import { CustomerSearch } from './CustomerSearch/CustomerSearch';
import {CustomerSearchRoute} from "./CustomerSearchRoute";
import {CustomerHistory} from './CustomerHistory';
import { connect } from 'react-redux';

export const MainScreen = () => (
  <React.Fragment>
    <div className="button-bar">
      <Link to={'/addCustomer'} className="button">
        Add customer and appointment
      </Link>
      <Link to={'/searchCustomers'} className="button">
        Search customers
      </Link>
    </div>
    <AppointmentsDayViewLoader/>
  </React.Fragment>
);

export const App = ({history, setCustomerForAppointment}) => {
  // const [view, setView] = useState('dayView');
  // const [customer, setCustomer] = useState();

  const transitionToAddAppointment = customer => {
      setCustomerForAppointment(customer);
      history.push('/addAppointment')
    };

  const transitionToAddCustomer = useCallback(
    () => setView('addCustomer'),
    []
  );

  const transitionToDayView = useCallback(
    () => history.push('/'),
    [history]
  );

  const transitionToSearchCustomer = useCallback(
    () => setView('searchCustomers'),
    []
  );

  const transitionToSearchCustomerHistory = customer =>
    history.push(`/customer/${customer.id}`)

  const searchActions = (customer) => {
    return (<React.Fragment>
        <button
          role="button"
          onClick={() => transitionToAddAppointment(customer)}>
          Create appointment
        </button>
        <button
          role="button"
          onClick={() => transitionToSearchCustomerHistory(customer)}
        >View history</button>
      </React.Fragment>
    );
  };

  return (
    <Switch>
      <Route
        path="/addCustomer" component={CustomerForm}
      />
      <Route
        path="/searchCustomers"
        render={props => {
          console.log('JJJJJJJJJJJJJJJJJJJJJJJJ props=', props);
          return (
          <CustomerSearchRoute
            {...props}
            renderCustomerActions={searchActions}
          />
        )}}
      />
      <Route
        path="/addAppointment" component={AppointmentFormLoader}
      />
      <Route
        path="/customer/:id"
        render={({match}) => <CustomerHistory id={match.params.id}/>}
      />
      <Route component={MainScreen} />
    </Switch>
  )
};

const mapDispatchToProps = {
  setCustomerForAppointment: customer => ({
    type: 'SET_CUSTOMER_FOR_APPOINTMENT',
    customer
  })
};

export const ConnectedApp = connect(
  null,
  mapDispatchToProps
)(App);