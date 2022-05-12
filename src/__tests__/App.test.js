import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import App from '../App';

it('renders without crashing', () => {
  const container = document.createElement('div');
  render(<App />, container);
  unmountComponentAtNode(container);
});
