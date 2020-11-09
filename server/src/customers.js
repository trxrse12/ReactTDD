import * as faker from 'faker';
faker.locale = 'de';

Array.prototype.flatMap = function (f) {
  if (!f) return [];
  return Array.prototype.concat.apply([], this.map(f));
};

Array.prototype.unique = function() {
  return this.filter(function (value, index, self) {
    return self.indexOf(value) === index;
  });
};

export const generateFakeCustomer = (id) => ({
    id,
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    phoneNumber: faker.phone.phoneNumber(),
  }
);

export const generateFakeCustomers = () => {
  const customers = [];
  for (let i=0; i<1500; i++){
    customers.push(generateFakeCustomer(i));
  }
  return customers;
};

/*
  Utility class used in the Express server.
  Def: customer = {
      firstName: 'Ashley',
      lastName: 'Jones',
      phoneNumber: '123456789'
    }
  The class can:
    0. be initialized with a list of mocked customers;
    1. add a customer to an internal store object;
    2. return the whole set of stored customers;
    3. when adding customers it generates unique IDs
    4. returns an error object when:
        - a phone number is already used;
        - the first name is blank;
        - the last name is blank;
        - the phone number is blank;
     5. has a customer validation method, which returns true/false;
     6. can search for a term among the fields of the stored customers, in which case;
        - it returns the index of the customer that contains the search term;
        - it returns empty array if no customer matches the search term;
     7. can search for a customer in the list of input customers, in which case:
        - it returns an empty array if no customer matches the search term;
        - it does the search only starting from the beginning of the string;
        - it only lists unique customers ids, even if the match happens in more then one field
        - it sorts the results according to a sort column;
        - it sorts in ascending or descending order;
        - it limits the number of found customers to a max param;
        - it pages the found customers according to an "after" param;
        - it returns everything if no search term;
        - it limits the results to max 10 by default;
        - it sorts by default by the firstName;
 */
export class Customers {
  constructor(initialCustomers = []){
    this.nextId = 0;
    this.customers = {};
    this.add = this.add.bind(this);
    this.isValid = this.isValid.bind(this);
    initialCustomers.forEach(this.add);
  }

  add(customer) {
    const calculatedId = this.nextId++;
    const customerWithId = Object.assign({}, customer, {id: calculatedId});
    this.customers[customerWithId.id] = customerWithId;
    return customerWithId;
  }

  all() {
    return Object.assign({}, this.customers);
  }

  errors(customer) {
    let errors = {};
    errors = Object.assign(errors, this.requiredValidation(customer, 'firstName', 'First name is required'));
    errors = Object.assign(errors, this.requiredValidation(customer, 'lastName', 'Last name is required'));
    errors = Object.assign(errors, this.requiredValidation(customer, 'phoneNumber', 'Phone number is required'));
    errors = Object.assign(errors, this.uniqueValidation('phoneNumber', customer.phoneNumber, 'Phone number'));
    return errors;
  }

  requiredValidation(customer, field, fieldDescription){
    if ((!customer[field]) || (customer?.[field]?.length === 0) || (customer?.[field]?.trim()==='')){
      return {[field]: `${fieldDescription}`};
    }
    return {};
  }

  uniqueValidation(field, fieldValue, fieldDescription){
    if (Object.entries(this.customers).map(([_,c]) => c[field]).includes(fieldValue)){
      return {[field]: fieldDescription + ' already exists in the system'}
    }
    return {};
  }

  isValid(customer) {
    return Object.keys(this.errors(customer)).length === 0;
  }

  /*
    returns ['1','3'] ==> the indexes of the elements having a prop containing the term
   */
  searchForTerm(term) {
    if (!term) return [];
    const startsWith = new RegExp(`^${term}`, 'i');
    return Object.keys(this.customers).filter(customerId => {
      const customer = this.customers[customerId];
      return startsWith.test(customer.firstName)
        || startsWith.test(customer.lastName)
        || startsWith.test(customer.phoneNumber)
    })
  }

  /*
      return [{id:0, firstName: 'Remus'},{id: 1, firstName: 'Sandra'}]
   */
  search({searchTerms, orderBy, orderDirection, limit, after}) {
    limit = limit || 10;
    searchTerms = searchTerms || [''];
    orderBy = orderBy || 'firstName';
    orderDirection = orderDirection || 'asc';
    if (!Array.isArray(searchTerms) ||  // return all if no search term
      ((searchTerms.length === 1) && (searchTerms[0] === '')))
      {return (Object.entries(this.all())
        .map(v => v[1])
        .sort((l,r) => l.firstName.localeCompare(r.firstName))
        .slice(0,10))}
    const sorted = searchTerms
      .flatMap(term => this.searchForTerm(term)) // brings bag the customer indexes having
                                                  // at least a field in the corresp. customer
                                                  // equal to search value
      .unique()
      .map(id => this.customers[id])
      .sort((l,r) => orderDirection === 'desc'
        ? r[orderBy].localeCompare(l[orderBy]) : l[orderBy].localeCompare(r[orderBy])
      );
    const afterPosition = after ? sorted.findIndex( c => c.id === after) + 1 : 0;
    return sorted.slice(afterPosition, afterPosition + limit);
  }
}