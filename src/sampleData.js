import Chance from 'chance';
const chance = new Chance();
const today = new Date();


const at = hours => today.setHours(hours, 0);

Array.prototype.pickRandom = function() {
  return this[Math.floor(Math.random() * this.length)];
};

const pickMany = (items, number) =>
  Array(number)
    .fill(1)
    .map(() => items.pickRandom());

const buildTimeSlots = () => {
  const today = new Date();
  const startTime = today.setHours(9, 0, 0, 0);
  const times = [...Array(7).keys()].map(day => {
    const daysToAdd = day * 24 * 60 * 60 * 1000;
    return [...Array(20).keys()].map(halfHour => {
      const halfHoursToAdd = halfHour * 30 * 60 * 1000;
      return {
        startsAt: startTime + daysToAdd + halfHoursToAdd
      };
    });
  });
  return [].concat(...times);
};

export const sampleAvailableTimeSlots = pickMany(
  buildTimeSlots(),
  50
);

export const sampleAppointments = [
  {startsAt: at(9), customer: {
    firstName: 'Charlie',
    lastName: 'Sanders',
    phoneNumber: chance.phone({country: 'us'}),
    stylist: 'Maggie',
      service: 'Beard trim',
      notes: chance.paragraph(),
  }},
  {startsAt: at(10), customer: {
    firstName: 'Frankie',
    lastName: 'Connors',
    phoneNumber: chance.phone({country: 'us'}),
    stylist: 'Maggie',
      service: 'Beard trim',
      notes: chance.paragraph(),
  }},
  {startsAt: at(11), customer: {
    firstName: 'Casey',
    lastName: 'McGregor',
    phoneNumber: chance.phone({country: 'us'}),
    stylist: 'John',
      service: 'Hair styling',
      notes: chance.paragraph(),
  }},
  {startsAt: at(12), customer: {
    firstName: 'Ashley',
    lastName: 'Dupont',
    phoneNumber: chance.phone({country: 'us'}),
      stylist: 'Laura',
      service: 'Hair cut',
      notes: chance.paragraph(),
  }},
  {startsAt: at(13), customer: {
    firstName: 'Jordan',
    lastName: 'Myers',
    phoneNumber: chance.phone({country: 'us'}),
      stylist: 'Laura',
      service: 'Beard trim',
      notes: chance.paragraph(),
  }},
  {startsAt: at(14), customer: {
    firstName: 'Jay',
    lastName: 'Muller',
    phoneNumber: chance.phone({country: 'us'}),
      stylist: 'Kyla',
      service: 'Hair styling',
      notes: chance.paragraph(),
  }},
  {startsAt: at(15), customer: {
    firstName: 'Alex',
    lastName: 'Schepp',
    phoneNumber: chance.phone({country: 'us'}),
      stylist: 'Kyla',
      service: 'Hair cut',
      notes: chance.paragraph(),
  }},
  {startsAt: at(16), customer: {
    firstName: 'Jules',
    lastName: 'Carter',
    phoneNumber: chance.phone({country: 'us'}),
      stylist: 'Julie',
      service: 'Beard trim',
      notes: chance.paragraph(),
  }},
  {startsAt: at(17), customer: {
    firstName: 'Stevie',
    lastName: 'Vicards',
    phoneNumber: chance.phone({country: 'us'}),
      stylist: 'Maggie',
      service: 'Hair re-shuffling',
      notes: chance.paragraph(),
  }},
];