import React from 'react';
import {createShallowRenderer, id} from "../shallowHelpers";
import {ToggleRouterButton} from "../../src/CustomerSearch/ToggleRouterButton";
import {RouterButton} from "../../src/CustomerSearch/RouterButton";
import {SearchButtons} from '../../src/CustomerSearch/SearchButtons';

const tenCustomers = Array.from('0123456789', id => ({id}));

describe('Search Customers', () => {

  let render, elementMatching, root;
  beforeEach(() => {
    ({
      render,
      elementMatching,
      root,
    } = createShallowRenderer());
  });

  const renderSearchButtons = props =>
    render(
      <SearchButtons
        pathname={'/path'}
        lastRowIds={['123']}
        customers={tenCustomers}
        {...props}
      >
      </SearchButtons>
    );

  describe('previous button', () => {
    it('renders', () => {
      renderSearchButtons();
      const button = elementMatching(
        id('previous-page')
      );
      expect(button).toBeDefined();
      expect(button.type).toEqual(RouterButton);
      expect(button.props.children).toEqual('Previous');
      expect(button.props.pathname).toEqual('/path');
      expect(button.props.disabled).toBeFalsy();
    });

    it('removes last appended row ID from queryParams prop', () => {
      renderSearchButtons({lastRowIds: ['123', '234']});
      const button = elementMatching(id('previous-page'));
      expect(button.props.queryParams.lastRowIds).toEqual(['123']);
    });

    it('includes limit and search term in queryParams prop', () => {
      renderSearchButtons({limit: 20, searchTerm: 'name'});
      const button = elementMatching(id('previous-page'));
      expect(button.props.queryParams).toMatchObject({
        limit: 20,
        searchTerm: 'name',
      })
    });

    it('is disabled if there are no lastRowIds', () => {
      renderSearchButtons({lastRowIds:[]});
      const button = elementMatching(id('previous-page'));
      expect(button.props.disabled).toBeTruthy();
    });
  });

  describe('next button', () => {
    it('renders', () => {
      renderSearchButtons();
      const button = elementMatching(
        id('next-page')
      );
      expect(button).toBeDefined();
      expect(button.type).toEqual(RouterButton);
      expect(button.props.children).toEqual('Next');
      expect(button.props.pathname).toEqual('/path');
      expect(button.props.disabled).toBeFalsy();
    });

    it('appends the next last row ID to lastRowIds in queryParams prop', () => {
      renderSearchButtons();
      const button = elementMatching(
        id('next-page')
      );
      expect(button.props.queryParams.lastRowIds).toEqual(['123', '9']);
    });

    it('includes limit and search term in queryParams prop', () => {
      renderSearchButtons({limit: 20, searchTerm: 'name'});
      const button = elementMatching(id('next-page'));
      expect(button.props.queryParams).toMatchObject({
        limit: 20,
        searchTerm: 'name',
      });
    });

    it('is disabled if there are fewer records than the paga limit shown', () => {
      renderSearchButtons({customers: []});
      const button = elementMatching(id('next-page'));
      expect(button.props.disabled).toBeTruthy();
    });
  });
});