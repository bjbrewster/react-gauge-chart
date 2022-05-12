import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import GaugeChart from '../lib/GaugeChart'
import { renderChart } from '../lib/GaugeChart/utils'

jest.mock('../lib/GaugeChart/utils')

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);

  jest.resetAllMocks();
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders", () => {
  act(() => {
    render(<GaugeChart />, container);
  });

  expect(container.querySelector("svg")).toBeTruthy();
  expect(renderChart).toHaveBeenCalled();
});
