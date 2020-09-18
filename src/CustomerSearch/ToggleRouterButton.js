import React from 'react';
import {Link} from "react-router-dom";
import {objectToQueryString} from "../objectToQueryString";

export const ToggleRouterButton = ({
  pathname,
  queryParams,
}) =>  {
  return (
    <Link
      className={'button'}
      to={{
        pathname: pathname,
        search: objectToQueryString(queryParams),
      }}
    />
  );
};
