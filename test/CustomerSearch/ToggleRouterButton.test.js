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

  it('renders children', () => {
    render(<ToggleRouterButton queryParams={queryParams}>
        child text
    </ToggleRouterButton>);
    expect(root().props.children).toEqual('child text');
  });

  it('add toggled class if toggled pro is true', () => {
    render(<ToggleRouterButton toggled={true} queryParams={queryParams} />);
    expect(root().props.className).toContain('toggled');
  })
});