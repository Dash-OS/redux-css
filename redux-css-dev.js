import Immutable from 'seamless-immutable';

import {
  setVariable,
  setAllVariables,
  // getVariable,
  // getAllVariables,
  removeVariable,
  // removeAllVariables,
} from './utils/css';

const buildReducer = reducer => reducer;

export function flattenVars(value, accum = {}, prefix = '') {
  return Object.keys(value).reduce((p, c) => {
    if (typeof value[c] === 'object') {
      flattenVars(value[c], p, `${prefix}${c}`);
    } else {
      p[`${prefix}${c}`] = value[c];
    }
    return p;
  }, accum);
}

const handleVar = function cssHandleVariable(varName, value) {
  if (value !== undefined && value !== null) {
    setVariable(varName, value);
  } else {
    removeVariable(varName);
  }
};

const getChangedVars = function cssGetChangedVars(prev, next, accum = new Map(), prefix = '') {
  if (prev !== next) {
    Object.keys(next).forEach(key => {
      if (prev[key] !== next[key]) {
        if (typeof next[key] === 'object') {
          getChangedVars(prev[key], next[key], accum, `${prefix}${key}`);
        } else {
          accum.set(`${prefix}${key}`, next[key]);
        }
      }
    });
  }
  return accum;
};

const middleware = function cssReducerMiddlewareRunner(reducer, currentVars, action, state) {
  const nextVars = reducer(currentVars, action, state);
  if (nextVars !== currentVars) {
    getChangedVars(currentVars, nextVars).forEach((varValue, varName) =>
      handleVar(varName, varValue),
    );
  }
  return nextVars;
};

export default function cssReducerMiddleware(initialReducer, _initialVars) {
  let reducer = buildReducer(initialReducer);

  const initialVars = Immutable.from(_initialVars || {});

  let currentVars = reducer(initialVars, {
    type: '@@CSS-REDUX/init',
  });

  setAllVariables(flattenVars(currentVars));

  return {
    middleware: store => next => action => {
      try {
        currentVars = middleware(reducer, currentVars, action, store.getState());
      } catch (e) {
        console.error('[redux-css] : ', e.message, e);
      }
      return next(action);
    },
    replaceReducer: nextReducer => {
      reducer = buildReducer(nextReducer);
      currentVars = reducer(currentVars, reducer);
      setAllVariables(flattenVars(currentVars));
    },
    setVariable: (varName, value) => {
      const prevValue = currentVars[varName];
      if (prevValue !== value) {
        setVariable(varName, value);
        currentVars[varName] = value;
      }
      return prevValue;
    },
    setAllVariables: (vars = {}) => getChangedVars(currentVars, vars),
    getVariable: varName => currentVars[varName],
    getAllVariables: () => Immutable.asMutable(currentVars),
    removeVariable: varName => {
      if (currentVars[varName]) {
        removeVariable(varName);
        delete currentVars[varName];
      }
    },
  };
}
