import React from 'react';
import {CustomerSearch} from "./CustomerSearch";

export const CustomerSearchRoute = props =>
  (
    <CustomerSearch
      {...props}
      renderCustomerActions={()=>null}
    />
  );