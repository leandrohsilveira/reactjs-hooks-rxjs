import { useEffect, useState } from "react";

export function useObservable(observable, initialState) {
  const [value, setValue] = useState(initialState);

  useEffect(() => {
    const subscription = observable.subscribe(newValue => {
      setValue(newValue);
    });
    return () => subscription.unsubscribe();
  }, []);

  return value;
}
