/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type queryCustomerQueryVariables = {|
  id: string
|};
export type queryCustomerQueryResponse = {|
  +customer: ?{|
    +id: ?string,
    +firstName: ?string,
    +lastName: ?string,
    +phoneNumber: ?string,
    +appointments: ?$ReadOnlyArray<?{|
      +startsAt: ?string,
      +stylist: ?string,
      +service: ?string,
      +notes: ?string,
    |}>,
  |}
|};
export type queryCustomerQuery = {|
  variables: queryCustomerQueryVariables,
  response: queryCustomerQueryResponse,
|};
*/


/*
query queryCustomerQuery(
  $id: ID!
) {
  customer(id: $id) {
    id
    firstName
    lastName
    phoneNumber
    appointments {
      startsAt
      stylist
      service
      notes
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "concreteType": "Customer",
    "kind": "LinkedField",
    "name": "customer",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "firstName",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "lastName",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "phoneNumber",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Appointment",
        "kind": "LinkedField",
        "name": "appointments",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "startsAt",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "stylist",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "service",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "notes",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "queryCustomerQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "queryCustomerQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "c873cbb36c907b140cd9e0099e874d15",
    "id": null,
    "metadata": {},
    "name": "queryCustomerQuery",
    "operationKind": "query",
    "text": "query queryCustomerQuery(\n  $id: ID!\n) {\n  customer(id: $id) {\n    id\n    firstName\n    lastName\n    phoneNumber\n    appointments {\n      startsAt\n      stylist\n      service\n      notes\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '3d7300ba2c8fef94896cfdd4aeb015f5';

module.exports = node;
