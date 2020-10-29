import express from 'express';
import {graphqlHTTP as expressGraphql} from 'express-graphql'; // used the nickname to fit his code

// an alternative to express-graphql
// import {join} from 'path';
// import { loadSchemaSync } from '@graphql-tools/load';
// import {GraphQLFileLoader} from '@graphql-tools/graphql-file-loader';
// const schema = loadSchemaSync(join(__dirname, 'schema.graphql'),
//   {loaders: [new GraphQLFileLoader()]}
//   );
// const schemaText = loadSchemaSync(join(__dirname, './schema.graphql'), {
//   loaders: [
//     new GraphQLFileLoader(),
//   ]
// });


import { buildSchema } from 'graphql';
import schemaText from './schema.graphql';
const schema = buildSchema(schemaText);

import morgan from 'morgan';
import {Customers} from './customers';
import {Appointments} from './appointments';

export function buildApp(customerData, appointmentData, timeSlots) {
  const app = express();
  app.use(express.json()); // without this one, I cannot read JSON in my routes
  const customers = new Customers(customerData);
  const appointments = new Appointments([],timeSlots);

  app.use(morgan('dev'));
  app.get ('/', (req, res) => {
    res.status(200);
    return res.send('OK')
  });

  app.post('/customers', (req,res, next) => {
    const customer = req.body;
    if (customers.isValid(customer)){
      const customerWithId = customers.add(customer);
      return res.status(201).json(customerWithId);
    } else {
      const errors = customers.errors(customer);
      return res.status(422).json({errors});
    }
  });

  app.get('/availableTimeSlots', (req, res, next) => {
    return res.json(appointments.getTimeSlots());
  });

  app.post('/appointments', (req, res, next) => {
    const appointment = req.body;
    if (appointments.isValid(appointment)){
      appointments.add(appointment);
      return res.sendStatus(201);
    } else {
      const errors = appointments.errors(appointment);
      return res.status(422).json({errors});
    }
  });

  app.get('/appointments/:from-:to', (req, res, next) => {
    res.json(appointments.getAppointments(
      parseInt(req.params.from),
      parseInt(req.params.to),
      customers.all()
    ))
  });

  app.get('/customers', (req, res, next) => {
    const results = customers.search(buildSearchParams(req.query));
    res.json(results);
  });

  app.use('/graphql', expressGraphql({
    schema,
    rootValue: {
      customers: query =>
        customers.search(buildSearchParams(query))
          .map(customer => {
            return (
              {
                ...customer,
                appointments: () => appointments.forCustomer(customer.id)
              }
            )
          }
        ),
      customer: ({id}) => {
        const customer = customers.all()[id];
        return { ... customer, appointments: appointments.forCustomer(customer.id)}
      },
      availableTimeSlots: () => appointments.getTimeSlots(),
    },
    graphiql: true,
  }));

  return app;
}

/* accepts an object of shape:
    {searchTerm, after, limit, orderBy, orderDirection} of possibly undefined values
   and returns an object that eliminates the props that are not valid (undefined or not integers)
 */
function buildSearchParams({searchTerm, after, limit, orderBy, orderDirection}) {
  const searchParams = {};
  if (searchTerm) searchParams.searchTerms = buildSearchTerms(searchTerm);
  if (after) searchParams.after = parseInt(after);
  if (limit) searchParams.limit = parseInt(limit);
  if (orderBy) searchParams.orderBy = orderBy;
  if (orderDirection) searchParams.orderDirection = orderDirection;
  return searchParams;
}

/* get a string or an array, returns an array*/
function buildSearchTerms(searchTerm){
  if (!searchTerm) return undefined;
  if (Array.isArray(searchTerm)){
    return searchTerm;
  }
  return [searchTerm];
}
