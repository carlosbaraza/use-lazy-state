# useLazyState()

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

> Tiny `useLazyState` hook. Similar to `useState`, but giving you control over the re-rendering process. Subscribe to state changes in leaf components and don't re-render the entire component tree.

## Install

```bash
npm i use-lazy-state
```

## Demo

- [Code Sandbox Examples](https://codesandbox.io/s/use-lazy-state-0h6ub8?file=/src/App.tsx)

## Usage

### Simple state

```tsx
import { useLazyState, UseLazyState } from 'use-lazy-state';

/**
 * Creating state. Parent component.
 * - You can declare state using `const state = useLazyState()`.
 * - To re-render the component when state chages, use the
 *   internal hook `state.useState()`.
 * - If `state.useState()` is not used, the component would not be
 *   re-rendered when the state changes.
 */

export function ParentNoRerender() {
  console.log('Rendering ParentNoRerender');

  // Changes in the isOpen state will not trigger a re-render of the Parent
  // because it is not using isOpen.useState()
  const isOpen = useLazyState(false);

  // isOpen.setState() would trigger a re-render on
  // any component using isOpen.useState()
  const onClick = () => isOpen.setState(prev => !prev);

  return (
    <div>
      <button onClick={onClick}>Toggle Open</button>
      <ChildUsingState isOpen={isOpen} />
    </div>
  );
}

/**
 * Subscribing to state changes. Child component.
 * - Opt-in all state changes with `state.useState()` or
 *   a particular part of the state using a getter
 *   `.useState((state) => state.whatever)`.
 * - Changes in the state are compared with === and the
 *   state change would only be triggered if a change
 *   is detected.
 */

function ChildUsingState(props: { isOpen: UseLazyState<boolean> }) {
  console.log('Rendering ChildUsingState');

  // Subscribe to state to get state updates
  const isOpen = props.isOpen.useState();

  // isOpen will change whenever an update to the state is triggered (compared with ===)
  if (!isOpen) return null;

  return <div>Opened</div>;
}
```

This would `console.log` the following:

```
Rendering ParentNoRerender
Rendering ChildUsingState

...after clicking the toggle button
Rendering ChildUsingState
```

### Complex state (List)

```tsx
import { useLazyState, UseLazyState } from 'use-lazy-state';

/**
 * Creating state. Parent component.
 * - You can declare state using `const state = useLazyState()`.
 * - To re-render the component when state chages, use the
 *   internal hook `state.useState()`.
 * - If `state.useState()` is not used, the component would not be
 *   re-rendered when the state changes.
 */

export function List() {
  console.log('Rendering List');

  // Declare state in the parent. Changes to the array
  // won't trigger a re-render in the parent because it
  // is not using `numberList.useState()`
  const numberList = useLazyState([0, 0, 0]);

  return (
    <div className="space-y-3">
      <ListItem numberList={numberList} indexToRender={0} />
      <ListItem numberList={numberList} indexToRender={1} />
      <ListItem numberList={numberList} indexToRender={2} />
    </div>
  );
}

/**
 * Subscribing to state changes. Child component.
 * - Opt-in all state changes with `state.useState()` or
 *   a particular part of the state using a getter
 *   `.useState((state) => state.whatever)`.
 * - Changes in the state are compared with === and the
 *   state change would only be triggered if a change
 *   is detected.
 */

type Props = {
  numberList: UseLazyState<number[]>;
  indexToRender: number;
};

function ListItem({ numberList, indexToRender }: Props) {
  console.log(`Rendering ListItem[${indexToRender}]`);

  const n = numberList.useState(
    // Getter. Get the full state object and return either the
    // full object or a part you want. Changes are compared
    // with === to prevent rendering if an object reference
    // did not change.
    numbers => numbers[indexToRender]
  );

  const addOne = () => {
    numberList.setState(
      // Setter. Get the full previous state object and
      // return the new full state.
      prev => {
        prev[indexToRender] = prev[indexToRender] + 1;

        // Create a new object because changes are compared with ===
        return [...prev];
      }
    );
  };

  return (
    <div>
      ListItem[{indexToRender}]: {n} <button onClick={addOne}>+1</button>
    </div>
  );
}
```

This would `console.log` the following:

```
Rendering List
Rendering ListItem[0]
Rendering ListItem[1]
Rendering ListItem[2]

...after clicking +1 on item ListItem[0]
Rendering ListItem[0]

...after clicking +1 on item ListItem[1]
Rendering ListItem[0]

...after clicking +1 on item ListItem[2]
Rendering ListItem[2]
```

## API

### useLazyState<T>(initialState: T)

- Declare state object. Changes to the state would not trigger a re-render, unless you
  subscribed to state changes with `state.useState()`.
- Returns `UseLazyState<T>`

### UseLazyState.useState(getter?: (state) => any)

- Subscribes the component to state changes
- Returns full state object or a part of the state using the getter

### UseLazyState.setState()

- Call `setState(newState)` to set the full state object
- Alternatively, use a setter `setState(prev => ({...prev, property: newValue}))` to get
  the latest full state value before updating the state.
- Changes to the state would not trigger a re-render on this component, unless you subscribed
  the component to changes with `.useState()`.
- Returns `undefined` (`void`)

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
