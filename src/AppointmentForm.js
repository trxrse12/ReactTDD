import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { appHistory} from "./history";

const Error = () => (
  <div className="error">An error occurred during the save.</div>
);

const timeIncrements = (numTimes, startTime, increment) =>
  Array(numTimes)
    .fill([startTime])
    .reduce((acc, _, i) =>
      acc.concat([startTime + i * increment])
    );

const dailyTimeSlots = (salonOpensAt, salonClosesAt) => {
  const totalSlots = (salonClosesAt - salonOpensAt) * 2;
  const startTime = new Date().setHours(salonOpensAt, 0, 0, 0);
  const increment = 30 * 60 * 1000;
  return timeIncrements(totalSlots, startTime, increment)
};
const toTimeValue = timestamp => new Date(timestamp).toTimeString().substring(0, 5);
const weeklyDateValues = (startDate) => {
  const midnight = new Date(startDate).setHours(0,0,0,0);
  const increment = 24 * 60 * 60 * 1000;
  return timeIncrements(7, midnight, increment);
};
const toShortDate = timestamp => {
  const [day, , dayOfMonth] = new Date(timestamp)
    .toDateString()
    .split(' ');
  return `${day} ${dayOfMonth}`;
};
// transform table cells into unixtime
// (e.g. 'Sat 11' && '09:30' >>> unixtime)
const mergeDateAndTime = (date, timeSlot) => {
  const time = new Date(timeSlot);
  return new Date(date).setHours(
    time.getHours(),
    time.getMinutes(),
    time.getSeconds(),
    time.getMilliseconds(),
  );
};


const RadioButtonIfAvailable = ({
  availableTimeSlots,
  date,
  timeSlot,
  checkedTimeSlot,
  handleChange,
}) => {
  const startsAt = mergeDateAndTime(date, timeSlot);
  if (
    availableTimeSlots.some(
      timeSlot => timeSlot.startsAt === startsAt
    )
  ){
     const isChecked = startsAt === checkedTimeSlot;
     return <input
       name="startsAt"
       type="radio"
       value={startsAt}
       checked={isChecked}
       onChange={handleChange}
     />
  }
  return null;
};


const TimeSlotTable = ({
  salonOpensAt,
  salonClosesAt,
  today,
  availableTimeSlots,
  checkedTimeSlot,
  handleChange,
                       }) => {
  const dates = weeklyDateValues(today);
  const timeSlots = dailyTimeSlots(
    salonOpensAt,
    salonClosesAt,
  );
  return (
    <table id="time-slots">
      <thead>
        <tr>
          <th />
          {dates.map(d => (
            <th key={d}>{toShortDate(d)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {timeSlots.map(timeSlot => (
              <tr key={timeSlot}>
                <th>{toTimeValue(timeSlot)}</th>
                {dates.map(date => (
                    <td key={date}>
                      <RadioButtonIfAvailable
                        availableTimeSlots={availableTimeSlots}
                        date={date}
                        timeSlot={timeSlot}
                        checkedTimeSlot={checkedTimeSlot}
                        handleChange={handleChange}
                      />
                    </td>
                  ))}
              </tr>
        ))}
      </tbody>
    </table>
  )
};

const mapStateToProps = ({appointment: {customer, error}}) => ({customer, error});
const mapDispatchToProps = {
  addAppointmentRequest: ({appointment, customer}) => {
    return ({
      type: 'ADD_APPOINTMENT_REQUEST',
      appointment,
      customer,
    })
  }
};

export const AppointmentForm = connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  ({
     selectableServices,
     service,
     selectableStylists,
     stylist,
     serviceStylists,
     salonOpensAt,
     salonClosesAt,
     today,
     availableTimeSlots,
     startsAt,
     customer,
     addAppointmentRequest,
     error,
   }) => {
    const [appointment, setAppointment] = useState({
      service,
      startsAt,
      stylist,
    });

    const handleSelectBoxChange = ({target: { value, name }}) =>
      setAppointment(appointment => ({
        ...appointment,
        [name]: value
      }));

    const handleStartsAtChange = useCallback(
      ({target: {value}}) =>
        setAppointment(appointment => ({
          ...appointment,
          startsAt: parseInt(value)
        })),
      []
    );

    const handleSubmit = async (e) => {
      e.preventDefault();
      const result = await window.fetch('/appointments', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
          ...appointment,
          customer: customer.id,
        }),
      });
      if (result.ok){
        addAppointmentRequest({
          appointment,
          customer,
        });
      }
    };

    const stylistsForService = appointment.service
      ? serviceStylists[appointment.service]
      : selectableStylists;

    const timeSlotsForStylists = appointment.stylist
      ? availableTimeSlots.filter(slot =>
        slot.stylists.includes((appointment.stylist))
      )
      : availableTimeSlots

    return (
      <form id="appointment" onSubmit={handleSubmit} className="appointment">
        { error ? <Error /> : null }
        <label htmlFor="service">Service name</label>
        <select
          name="service"
          id="service"
          value={service}
          onChange={handleSelectBoxChange}>
          <option/>
          {selectableServices.map(s => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <label htmlFor="stylist">Stylist</label>
        <select
          name="stylist"
          id="stylist"
          value={stylist}
          onChange={handleSelectBoxChange}>
          <option/>
          {stylistsForService.map(s => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <TimeSlotTable
          salonOpensAt={salonOpensAt}
          salonClosesAt={salonClosesAt}
          today={today}
          availableTimeSlots={timeSlotsForStylists}
          checkedTimeSlot={appointment.startsAt}
          handleChange={handleStartsAtChange}
        />
        <input type="submit" value="Add" />
        <button id="mainPageButton" type="button" className="button" onClick={() => {
          appHistory.push('/')
        }}>
          Back to main page
        </button>
      </form>
    )
  }
);




AppointmentForm.defaultProps = {
  today: new Date(),
  salonOpensAt: 9,
  salonClosesAt: 19,
  selectableServices: [
    'Cut',
    'Blow-dry',
    'Cut & color',
    'Beard trim',
    'Cut & beard-trim',
    'Extensions'
  ],
  availableTimeSlots: [],
  selectableStylists: ['Ashley', 'Jo', 'Pat', 'Sam'],
  serviceStylists: {
    Cut: ['Ashley', 'Jo', 'Pat', 'Sam'],
    'Blow-dry': ['Ashley', 'Jo', 'Pat', 'Sam'],
    'Cut & color': ['Ashley', 'Jo'],
    'Beard trim': ['Pat', 'Sam'],
    'Cut & beard trim': ['Pat', 'Sam'],
    Extensions: ['Ashley', 'Pat']
  },
};