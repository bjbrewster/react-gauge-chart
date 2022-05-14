import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import { useDeepCompareEffect } from '../lib/GaugeChart/hooks'

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe("useDeepCompareEffect", () => {
  const Test = ({ callback, dependencies }) => {
    useDeepCompareEffect(callback, dependencies);
    return null;
  }

  const callback = jest.fn()

  beforeEach(() => {
    callback.mockReset();
  })

  it('calls callback on initial render', () => {
    act(() => {
      render(<Test callback={callback} dependencies={['foo']} />, container);
    });

    expect(callback).toHaveBeenCalled();
  });

  it('calls callback when dependencies change', () => {
    act(() => { render(<Test callback={callback} dependencies={['foo']} />, container); });
    act(() => { render(<Test callback={callback} dependencies={['bar']} />, container); });
    act(() => { render(<Test callback={callback} dependencies={['baz']} />, container); });
    act(() => { render(<Test callback={callback} dependencies={[42]} />, container); });
    act(() => { render(<Test callback={callback} dependencies={[true]} />, container); });

    expect(callback).toHaveBeenCalledTimes(5);
  });

  it('does not call callback when dependencies do not change', () => { 
    act(() => { render(<Test callback={callback} dependencies={['foo']} />, container); });
    act(() => { render(<Test callback={callback} dependencies={['foo']} />, container); });
    act(() => { render(<Test callback={callback} dependencies={['foo']} />, container); });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('does not call callback when callback function changed', () => { 
    act(() => { render(<Test callback={() => callback()} dependencies={['foo']} />, container); });
    act(() => { render(<Test callback={() => callback()} dependencies={['foo']} />, container); });
    act(() => { render(<Test callback={() => callback()} dependencies={['foo']} />, container); });

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
