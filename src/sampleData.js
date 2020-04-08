const today = new Date();

const at = hours => today.setHours(hours, 0);

export const sampleAppointments = [
  {
    startsAt: at(9),
    customer: {
      firstName: 'Charlie',
      lastname: 'Johnson',
      phoneNumber: '123333242314',
      stylist: 'John McEnroe',
      service: 'The Primrose',
      notes: 'He is bald',
    }
  },
  {
    startsAt: at(9),
    customer: {
      firstName: 'Frankie',
      lastname: 'Doubtfire',
      phoneNumber: '999288828882',
      stylist: 'John McEnroe',
      service: 'Apollo',
      notes: 'None'
    }
  },
  {startsAt: at(9), customer: {firstName: 'Casey'}},
  {startsAt: at(9), customer: {firstName: 'Ashley'}},
  {startsAt: at(9), customer: {firstName: 'Jordan'}},
  {startsAt: at(9), customer: {firstName: 'Jay'}},
  {startsAt: at(9), customer: {firstName: 'Alex'}},
  {startsAt: at(9), customer: {firstName: 'Jules'}},
  {startsAt: at(9), customer: {firstName: 'Stevie'}},
]