
const setVariable = (varName, value) =>
  document.documentElement
    .style
    .setProperty(`--${varName.replace('--', '')}`, value)

const setAllVariables = vars =>
  Object.keys(vars)
    .forEach(varName => setVariable(varName, vars[varName]))

const getVariable = varName =>
  window.getComputedStyle(document.documentElement)
    .getPropertyValue(`--${varName.replace('--', '')}`)

const getAllVariables = varNames =>
  varNames.reduce((p, c) => {
    p[c] = getVariable(c)
    return p
  }, {})

const removeVariable = varName =>
  document.documentElement
    .style
    .removeProperty(`--${varName.replace('--', '')}`)

const removeAllVariables = varNames =>
  varNames.forEach(varName => removeVariable(varName))

export {
  setVariable,
  setAllVariables,
  getVariable,
  getAllVariables,
  removeVariable,
  removeAllVariables,
}