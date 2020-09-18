import React from 'react';
import {Link} from "react-router-dom";
import {createShallowRenderer} from "../shallowHelpers";
import {ToggleRouterButton} from '../../src/CustomerSearch/ToggleRouterButton';

describe('ToggleRouterButton', () => {
  const pathname='/path';
  const queryParams = {a: '123', b: '234'};
  let elementMatching, root, render;
  beforeEach(() => {
    ({
      elementMatching,
      root,
      render
    } = createShallowRenderer());
  });

  it('renders a link', () => {
    render(
      <ToggleRouterButton
        pathname={pathname}
        queryParams={queryParams}
      />
    );
    expect(root().type).toEqual(Link);
    expect(root().props.className).toContain('button');
    expect(root().props.to).toEqual({
      pathname: '/path',
      search: '?a=123&b=234'
    })
  });
});