# use-lazy-state

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

> Simple `useLazyState` hook. Similar to `useState` but each component using the state needs to opt-in the state changes. This is very useful to prevent re-rendering an entire tree when only a child should be actually re-rendered.

## Install

```bash
npm install use-lazy-state
```

## Usage

Create a state in the parent. Changes to the array will not trigger a re-render in the parent, because it is not using `useState`:

```tsx
import { useLazyState } from 'use-lazy-state';

const Parent = () => {
  const numberList = useLazyState([0, 0, 0]);

  return (
    <div>
      <Child state={numberList} index={0} />
      <Child state={numberList} index={1} />
      <Child state={numberList} index={2} />
    </div>
  );
};
```

Opt-in the state changes with `state.useState`. Re-renders will only trigger when the state returned from the getter has changed (uses `===` to check changes):

```tsx
type Props = {
  numberList: UseLazyState<number[]>;
  index: number;
};

const Child = ({ numberList, index }: Props) => {
  const n = numberList.useState(s => s[index]);

  const addOne = () => {
    numberList.setState(prev => {
      prev[index] = prev[index] + 1;
      return [...prev];
    });
  };

  return (
    <div>
      Number: {n}
      <button onClick={addOne}>+1 [{index}]</button>
    </div>
  );
};
```

The `Child` component would only re-render when the state returned from your getter actually changes.

## Demo

- [CodeSandbox demo](https://codesandbox.io/s/uselazystate-5ti537?file=/src/useLazyState.ts)

## API

```
export type UseLazyState<T> = {
  _stateRef: any;
  setState: (action: T | UseLazyStateSetter<T>) => void;
  useState: <D = T>(getter?: (state: T) => D) => D;
};

export type UseLazyStateSetter<T> = (prev: T) => T;
```

[build-img]: https://github.com/carlosbaraza/use-lazy-state/actions/workflows/release.yml/badge.svg
[build-url]: https://github.com/carlosbaraza/use-lazy-state/actions/workflows/release.yml
[downloads-img]: https://img.shields.io/npm/dt/use-lazy-state
[downloads-url]: https://www.npmtrends.com/use-lazy-state
[npm-img]: https://img.shields.io/npm/v/use-lazy-state
[npm-url]: https://www.npmjs.com/package/use-lazy-state
[issues-img]: https://img.shields.io/github/issues/carlosbaraza/use-lazy-state
[issues-url]: https://github.com/carlosbaraza/use-lazy-state/issues
[codecov-img]: https://codecov.io/gh/carlosbaraza/use-lazy-state/branch/main/graph/badge.svg
[codecov-url]: https://codecov.io/gh/carlosbaraza/use-lazy-state
[semantic-release-img]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[commitizen-img]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/
