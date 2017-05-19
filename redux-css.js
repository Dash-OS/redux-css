import { isObjLiteral } from './utils/helpers'

import * as generators from './utils/reducerGenerators'
import {
  setVariable,
  setAllVariables,
  getVariable,
  getAllVariables,
  removeVariable,
  removeAllVaraibles
} from './utils/css'

const buildReducer = reducer => {
  let formattedReducer
  formattedReducer = reducer
  return formattedReducer
}

const middleware = (reducer, currentVars, action, state) => {
  const nextVars = reducer(currentVars, action, state)
  if ( nextVars !== currentVars ) {
    new Set([...Object.keys(currentVars), ...Object.keys(nextVars)])
      .forEach(varName => {
        if ( currentVars[varName] !== nextVars[varName] ) {
          const value = nextVars[varName]
          if ( value !== undefined ) {
            setVariable(varName, value)
            currentVars[varName] = value
          } else {
            removeVariable(varName)
            delete currentVars[varName]
          }
        }
      })
  }
}

export default (initialReducer, initialVars) => {


  let reducer = buildReducer(initialReducer)

  let currentVars = Object.assign({}, initialVars, reducer(initialVars, {
    type: '@@CSS-REDUX/init'
  }))

  setAllVariables(currentVars)

  return {
    middleware: store => next => action => {
      middleware(reducer, currentVars, action, store.getState())
      return next(action)
    },
    replaceReducer: nextReducer => {
      reducer = buildReducer(nextReducer)
    },
    getVars: () => Object.assign({}, currentVars),
    setVariable: (varName, value) => {
      const prevValue = currentVars[varName]
      if ( prevValue !== value ) {
        currentVars[varName] = value
        setVariable(varName, value)
      }
      return prevValue
    },
    getVariable: varName => currentVars[varName],
    removeVariable: varName => {
      if ( currentVars[varName] ) {

        delete currentVars[varName]
      }
    }
  }
}

if ( module.hot ) {
  module.hot.accept()
}