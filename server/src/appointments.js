const stylists = ['Ashley', 'Jo', 'Pat', 'Sam'];
const services = ['Cut', 'Blow-dry', 'Extensions', 'Cut & color', 'Beard trim', 'Cut & beard trim', 'Extensions'];

export const randomInt = range => Math.floor(Math.random() * range);

export function getRandomInt(min, max){
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min +1)) + min;
}


/*
  Utility class used in the Express routes to process the mock info injected into the server.

  This class can:
    0.  be initialized with a list of mocked appointments;
    1.  removes duplicates in the input mocked timeSlots data;
    2.  delete all the stored appointments
    3.  retrieve a list of appointments within a certain range interval;
    4.  sort the list of retrieved appointments by startsAt
 */
export class Appointments {
  /*
    Inputs:
    1. a list of appointments
      [
        { customer: 58, startAt: 234, stylist: 'Jo', service: 'Beard trim' },
        { customer: 80, startAt: 234, stylist: 'Ashley', service: 'Cut' },
        { customer: 37, startAt: 234, stylist: 'Jo', service: 'Blow-dry' },
      ]
    2. initialTimeSlots = [{startsAt: 123}, {startsAt: 234}]
   */
  constructor(initialAppointments = [], initialTimeSlots = []) {
    this.appointments = [];

    this.timeSlots = initialTimeSlots;
    this.add = this.add.bind(this);
    initialAppointments.forEach(this.add);
  }

  /*
    filters out duplications, returns the appointment
   */
  add(appointment) {
    this.timeSlots = this.timeSlots.filter(timeSlot => {
      return timeSlot.startsAt !== appointment.startsAt
    });
    this.appointments.push(appointment)
    return appointment;
  }

  /*
    from = number;
    to = number;
    customers = {'customer': {id:123}}
    this.appointments = [
        { customer: 58, startAt: 234, stylist: 'Jo', service: 'Beard trim' },
        { customer: 80, startAt: 234, stylist: 'Ashley', service: 'Cut' },
        { customer: 37, startAt: 234, stylist: 'Jo', service: 'Blow-dry' },
      ]
   */
  getAppointments(from, to, customers){
    return this.appointments
      .filter(appointment => appointment.startsAt >= from)
      .filter(appointment => appointment.startsAt <= to)
      .map(appointment => ({...appointment, ...{customer: customers[appointment.customer]}}))
      .sort((l, r) => l.startsAt - r.startsAt);
  }

  forCustomer(customerId) {
    return this.appointments.filter(appointment => appointment.customer === customerId);
  }

  getTimeSlots(){
    return this.timeSlots;
  }

  deleteAll(){
    this.appointments.length = 0;
  }

  errors(appointment){
    let errors = {};
    if (this.appointments.filter(app => app.startsAt === appointment.startsAt).length > 0){
      return ({
        startsAt: 'Appointment start time has already been allocated'
      })
    }
    return {};
  }

  isValid(appointment){
    return Object.keys(this.errors(appointment)).length === 0;
  }
}


/* 1. Function that builds a time grid of 30 mins, for 10 hours a day only, for a year in the past and a month in the future
   2. The result looks like: [{startsAt: 1113241144}, {startsAt: 1133313244}]
 */
export function buildTimeSlots() {
  const startDate = new Date();
  const lastYearToday = startDate.setFullYear(startDate.getFullYear()-1);
  const times = [...Array(365+30)].map(day => {
    const daysToAdd = day * 24 * 60 * 60 * 1000;
    return [...Array(20).keys()].map(halfHour => {
      const halfHourToAdd = halfHour * 30 * 60 * 1000;
      return {startsAt: lastYearToday + daysToAdd + halfHourToAdd, stylists};
    })
  })
  return [].concat(...times);
}

Array.prototype.pickRandom = function(){
  return this[randomInt(this.length)];
}

/*
  @function that generates an array of random appointments, of length more then the length of timeslots array:
     [
        { customer: 58, startsAt: 234, stylist: 'Jo', service: 'Beard trim' },
        { customer: 80, startsAt: 234, stylist: 'Ashley', service: 'Cut' },
        { customer: 37, startsAt: 234, stylist: 'Jo', service: 'Blow-dry' },
      ]
  @params:
    customers: an array of random customers
    [
        { id: 50 }, { id: 22 },
        { id: 50 }, { id: 94 },
        { id: 83 }, { id: 5 },
        { id: 56 }, { id: 85 },
        { id: 80 }, { id: 66 }
      ]

    timeslots: [
        { startsAt: 234, stylists: [ 'Ashley', 'Jo' ] },
        { startsAt: 234, stylists: [ 'Ashley', 'Jo' ] },
        { startsAt: 234, stylists: [ 'Ashley', 'Jo' ] },
    ]

    services: ['Cut', 'Blow-dry', 'Extensions', 'Cut & color', 'Beard trim', 'Cut & beard trim', 'Extensions'];
 */
export function generateFakeAppointments(customers, timeslots) {
  let appointments = [];
  appointments = [...Array(timeslots.length).keys()]
    .slice(0, getRandomInt((timeslots.length)/2+1, timeslots.length-1))
    .map((v,i) => ({
      customer: customers.pickRandom().id,
      startsAt: timeslots[i].startsAt,
      stylist: timeslots[0].stylists.pickRandom(),
      service: services.pickRandom(),
    }));
  return appointments;
}
