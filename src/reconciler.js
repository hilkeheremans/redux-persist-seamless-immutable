const { isImmutable, toImmutable } = require('./helpers');

const seamlessImmutableReconciler = (
  inboundState,
  originalState,
  reducedState,
  { debug, mergeDeep = false }
) => {
  let newState = { ...reducedState };
  // only rehydrate if inboundState exists and is an object
  if (inboundState && typeof inboundState === 'object') {
    Object.keys(inboundState).forEach(key => {
      // ignore _persist data
      if (key === '_persist') return;
      // if reducer modifies substate, skip auto rehydration
      if (originalState[key] !== reducedState[key]) {
        if (process.env.NODE_ENV !== 'production' && debug) {
          // eslint-disable-next-line no-console
          console.log(
            'redux-persist/stateReconciler: sub state for key `%s` modified, skipping.',
            key
          );
        }

        return;
      }
      if (isPlainEnoughObject(reducedState[key])) {
        // if object is plain enough shallow merge the new values (hence "Level2")
        newState[key] = { ...newState[key], ...inboundState[key] };
        return;
      } else if (isImmutable(reducedState[key])) {
        // if this is a seamless-immutable state slice and object use its own merge function
        if (isObject(newState[key])) {
          newState[key] = newState[key].merge(inboundState[key], {
            deep: mergeDeep
          });
        } else {
          // otherwise use seamless-immutable
          newState[key] = toImmutable(inboundState[key]);
        }
        return;
      }
      // otherwise hard set
      newState[key] = inboundState[key];
    });
  }

  if (
    process.env.NODE_ENV !== 'production' &&
    debug &&
    inboundState &&
    typeof inboundState === 'object'
  ) {
    console.log(
      `redux-persist/stateReconciler: rehydrated keys '${Object.keys(
        inboundState
      ).join(', ')}'`
    );
  }

  return newState;
};

function isObject(o) {
  return o !== null && !Array.isArray(o) && typeof o === 'object';
}

function isPlainEnoughObject(o) {
  return (
    o !== null && !Array.isArray(o) && typeof o === 'object' && !isImmutable(o)
  );
}

module.exports = {
  seamlessImmutableReconciler
};
