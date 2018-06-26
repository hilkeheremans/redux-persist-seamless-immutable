# redux-persist-seamless-immutable

This package lets you use `seamless-immutable` on a per-reducer basis along with `redux-persist v5`.

Lots of people seem to have trouble with this, so I decided to cobble together a quick fix.

> Update to v2: easy-to-fix breaking change; `seamlessImmutableTransformer` has changed to `seamlessImmutableTransformCreator` to better reflect its new status as a function.

## Why

> Why is this package for me?

You love using `seamless-immutable` with `redux` and `redux-persist` and found yourself enthusiastically upgrading to `redux-persist v5`.

Having read the `redux-persist` docs for v5 you already know that it no longer supports top-level immutable state. But you don't use immutable at that level -- you use it on a per-reducer basis, with top-level state still being a POJO.

You trod on. But, even after using a custom transformer, you then find v5 is consistently throwing you `state.merge is not a function` as soon as any immutable reducer changes state.

## Usage

`npm i redux-persist-seamless-immutable` or `yarn add redux-persist-seamless-immutable`.

### v5

```
import { seamlessImmutableReconciler, seamlessImmutableTransformCreator } from 'redux-persist-seamless-immutable'

const transformerConfig = {
  whitelistPerReducer: {
      reducerA: ['keyA', 'keyB']
  },
  blacklistPerReducer: {
      reducerB: ['keyC', 'keyD']
  }
}

const fooConfig = {
  key: 'foo',
  storage: LocalStorage,
  stateReconciler: seamlessImmutableReconciler,
  transforms: [seamlessImmutableTransformCreator(transformerConfig)]
}
```

#### tranformerConfig
The transformer can accept a config object with the following keys, which will allow you to white or blacklist specific keys per reducer.
```
{
  whitelistPerReducer: {
      reducerA: ['keyA', 'keyB']
  },
  blacklistPerReducer: {
      reducerB: ['keyC', 'keyD']
  }
}
```

## Credits

The transformation is based on comments over at `https://github.com/rt2zz/redux-persist/issues/133`. Thanks to @josev55 and @robclouth. Also kind thanks to @aaronisme and @tasos14 for their contributions!
