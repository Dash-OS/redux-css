# Redux CSS Middleware

Use the redux pattern to control CSS Variables.  You provide redux-style reducers
that set your variable values when changed, allowing you to style your app in many
new ways.

## Installation

```
yarn add redux-css
```

**or**

```
npm install --save redux-css
```

## Example

```js
import { createStore, applyMiddleware, compose } from 'redux'
import reduxCSS from 'redux-css'
import reducers from './reducers'

const initialStyles = {
  navbarHeight: '50px'
}

const styleReducer = (vars = initialStyles, action, state) => {
  switch(action.type) {
    case 'DEVICE_ORIENTATION': {
      return {
        ...vars,
        navbarHeight: action.orientation === 'portrait'
          ? '50px'
          : '60px'
      }
    }
  }
  return vars
}

const configureStore = (initialState = {}, hooks = {}) => {
  const middlewares = []

  // exposes: css.getVariable, css.setVariable, css.removeVariable, css.middleware
  const {
    middleware: cssMiddleware,
    ...css
  } = reduxCSS(
    // our style reducers
    styleReducer
  )

  const enhancers = compose(
    // Middleware store enhancer.
    applyMiddleware(
      cssMiddleware
    )
  )

  const store = createStore(
    reducers,
    initialState,
    enhancers
  )

  return { store, css }
}
```