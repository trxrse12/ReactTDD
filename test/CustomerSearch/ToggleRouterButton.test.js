import React from 'react';
import {Link} from "react-router-dom";
import {createShallowRenderer} from "../shallowHelpers";
import {ToggleRouterButton} from '../../src/CustomerSearch/ToggleRouterButton';

describe('ToggleRouterButton', () => {
  let elementMatching, root, render;
  beforeEach(() => {
    ({
      elementMatching,
      root,
      render
    } = createShallowRenderer());
  });

  it('renders a link', () => {
    render(<ToggleRouterButton/>);
    expect(root().type).toEqual(Link);
  });
});