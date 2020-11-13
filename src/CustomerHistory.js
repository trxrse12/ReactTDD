import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import { appHistory} from "./history";

// so this function is extracting store variables (e.g. customer, or appointments (see below))
const mapStateToProps = ({queryCustomer: {
    /*store var*/customer,
    /*store var*/appointments,
    /*store var*/status,
  }}) => ({
    customer, appointments, status,
});
const mapDispatchToProps = ({
  queryCustomer: id => ({type: 'QUERY_CUSTOMER_REQUEST', id})
});

const toTimeString = startsAt =>
    new Date(startsAt).toString().substring(0,21);

const AppointmentRow = ({appointment}) => (
  <tr>
    <td>{toTimeString(appointment.startsAt)}</td>
    <td>{appointment.stylist}</td>
    <td>{appointment.service}</td>
    <td>{appointment.notes}</td>
  </tr>
);

export const CustomerHistory = connect(
  mapStateToProps,
  mapDispatchToProps,
)(({ id, queryCustomer, customer, appointments, status}) => {
  useEffect(() => {
    queryCustomer(id) // dispatches an action when the component mounts
  }, [id, queryCustomer]);

  const { firstName, lastName, phoneNumber} = customer;

  if (status==='SUBMITTING')
    return <div id='loading'>Loading</div>;

  if (status==='FAILED')
    return <div id='error'>
      Sorry, an error occured while pulling data from the server.
    </div>;

  return (
    <div id="customer">
      <h2>
        {firstName} {lastName}
      </h2>
      <p>{phoneNumber}</p>
      <h3>Booked appointments</h3>
      <table>
        <thead>
          <tr>
            <th>When</th>
            <th>Stylist</th>
            <th>Service</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment, i) => (
            <AppointmentRow appointment={appointment} key={i} />
            ))}
        </tbody>
      </table>
      <button id="mainPageButton" type="button" className="button" onClick={() => {
        appHistory.push('/');
      }}>
        Back to main page
      </button>
    </div>
  );
});