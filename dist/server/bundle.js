/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./server/src/app.js":
/*!***************************!*\
  !*** ./server/src/app.js ***!
  \***************************/
/*! namespace exports */
/*! export buildApp [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"buildApp\": () => /* binding */ buildApp\n/* harmony export */ });\n/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ \"@babel/runtime/helpers/defineProperty\");\n/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var express_graphql__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! express-graphql */ \"express-graphql\");\n/* harmony import */ var express_graphql__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(express_graphql__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _utilities_tools__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utilities/tools */ \"./server/utilities/tools.js\");\n/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! graphql */ \"graphql\");\n/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(graphql__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _src_schema_graphql__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../src/schema.graphql */ \"./server/src/schema.graphql\");\n/* harmony import */ var morgan__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! morgan */ \"morgan\");\n/* harmony import */ var morgan__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(morgan__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var _customers__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./customers */ \"./server/src/customers.js\");\n/* harmony import */ var _appointments__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./appointments */ \"./server/src/appointments.js\");\n;\n\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }\n\n\n // used the nickname to fit his code\n\n // an alternative to express-graphql\n// import {join} from 'path';\n// import { loadSchemaSync } from '@graphql-tools/load';\n// import {GraphQLFileLoader} from '@graphql-tools/graphql-file-loader';\n// const schema = loadSchemaSync(join(__dirname, 'schema.graphql'),\n//   {loaders: [new GraphQLFileLoader()]}\n//   );\n// const schemaText = loadSchemaSync(join(__dirname, './schema.graphql'), {\n//   loaders: [\n//     new GraphQLFileLoader(),\n//   ]\n// });\n\n\n\n\nvar schema = (0,graphql__WEBPACK_IMPORTED_MODULE_4__.buildSchema)(_src_schema_graphql__WEBPACK_IMPORTED_MODULE_5__.default);\n\n\n\nfunction buildApp(customerData, appointmentData, timeSlots) {\n  var app = express__WEBPACK_IMPORTED_MODULE_1___default()();\n  app.use(express__WEBPACK_IMPORTED_MODULE_1___default().static('dist'));\n  app.use(express__WEBPACK_IMPORTED_MODULE_1___default().json()); // without this one, I cannot read JSON in my routes\n\n  var _customers = new _customers__WEBPACK_IMPORTED_MODULE_7__.Customers(customerData);\n\n  var _appointments = new _appointments__WEBPACK_IMPORTED_MODULE_8__.Appointments(appointmentData, timeSlots);\n\n  app.use(morgan__WEBPACK_IMPORTED_MODULE_6___default()('dev'));\n  app.get('/', function (req, res) {\n    res.status(200);\n    return res.send('OK');\n  });\n  app.post('/customers', function (req, res, next) {\n    var customer = req.body;\n\n    if (_customers.isValid(customer)) {\n      var customerWithId = _customers.add(customer);\n\n      return res.status(201).json(customerWithId);\n    } else {\n      var errors = _customers.errors(customer);\n\n      return res.status(422).json({\n        errors: errors\n      });\n    }\n  });\n  app.get('/availableTimeSlots', function (req, res, next) {\n    return res.json(_appointments.getTimeSlots());\n  });\n  app.post('/appointments', function (req, res, next) {\n    var appointment = req.body;\n\n    if (_appointments.isValid(appointment)) {\n      _appointments.add(appointment);\n\n      return res.sendStatus(201);\n    } else {\n      var errors = _appointments.errors(appointment);\n\n      return res.status(422).json({\n        errors: errors\n      });\n    }\n  });\n  app.get('/appointments/:from-:to', function (req, res, next) {\n    res.json(_appointments.getAppointments(parseInt(req.params.from), parseInt(req.params.to), _customers.all()));\n  });\n  /* The query fields:\n    fields = [\n        {\n          kind: 'ObjectField',\n          name: { kind: 'Name', value: 'startsAt', loc: [{ start: 49, end: 57 }] },\n          value: { kind: 'StringValue', value: '123', block: false, loc: [{ start: 59, end: 64 }] },\n          loc: { start: 49, end: 64 }\n        },\n        {\n          kind: 'ObjectField',\n          name: { kind: 'Name', value: 'customer', loc: [ { start: 66, end: 74 }] },\n          value: { kind: 'IntValue', value: '1', loc: [ { start: 76, end: 77 }] },\n          loc: { start: 66, end: 77 }\n        }\n      ]\n    The repository:\n    Appointments {\n        appointments: [],\n        timeSlots: [],\n        add: [Function: bound mockConstructor]\n   */\n\n  var validateObject = function validateObject(context, fields, repository, path) {\n    var object = fields === null || fields === void 0 ? void 0 : fields.reduce(function (acc, field) {\n      acc[field.name.value] = field.value.value;\n      return acc;\n    });\n    var isValid = repository.isValid(object);\n\n    if (!repository.isValid(object)) {\n      var errors = repository.errors(object);\n      Object.keys(errors).forEach(function (fieldName) {\n        context.reportError(new graphql__WEBPACK_IMPORTED_MODULE_4__.GraphQLError(errors[fieldName], undefined, undefined, undefined, [path, fieldName]));\n      });\n    }\n  };\n\n  var appointmentValidation = function appointmentValidation(context) {\n    return {\n      Argument: function Argument(arg) {\n        validateObject(context, arg.value.fields, _appointments, 'addAppointment');\n      }\n    };\n  };\n\n  var customerValidation = function customerValidation(context) {\n    return {\n      Argument: function Argument(arg) {\n        validateObject(context, arg.value.fields, _customers, 'addCustomer');\n      }\n    };\n  };\n\n  app.get('/customers', function (req, res, next) {\n    var results = _customers.search(buildSearchParams(req.query));\n\n    res.json(results);\n  });\n  app.use('/graphql', (0,express_graphql__WEBPACK_IMPORTED_MODULE_2__.graphqlHTTP)({\n    schema: schema,\n    rootValue: {\n      customers: function customers(query) {\n        return _customers.search(buildSearchParams(query)).map(function (customer) {\n          return _objectSpread(_objectSpread({}, customer), {}, {\n            appointments: function appointments() {\n              return _appointments.forCustomer(customer.id);\n            }\n          });\n        });\n      },\n      customer: function customer(_ref) {\n        var id = _ref.id;\n\n        var customer = _customers.all()[id];\n\n        return _objectSpread(_objectSpread({}, customer), {}, {\n          appointments: _appointments.forCustomer(customer.id)\n        });\n      },\n      availableTimeSlots: function availableTimeSlots() {\n        return _appointments.getTimeSlots();\n      },\n      appointments: function appointments(_ref2) {\n        var from = _ref2.from,\n            to = _ref2.to;\n        return _appointments.getAppointments(parseInt(from), parseInt(to), _customers.all());\n      },\n      addAppointment: function addAppointment(_ref3) {\n        var appointment = _ref3.appointment;\n        appointment = Object.assign(appointment, {\n          startsAt: parseInt(appointment.startsAt)\n        });\n        return _appointments.add(appointment);\n      },\n      addCustomer: function addCustomer(_ref4) {\n        var customer = _ref4.customer;\n        return _customers.add(customer);\n      }\n    },\n    validationRules: [customerValidation, appointmentValidation],\n    graphiql: true\n  }));\n  app.get('*', function (req, res) {\n    res.sendFile('dist/index.html', {\n      root: process.cwd()\n    });\n  });\n  return app;\n}\n/* accepts an object of shape:\n    {searchTerm, after, limit, orderBy, orderDirection} of possibly undefined values\n   and returns an object that eliminates the props that are not valid (undefined or not integers)\n */\n\nfunction buildSearchParams(_ref5) {\n  var searchTerm = _ref5.searchTerm,\n      after = _ref5.after,\n      limit = _ref5.limit,\n      orderBy = _ref5.orderBy,\n      orderDirection = _ref5.orderDirection;\n  var searchParams = {};\n  if (searchTerm) searchParams.searchTerms = buildSearchTerms(searchTerm);\n  if (after) searchParams.after = parseInt(after);\n  if (limit) searchParams.limit = parseInt(limit);\n  if (orderBy) searchParams.orderBy = orderBy;\n  if (orderDirection) searchParams.orderDirection = orderDirection;\n  return searchParams;\n}\n/* get a string or an array, returns an array*/\n\n\nfunction buildSearchTerms(searchTerm) {\n  if (!searchTerm) return undefined;\n\n  if (Array.isArray(searchTerm)) {\n    return searchTerm;\n  }\n\n  return [searchTerm];\n}\n\n//# sourceURL=webpack://appointments/./server/src/app.js?");

/***/ }),

/***/ "./server/src/appointments.js":
/*!************************************!*\
  !*** ./server/src/appointments.js ***!
  \************************************/
/*! namespace exports */
/*! export Appointments [provided] [no usage info] [missing usage info prevents renaming] */
/*! export buildTimeSlots [provided] [no usage info] [missing usage info prevents renaming] */
/*! export generateFakeAppointments [provided] [no usage info] [missing usage info prevents renaming] */
/*! export getRandomInt [provided] [no usage info] [missing usage info prevents renaming] */
/*! export randomInt [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"randomInt\": () => /* binding */ randomInt,\n/* harmony export */   \"getRandomInt\": () => /* binding */ getRandomInt,\n/* harmony export */   \"Appointments\": () => /* binding */ Appointments,\n/* harmony export */   \"buildTimeSlots\": () => /* binding */ buildTimeSlots,\n/* harmony export */   \"generateFakeAppointments\": () => /* binding */ generateFakeAppointments\n/* harmony export */ });\n/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ \"@babel/runtime/helpers/toConsumableArray\");\n/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ \"@babel/runtime/helpers/defineProperty\");\n/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ \"@babel/runtime/helpers/classCallCheck\");\n/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ \"@babel/runtime/helpers/createClass\");\n/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__);\n;\n\n\n\n\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }\n\nvar stylists = ['Ashley', 'Jo', 'Pat', 'Sam'];\nvar services = ['Cut', 'Blow-dry', 'Extensions', 'Cut & color', 'Beard trim', 'Cut & beard trim', 'Extensions'];\nvar stylistServices = {\n  Ashley: ['Cut', 'Blow-dry', 'Extensions'],\n  Jo: ['Cut', 'Blow-dry', 'Cut & color'],\n  Pat: ['Cut', 'Blow-dry', 'Beard trim', 'Cut & beard trim', 'Extensions'],\n  Sam: ['Cut', 'Blow-dry', 'Beard trim', 'Cut & beard trim']\n};\nvar randomInt = function randomInt(range) {\n  return Math.floor(Math.random() * range);\n};\n\nArray.prototype.pickRandom = function () {\n  return this[randomInt(this.length)];\n};\n\nvar pickMany = function pickMany(items, number) {\n  return Array(number).fill(1).map(function (n) {\n    return items.pickRandom();\n  });\n};\n\nfunction shouldFillTimeSlot() {\n  return randomInt(3) < 2;\n}\n\n;\nfunction getRandomInt(min, max) {\n  min = Math.ceil(min);\n  max = Math.floor(max);\n  return Math.floor(Math.random() * (max - min + 1)) + min;\n}\n/*\n  Utility class used in the Express routes to process the mock info injected into the server.\n\n  This class can:\n    0.  be initialized with a list of mocked appointments;\n    1.  removes duplicates in the input mocked timeSlots data;\n    2.  delete all the stored appointments\n    3.  retrieve a list of appointments within a certain range interval;\n    4.  sort the list of retrieved appointments by startsAt\n */\n\nvar Appointments = /*#__PURE__*/function () {\n  /*\n    Inputs:\n    1. a list of appointments\n      [\n        { customer: 58, startAt: 234, stylist: 'Jo', service: 'Beard trim' },\n        { customer: 80, startAt: 234, stylist: 'Ashley', service: 'Cut' },\n        { customer: 37, startAt: 234, stylist: 'Jo', service: 'Blow-dry' },\n      ]\n    2. initialTimeSlots = [{startsAt: 123}, {startsAt: 234}]\n   */\n  function Appointments() {\n    var initialAppointments = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];\n    var initialTimeSlots = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];\n\n    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2___default()(this, Appointments);\n\n    this.appointments = [];\n    this.timeSlots = initialTimeSlots;\n    this.add = this.add.bind(this);\n    initialAppointments.forEach(this.add);\n  }\n  /*\n    filters out duplications, returns the appointment\n   */\n\n\n  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3___default()(Appointments, [{\n    key: \"add\",\n    value: function add(appointment) {\n      this.timeSlots = this.timeSlots.filter(function (timeSlot) {\n        return timeSlot.startsAt !== appointment.startsAt;\n      });\n      this.appointments.push(appointment);\n      return appointment;\n    }\n    /*\n      from = number;\n      to = number;\n      customers = {'customer': {id:123}}\n      this.appointments = [\n          { customer: 58, startAt: 234, stylist: 'Jo', service: 'Beard trim' },\n          { customer: 80, startAt: 234, stylist: 'Ashley', service: 'Cut' },\n          { customer: 37, startAt: 234, stylist: 'Jo', service: 'Blow-dry' },\n        ]\n     */\n\n  }, {\n    key: \"getAppointments\",\n    value: function getAppointments(from, to, customers) {\n      return this.appointments.filter(function (appointment) {\n        return appointment.startsAt >= from;\n      }).filter(function (appointment) {\n        return appointment.startsAt <= to;\n      }).map(function (appointment) {\n        return _objectSpread(_objectSpread({}, appointment), {\n          customer: customers[appointment.customer]\n        });\n      }).sort(function (l, r) {\n        return l.startsAt - r.startsAt;\n      });\n    }\n  }, {\n    key: \"forCustomer\",\n    value: function forCustomer(customerId) {\n      return this.appointments.filter(function (appointment) {\n        return appointment.customer === customerId;\n      });\n    }\n  }, {\n    key: \"getTimeSlots\",\n    value: function getTimeSlots() {\n      return this.timeSlots;\n    }\n  }, {\n    key: \"deleteAll\",\n    value: function deleteAll() {\n      this.appointments.length = 0;\n    }\n  }, {\n    key: \"errors\",\n    value: function errors(appointment) {\n      var errors = {};\n\n      if (this.appointments.filter(function (app) {\n        return app.startsAt === appointment.startsAt;\n      }).length > 0) {\n        return {\n          startsAt: 'Appointment start time has already been allocated'\n        };\n      }\n\n      return {};\n    }\n  }, {\n    key: \"isValid\",\n    value: function isValid(appointment) {\n      return Object.keys(this.errors(appointment)).length === 0;\n    }\n  }]);\n\n  return Appointments;\n}();\n/* 1. Function that builds a time grid of 30 mins, for 10 hours a day only, for a year in the past and a month in the future\n   2. The result looks like: [{startsAt: 1113241144}, {startsAt: 1133313244}]\n */\n\nfunction buildTimeSlots() {\n  var _ref;\n\n  var startDate = new Date();\n  startDate.setFullYear(startDate.getFullYear() - 1);\n  var startTime = startDate.setHours(9, 0, 0, 0); // console.log('GGGGGGGGGGGGGGGGGGGGGGGGGGGG startTime=', startTime)\n\n  var times = _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default()(Array(365 + 30).keys()).map(function (day) {\n    var daysToAdd = day * 24 * 60 * 60 * 1000;\n    return _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default()(Array(20).keys()).map(function (halfHour) {\n      // console.log('MMMMMMMMMMMMMMMMMMMMMMMMMMMM halfHour=', halfHour)\n      var halfHoursToAdd = halfHour * 30 * 60 * 1000; // console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXX startTime=', startTime)\n      // console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXX daysToAdd=', daysToAdd)\n      // console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXX halfHoursToAdd=', halfHoursToAdd)\n\n      return {\n        startsAt: startTime + daysToAdd + halfHoursToAdd,\n        stylists: stylists\n      };\n    });\n  });\n\n  return (_ref = []).concat.apply(_ref, _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default()(times));\n}\n/*\n  @function that generates an array of random appointments, of length more then the length of timeslots array:\n     [\n        { customer: 58, startsAt: 234, stylist: 'Jo', service: 'Beard trim' },\n        { customer: 80, startsAt: 234, stylist: 'Ashley', service: 'Cut' },\n        { customer: 37, startsAt: 234, stylist: 'Jo', service: 'Blow-dry' },\n      ]\n  @params:\n    customers: an array of random customers\n    [\n        { id: 50 }, { id: 22 },\n        { id: 50 }, { id: 94 },\n        { id: 83 }, { id: 5 },\n        { id: 56 }, { id: 85 },\n        { id: 80 }, { id: 66 }\n      ]\n\n    timeslots: [\n        { startsAt: 234, stylists: [ 'Ashley', 'Jo' ] },\n        { startsAt: 234, stylists: [ 'Ashley', 'Jo' ] },\n        { startsAt: 234, stylists: [ 'Ashley', 'Jo' ] },\n    ]\n\n    services: ['Cut', 'Blow-dry', 'Extensions', 'Cut & color', 'Beard trim', 'Cut & beard trim', 'Extensions'];\n */\n\nfunction generateFakeAppointments(customers, timeslots) {\n  var appointments = [];\n  timeslots.forEach(function (timeSlot) {\n    var stylist = timeSlot.stylists.pickRandom();\n\n    if (shouldFillTimeSlot()) {\n      appointments.push({\n        customer: customers.pickRandom().id,\n        startsAt: timeSlot.startsAt,\n        stylist: stylist,\n        service: stylistServices[stylist].pickRandom()\n      });\n    }\n  });\n  return appointments;\n}\n\n//# sourceURL=webpack://appointments/./server/src/appointments.js?");

/***/ }),

/***/ "./server/src/customers.js":
/*!*********************************!*\
  !*** ./server/src/customers.js ***!
  \*********************************/
/*! namespace exports */
/*! export Customers [provided] [no usage info] [missing usage info prevents renaming] */
/*! export generateFakeCustomer [provided] [no usage info] [missing usage info prevents renaming] */
/*! export generateFakeCustomers [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"generateFakeCustomer\": () => /* binding */ generateFakeCustomer,\n/* harmony export */   \"generateFakeCustomers\": () => /* binding */ generateFakeCustomers,\n/* harmony export */   \"Customers\": () => /* binding */ Customers\n/* harmony export */ });\n/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ \"@babel/runtime/helpers/slicedToArray\");\n/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ \"@babel/runtime/helpers/defineProperty\");\n/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ \"@babel/runtime/helpers/classCallCheck\");\n/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ \"@babel/runtime/helpers/createClass\");\n/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var faker__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! faker */ \"faker\");\n/* harmony import */ var faker__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(faker__WEBPACK_IMPORTED_MODULE_4__);\n;\n\n\n\n\nfaker__WEBPACK_IMPORTED_MODULE_4__.locale = 'de';\n\nArray.prototype.flatMap = function (f) {\n  if (!f) return [];\n  return Array.prototype.concat.apply([], this.map(f));\n};\n\nArray.prototype.unique = function () {\n  return this.filter(function (value, index, self) {\n    return self.indexOf(value) === index;\n  });\n};\n\nvar generateFakeCustomer = function generateFakeCustomer(id) {\n  return {\n    id: id,\n    firstName: faker__WEBPACK_IMPORTED_MODULE_4__.name.firstName(),\n    lastName: faker__WEBPACK_IMPORTED_MODULE_4__.name.lastName(),\n    phoneNumber: faker__WEBPACK_IMPORTED_MODULE_4__.phone.phoneNumber()\n  };\n};\nvar generateFakeCustomers = function generateFakeCustomers() {\n  var customers = [];\n\n  for (var i = 0; i < 1500; i++) {\n    customers.push(generateFakeCustomer(i));\n  }\n\n  return customers;\n};\n/*\n  Utility class used in the Express server.\n  Def: customer = {\n      firstName: 'Ashley',\n      lastName: 'Jones',\n      phoneNumber: '123456789'\n    }\n  The class can:\n    0. be initialized with a list of mocked customers;\n    1. add a customer to an internal store object;\n    2. return the whole set of stored customers;\n    3. when adding customers it generates unique IDs\n    4. returns an error object when:\n        - a phone number is already used;\n        - the first name is blank;\n        - the last name is blank;\n        - the phone number is blank;\n     5. has a customer validation method, which returns true/false;\n     6. can search for a term among the fields of the stored customers, in which case;\n        - it returns the index of the customer that contains the search term;\n        - it returns empty array if no customer matches the search term;\n     7. can search for a customer in the list of input customers, in which case:\n        - it returns an empty array if no customer matches the search term;\n        - it does the search only starting from the beginning of the string;\n        - it only lists unique customers ids, even if the match happens in more then one field\n        - it sorts the results according to a sort column;\n        - it sorts in ascending or descending order;\n        - it limits the number of found customers to a max param;\n        - it pages the found customers according to an \"after\" param;\n        - it returns everything if no search term;\n        - it limits the results to max 10 by default;\n        - it sorts by default by the firstName;\n */\n\nvar Customers = /*#__PURE__*/function () {\n  function Customers() {\n    var initialCustomers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];\n\n    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2___default()(this, Customers);\n\n    this.nextId = 0;\n    this.customers = {};\n    this.add = this.add.bind(this);\n    this.isValid = this.isValid.bind(this);\n    initialCustomers.forEach(this.add);\n  }\n\n  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3___default()(Customers, [{\n    key: \"add\",\n    value: function add(customer) {\n      var calculatedId = this.nextId++;\n      var customerWithId = Object.assign({}, customer, {\n        id: calculatedId\n      });\n      this.customers[customerWithId.id] = customerWithId;\n      return customerWithId;\n    }\n  }, {\n    key: \"all\",\n    value: function all() {\n      return Object.assign({}, this.customers);\n    }\n  }, {\n    key: \"errors\",\n    value: function errors(customer) {\n      var errors = {};\n      errors = Object.assign(errors, this.requiredValidation(customer, 'firstName', 'First name is required'));\n      errors = Object.assign(errors, this.requiredValidation(customer, 'lastName', 'Last name is required'));\n      errors = Object.assign(errors, this.requiredValidation(customer, 'phoneNumber', 'Phone number is required'));\n      errors = Object.assign(errors, this.uniqueValidation('phoneNumber', customer.phoneNumber, 'Phone number'));\n      return errors;\n    }\n  }, {\n    key: \"requiredValidation\",\n    value: function requiredValidation(customer, field, fieldDescription) {\n      var _customer$field, _customer$field2;\n\n      if (!customer[field] || (customer === null || customer === void 0 ? void 0 : (_customer$field = customer[field]) === null || _customer$field === void 0 ? void 0 : _customer$field.length) === 0 || (customer === null || customer === void 0 ? void 0 : (_customer$field2 = customer[field]) === null || _customer$field2 === void 0 ? void 0 : _customer$field2.trim()) === '') {\n        return _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()({}, field, \"\".concat(fieldDescription));\n      }\n\n      return {};\n    }\n  }, {\n    key: \"uniqueValidation\",\n    value: function uniqueValidation(field, fieldValue, fieldDescription) {\n      if (Object.entries(this.customers).map(function (_ref2) {\n        var _ref3 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_ref2, 2),\n            _ = _ref3[0],\n            c = _ref3[1];\n\n        return c[field];\n      }).includes(fieldValue)) {\n        return _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()({}, field, fieldDescription + ' already exists in the system');\n      }\n\n      return {};\n    }\n  }, {\n    key: \"isValid\",\n    value: function isValid(customer) {\n      return Object.keys(this.errors(customer)).length === 0;\n    }\n    /*\n      returns ['1','3'] ==> the indexes of the elements having a prop containing the term\n     */\n\n  }, {\n    key: \"searchForTerm\",\n    value: function searchForTerm(term) {\n      var _this = this;\n\n      if (!term) return [];\n      var startsWith = new RegExp(\"^\".concat(term), 'i');\n      return Object.keys(this.customers).filter(function (customerId) {\n        var customer = _this.customers[customerId];\n        return startsWith.test(customer.firstName) || startsWith.test(customer.lastName) || startsWith.test(customer.phoneNumber);\n      });\n    }\n    /*\n        return [{id:0, firstName: 'Remus'},{id: 1, firstName: 'Sandra'}]\n     */\n\n  }, {\n    key: \"search\",\n    value: function search(_ref5) {\n      var _this2 = this;\n\n      var searchTerms = _ref5.searchTerms,\n          orderBy = _ref5.orderBy,\n          orderDirection = _ref5.orderDirection,\n          limit = _ref5.limit,\n          after = _ref5.after;\n      limit = limit || 10;\n      searchTerms = searchTerms || [''];\n      orderBy = orderBy || 'firstName';\n      orderDirection = orderDirection || 'asc';\n\n      if (!Array.isArray(searchTerms) || // return all if no search term\n      searchTerms.length === 1 && searchTerms[0] === '') {\n        return Object.entries(this.all()).map(function (v) {\n          return v[1];\n        }).sort(function (l, r) {\n          return l.firstName.localeCompare(r.firstName);\n        }).slice(0, 10);\n      }\n\n      var sorted = searchTerms.flatMap(function (term) {\n        return _this2.searchForTerm(term);\n      }) // brings bag the customer indexes having\n      // at least a field in the corresp. customer\n      // equal to search value\n      .unique().map(function (id) {\n        return _this2.customers[id];\n      }).sort(function (l, r) {\n        return orderDirection === 'desc' ? r[orderBy].localeCompare(l[orderBy]) : l[orderBy].localeCompare(r[orderBy]);\n      });\n      var afterPosition = after ? sorted.findIndex(function (c) {\n        return c.id === after;\n      }) + 1 : 0;\n      return sorted.slice(afterPosition, afterPosition + limit);\n    }\n  }]);\n\n  return Customers;\n}();\n\n//# sourceURL=webpack://appointments/./server/src/customers.js?");

/***/ }),

/***/ "./server/src/server.js":
/*!******************************!*\
  !*** ./server/src/server.js ***!
  \******************************/
/*! namespace exports */
/*! exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _app_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app.js */ \"./server/src/app.js\");\n/* harmony import */ var _customers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./customers */ \"./server/src/customers.js\");\n/* harmony import */ var _appointments__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./appointments */ \"./server/src/appointments.js\");\n;\n\n\nvar port = process.env.PORT || 9000;\nvar customers = (0,_customers__WEBPACK_IMPORTED_MODULE_1__.generateFakeCustomers)();\nvar timeSlots = (0,_appointments__WEBPACK_IMPORTED_MODULE_2__.buildTimeSlots)();\nvar appointments = (0,_appointments__WEBPACK_IMPORTED_MODULE_2__.generateFakeAppointments)(customers, timeSlots);\n(0,_app_js__WEBPACK_IMPORTED_MODULE_0__.buildApp)(customers, appointments, timeSlots).listen(port);\nconsole.log(\"Server listening on \".concat(port, \".\"));\n\n//# sourceURL=webpack://appointments/./server/src/server.js?");

/***/ }),

/***/ "./server/utilities/tools.js":
/*!***********************************!*\
  !*** ./server/utilities/tools.js ***!
  \***********************************/
/*! namespace exports */
/*! export conA [provided] [no usage info] [missing usage info prevents renaming] */
/*! export conP [provided] [no usage info] [missing usage info prevents renaming] */
/*! export conR [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"conR\": () => /* binding */ conR,\n/* harmony export */   \"conA\": () => /* binding */ conA,\n/* harmony export */   \"conP\": () => /* binding */ conP\n/* harmony export */ });\nvar _arguments = arguments;\nvar conR = function conR(response) {\n  return console.log(\"RRRRRRRRRRRRRRRRRRRRRRRR \".concat(_arguments[0], \"=\"), response);\n};\nvar conA = function conA(response) {\n  return console.log(\"AAAAAAAAAAAAAAAAAAAAAAAA \".concat(_arguments[0], \"=\"), response);\n};\nvar conP = function conP(response) {\n  return console.log(\"PPPPPPPPPPPPPPPPPPPPPPPP \".concat(_arguments[0], \"=\"), response);\n};\n\n//# sourceURL=webpack://appointments/./server/utilities/tools.js?");

/***/ }),

/***/ "./server/src/schema.graphql":
/*!***********************************!*\
  !*** ./server/src/schema.graphql ***!
  \***********************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (\"type Query {\\n    customers: [Customer]\\n    customer(id: ID!): Customer\\n    availableTimeSlots: [Appointment]\\n    appointments(from: String, to: String): [Appointment]\\n}\\n\\ntype Mutation {\\n    addAppointment(appointment: AppointmentInput): Appointment\\n    addCustomer(customer: CustomerInput): Customer\\n}\\n\\ninput CustomerInput {\\n    firstName: String,\\n    lastName: String,\\n    phoneNumber: String,\\n}\\n\\ntype Customer {\\n    id: ID\\n    firstName: String\\n    lastName: String\\n    phoneNumber: String\\n    appointments: [Appointment]\\n}\\n\\ninput AppointmentInput {\\n    startsAt: String\\n    customer: ID\\n}\\n\\ntype Appointment {\\n    startsAt: String\\n    stylist: String\\n    service: String\\n    notes: String\\n}\");\n\n//# sourceURL=webpack://appointments/./server/src/schema.graphql?");

/***/ }),

/***/ "@babel/runtime/helpers/classCallCheck":
/*!********************************************************!*\
  !*** external "@babel/runtime/helpers/classCallCheck" ***!
  \********************************************************/
/*! dynamic exports */
/*! export __esModule [maybe provided (runtime-defined)] [no usage info] [provision prevents renaming (no use info)] */
/*! other exports [maybe provided (runtime-defined)] [no usage info] */
/*! runtime requirements: module */
/***/ ((module) => {

eval("module.exports = require(\"@babel/runtime/helpers/classCallCheck\");;\n\n//# sourceURL=webpack://appointments/external_%22@babel/runtime/helpers/classCallCheck%22?");

/***/ }),

/***/ "@babel/runtime/helpers/createClass":
/*!*****************************************************!*\
  !*** external "@babel/runtime/helpers/createClass" ***!
  \*****************************************************/
/*! dynamic exports */
/*! export __esModule [maybe provided (runtime-defined)] [no usage info] [provision prevents renaming (no use info)] */
/*! other exports [maybe provided (runtime-defined)] [no usage info] */
/*! runtime requirements: module */
/***/ ((module) => {

eval("module.exports = require(\"@babel/runtime/helpers/createClass\");;\n\n//# sourceURL=webpack://appointments/external_%22@babel/runtime/helpers/createClass%22?");

/***/ }),

/***/ "@babel/runtime/helpers/defineProperty":
/*!********************************************************!*\
  !*** external "@babel/runtime/helpers/defineProperty" ***!
  \********************************************************/
/*! dynamic exports */
/*! export __esModule [maybe provided (runtime-defined)] [no usage info] [provision prevents renaming (no use info)] */
/*! other exports [maybe provided (runtime-defined)] [no usage info] */
/*! runtime requirements: module */
/***/ ((module) => {

eval("module.exports = require(\"@babel/runtime/helpers/defineProperty\");;\n\n//# sourceURL=webpack://appointments/external_%22@babel/runtime/helpers/defineProperty%22?");

/***/ }),

/***/ "@babel/runtime/helpers/slicedToArray":
/*!*******************************************************!*\
  !*** external "@babel/runtime/helpers/slicedToArray" ***!
  \*******************************************************/
/*! dynamic exports */
/*! export __esModule [maybe provided (runtime-defined)] [no usage info] [provision prevents renaming (no use info)] */
/*! other exports [maybe provided (runtime-defined)] [no usage info] */
/*! runtime requirements: module */
/***/ ((module) => {

eval("module.exports = require(\"@babel/runtime/helpers/slicedToArray\");;\n\n//# sourceURL=webpack://appointments/external_%22@babel/runtime/helpers/slicedToArray%22?");

/***/ }),

/***/ "@babel/runtime/helpers/toConsumableArray":
/*!***********************************************************!*\
  !*** external "@babel/runtime/helpers/toConsumableArray" ***!
  \***********************************************************/
/*! dynamic exports */
/*! export __esModule [maybe provided (runtime-defined)] [no usage info] [provision prevents renaming (no use info)] */
/*! other exports [maybe provided (runtime-defined)] [no usage info] */
/*! runtime requirements: module */
/***/ ((module) => {

eval("module.exports = require(\"@babel/runtime/helpers/toConsumableArray\");;\n\n//# sourceURL=webpack://appointments/external_%22@babel/runtime/helpers/toConsumableArray%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! dynamic exports */
/*! export __esModule [maybe provided (runtime-defined)] [no usage info] [provision prevents renaming (no use info)] */
/*! other exports [maybe provided (runtime-defined)] [no usage info] */
/*! runtime requirements: module */
/***/ ((module) => {

eval("module.exports = require(\"express\");;\n\n//# sourceURL=webpack://appointments/external_%22express%22?");

/***/ }),

/***/ "express-graphql":
/*!**********************************!*\
  !*** external "express-graphql" ***!
  \**********************************/
/*! dynamic exports */
/*! export __esModule [maybe provided (runtime-defined)] [no usage info] [provision prevents renaming (no use info)] */
/*! other exports [maybe provided (runtime-defined)] [no usage info] */
/*! runtime requirements: module */
/***/ ((module) => {

eval("module.exports = require(\"express-graphql\");;\n\n//# sourceURL=webpack://appointments/external_%22express-graphql%22?");

/***/ }),

/***/ "faker":
/*!************************!*\
  !*** external "faker" ***!
  \************************/
/*! dynamic exports */
/*! export __esModule [maybe provided (runtime-defined)] [no usage info] [provision prevents renaming (no use info)] */
/*! other exports [maybe provided (runtime-defined)] [no usage info] */
/*! runtime requirements: module */
/***/ ((module) => {

eval("module.exports = require(\"faker\");;\n\n//# sourceURL=webpack://appointments/external_%22faker%22?");

/***/ }),

/***/ "graphql":
/*!**************************!*\
  !*** external "graphql" ***!
  \**************************/
/*! dynamic exports */
/*! export __esModule [maybe provided (runtime-defined)] [no usage info] [provision prevents renaming (no use info)] */
/*! other exports [maybe provided (runtime-defined)] [no usage info] */
/*! runtime requirements: module */
/***/ ((module) => {

eval("module.exports = require(\"graphql\");;\n\n//# sourceURL=webpack://appointments/external_%22graphql%22?");

/***/ }),

/***/ "morgan":
/*!*************************!*\
  !*** external "morgan" ***!
  \*************************/
/*! dynamic exports */
/*! export __esModule [maybe provided (runtime-defined)] [no usage info] [provision prevents renaming (no use info)] */
/*! other exports [maybe provided (runtime-defined)] [no usage info] */
/*! runtime requirements: module */
/***/ ((module) => {

eval("module.exports = require(\"morgan\");;\n\n//# sourceURL=webpack://appointments/external_%22morgan%22?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => module['default'] :
/******/ 				() => module;
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./server/src/server.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;