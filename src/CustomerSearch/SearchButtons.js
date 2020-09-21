import React, {useCallback} from 'react';
import {ToggleRouterButton} from "./ToggleRouterButton";
import {RouterButton} from "./RouterButton";


export const SearchButtons = ({
  pathname,
  lastRowIds,
  searchTerm,
  limit,
  customers,
}) => {
  // console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX, ddd=', {
  //   pathname,
  //   lastRowIds,
  //   searchTerm,
  //   limit,
  //   customers,
  // })
  limit = limit || 10;

  const previousPageParams = useCallback(
    () => ({
      limit,
      searchTerm,
      lastRowIds: lastRowIds.slice(0,-1),
     }),
    [searchTerm, lastRowIds, limit]
  );

  const nextPageParams = useCallback(
    () => {
      let newLastRowIds =
        customers?.length > 1
          ? [...lastRowIds, customers[customers.length - 1].id]
          : lastRowIds;

      return { limit, searchTerm, lastRowIds: newLastRowIds};
    }, [searchTerm, lastRowIds, limit, customers]
  );

  const hasPrevious = () => lastRowIds.length > 0;
  const hasNext = () => customers.length === limit;

  const limitParams = useCallback((newLimit) => {
    return {searchTerm, lastRowIds, limit: newLimit}
  }, [searchTerm, lastRowIds]);

const toggleButton = (limitSize) => limit===limitSize;

  return (
    <div>
      <ToggleRouterButton
        id="limit-10"
        pathname = {pathname}
        toggled={toggleButton(10)}
        queryParams={limitParams(10)}>
          10
      </ToggleRouterButton>
      <ToggleRouterButton
        id="limit-20"
        pathname = {pathname}
        toggled={toggleButton(20)}
        queryParams={limitParams(20)}>
          20
      </ToggleRouterButton>
      <ToggleRouterButton
        id="limit-50"
        pathname = {pathname}
        toggled={toggleButton(50)}
        queryParams={limitParams(50)}>
          50
      </ToggleRouterButton>
      <ToggleRouterButton
        id="limit-100"
        pathname = {pathname}
        toggled={toggleButton(100)}
        queryParams={limitParams(100)}>
          100
      </ToggleRouterButton>
      <RouterButton
        id={'previous-page'}
        queryParams={previousPageParams()}
        disabled={!hasPrevious()}
        pathname={pathname}>
        Previous
      </RouterButton>
      <RouterButton
        id={'next-page'}
        queryParams={nextPageParams()}
        disabled={!hasNext()}
        pathname={pathname}
      >
        Next
      </RouterButton>
    </div>
  );
};