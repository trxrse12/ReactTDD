import { buildApp } from './app.js';
import {generateFakeCustomers} from './customers';
import {generateFakeAppointments, buildTimeSlots} from './appointments';

let port = process.env.PORT || 9000;
let customers = generateFakeCustomers();
let timeSlots = buildTimeSlots();
let appointments = generateFakeAppointments(customers, timeSlots);
// console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA appointments=', appointments[appointments.length-1])
const now = new Date();
const yesterday = now.setDate(now.getDate()-2)
now.setHours(17,0,0,0)
console.log('AAAA now=', now.setHours(17,0,0,0))
console.log('BBBB yesterday=', yesterday)
console.log('KKKKKKKKKKKKKKKKKKKKKKKKKKKKK app=', appointments.slice(appointments.length-30, appointments.length))
console.log('LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL today_app=',
  appointments.filter(app => app.startsAt >= yesterday && app.startsAt<= now.setHours(17,0,0,0) ))
buildApp(customers, appointments, timeSlots).listen(port);
console.log(`Server listening on ${port}.`);
