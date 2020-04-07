// @flow
export const getMarkupOrNull = (func: Function, condition: boolean) =>
  condition ? func() : null;
