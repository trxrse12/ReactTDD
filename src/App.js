import React, { useState, useCallback } from 'react';
import {Link, Switch, Route} from 'react-router-dom';
import { AppointmentFormLoader } from './AppointmentFormLoader';
import { AppointmentsDayViewLoader } from './AppointmentsDayViewLoader';
import { CustomerForm } from './CustomerForm';
import { CustomerSearch } from './CustomerSearch';

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

export const App = () => {
  const [view, setView] = useState('dayView');
  const [customer, setCustomer] = useState();

  const transitionToAddAppointment = useCallback(
    customer => {
      setCustomer(customer);
      setView('addAppointment')
    }, []);

  const transitionToAddCustomer = useCallback(
    () => setView('addCustomer'),
    []
  );

  const transitionToDayView = useCallback(
    () => setView('dayView'),
    []
  );

  const transitionToSearchCustomers = useCallback(
    () => setView('searchCustomers'),
    []
  );

  const searchActions = (customer) => (
    <React.Fragment>
      <button
        role="button"
        onClick={() => transitionToAddAppointment(customer)}>
          Create appointment
      </button>
    </React.Fragment>
  );

  return (
    <Switch>
      <Route
        path="/addCustomer"
        render={() => (
          <CustomerForm
            />
        )}
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

  // switch (view) {
  //   case 'addCustomer':
  //     return <CustomerForm onSave={transitionToAddAppointment}/>;
  //   case 'searchCustomers':
  //     return <CustomerSearch renderCustomerActions={searchActions}/>;
  //   case 'addAppointment':
  //     return (
  //       <AppointmentFormLoader
  //         customer={customer}
  //         onSave={transitionToDayView}
  //       />
  //     );
  //   default:
  //     return (
  //       <React.Fragment>
  //         <div className="button-bar">
  //           <button
  //             type="button"
  //             id="addCustomer"
  //             onClick={transitionToAddCustomer}>
  //             Add customer and appointment
  //           </button>
  //           <button
  //             type="buton"
  //             id="searchCustomers"
  //             onClick={transitionToSearchCustomers}>
  //             Search customers
  //           </button>
  //         </div>
  //         <AppointmentsDayViewLoader/>
  //     </React.Fragment>
  //   );
  // }
};