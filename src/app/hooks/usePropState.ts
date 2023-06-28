import { useEffect, useState } from "react";

const usePropState = <T>(prop: T) => {
  const [state, setState] = useState(prop);
  useEffect(() => setState(prop), [prop]);
  return [state, setState] as [T, typeof setState];
};

export default usePropState;