const today = new Date();

const at = hours => today.setHours(hours, 0);

export const sampleAppointments = [
  {startsAt: at(9), customer: {firstName: 'Charlie'}},
  {startsAt: at(9), customer: {firstName: 'Frankie'}},
  {startsAt: at(9), customer: {firstName: 'Casey'}},
  {startsAt: at(9), customer: {firstName: 'Ashley'}},
  {startsAt: at(9), customer: {firstName: 'Jordan'}},
  {startsAt: at(9), customer: {firstName: 'Jay'}},
  {startsAt: at(9), customer: {firstName: 'Alex'}},
  {startsAt: at(9), customer: {firstName: 'Jules'}},
  {startsAt: at(9), customer: {firstName: 'Stevie'}},
]