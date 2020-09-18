import React from 'react';
import {objectToQueryString} from "../objectToQueryString";
import {Link} from "react-router-dom";

export const RouterButton = ({
  pathname,
  queryParams,
}) => {
  return (
    <Link
      className={'button'}
      to={{
        pathname: pathname,
        search: objectToQueryString(queryParams),
      }}
    />
  )
};