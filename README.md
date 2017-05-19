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
  navbarHeight: '55px',
  navbarPaddingTop: '0px'
}

const styleReducer = (vars = initialStyles, action, state) => {
  switch(action.type) {
    case 'DEVICE_ORIENTATION': {
      return {
        ...vars,
        navbarHeight: action.orientation === 'portrait'
          ? '55px'
          : '50px',
        navbarPaddingTop: action.orientation === 'portrait'
          : '5px'
          : '0px'
      }
    }
  }
  return vars
}

const configureStore = (initialState = {}) => {

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

## API

#### css.setVariable(varName, value)

Set a CSS Variable if changed from it's current value.  Returns the previous
value of the variable (if any).

```js
css.setVariable('primaryBG', '#303641')
```

#### css.setAllVariables(variables)

Take an Object Literal and sets each of its keys as CSS Variables with their values.

```js
css.setAllVariables({
  primaryBG: '#303641',
  secondaryBG: '#121519'
})
```

#### css.getVariable(varName)

Gets the given CSS Variables current value.

```js
const primaryBG = css.getVariable('primaryBG')
```

#### css.getAllVariables

Gets all of the current variables.  Currently this only captures the variables
that redux-css is handling.


```js
const variables = css.getAllVariables()
```

#### css.removeVariable(varName)

Remove the given CSS Variable.

```js
css.removeVariable('navbarPadding')
```

#### css.middleware

Redux CSS Middleware to be passed to redux.

```js
applyMiddleware(css.middleware)
```
