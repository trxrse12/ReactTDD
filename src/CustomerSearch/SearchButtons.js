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

  return (
    <div>
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
}