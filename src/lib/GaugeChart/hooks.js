import { useEffect } from "react";

// A simple useEffect alternative for dependencies with arrays/objects by serialising to JSON string.
// As recommended by Facebook guru Dan Abramov (gaearon) for small objects:
// https://github.com/facebook/react/issues/14476#issuecomment-471199055
export const useDeepCompareEffect = (effect, deps) => {
  useEffect(effect, [JSON.stringify(deps)]);
};
