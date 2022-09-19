import { useEffect, useRef, useState } from 'react';

export type UseLazyStateSetter<T> = (prev: T) => T;
export type UseLazyState<T> = {
  _stateRef: any;
  setState: (action: T | UseLazyStateSetter<T>) => void;
  useState: <D = T>(getter?: (state: T) => D) => D;
};

type Subscriber = {
  id: number;
  triggerUpdate: () => void;
};

export const useLazyState = <T>(initialState: T): UseLazyState<T> => {
  const subscriberId = useRef<number>(0);
  const ref = useRef<T>(initialState);

  const subscribers = useRef<Subscriber[]>([]);

  const setState: UseLazyState<T>['setState'] = action => {
    if (typeof action === 'function') {
      ref.current = (action as UseLazyStateSetter<T>)(ref.current);
    } else {
      const state = action;
      ref.current = state;
    }
    for (const subscriber of subscribers.current) {
      subscriber.triggerUpdate();
    }
  };

  const _useState = function _useState<D = T>(_getter?: (state: T) => D): D {
    const getter =
      typeof _getter === 'undefined' ? (state: T): T => state : _getter;

    if (typeof getter !== 'function')
      throw new Error('Getter must be a function');

    const innerInitialState = getter(initialState);

    // stateRef to maintain a reference to an object that triggerUpdate could point to
    const currentStateRef = useRef<any>(innerInitialState);

    // useState to trigger react rendering when it is updated
    const [currentState, setCurrentState] = useState(innerInitialState);

    // Subscribe the hook to get global updates when changes happen in the state
    useEffect(() => {
      const id = subscriberId.current;
      subscribers.current.push({
        id,
        triggerUpdate: () => {
          const newState = getter(ref.current);
          const currentState = currentStateRef.current;
          if (currentState && newState === currentState) return; // no need to update state
          // update state
          currentStateRef.current = newState;
          setCurrentState(newState);
        },
      });
      subscriberId.current = subscriberId.current + 1;
      return () => {
        subscribers.current = subscribers.current.filter(s => s.id !== id);
      };
    }, []);

    return currentState as D;
  };

  return {
    _stateRef: ref,
    setState,
    useState: _useState,
  };
};
