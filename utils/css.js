const setVariable = function setCSSVariable(varName, value) {
  return document.documentElement.style.setProperty(`--${varName.replace('--', '')}`, value);
};

const setAllVariables = function setAllCSSVariables(vars) {
  return Object.keys(vars).forEach(varName => setVariable(varName, vars[varName]));
};

const getVariable = function getCSSVariable(varName) {
  return window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(`--${varName.replace('--', '')}`);
};

const getAllVariables = function getAllCSSVariables(varNames) {
  return varNames.reduce((p, c) => {
    p[c] = getVariable(c);
    return p;
  }, {});
};

const removeVariable = function removeCSSVariable(varName) {
  return document.documentElement.style.removeProperty(`--${varName.replace('--', '')}`);
};

const removeAllVariables = function removeAllCSSVariables(varNames) {
  return varNames.forEach(varName => removeVariable(varName));
};

export {
  setVariable,
  setAllVariables,
  getVariable,
  getAllVariables,
  removeVariable,
  removeAllVariables,
};
