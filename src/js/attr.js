export const make = (name, value = '') => ({ name, value });

export const addValue = (attr, value) => ({ ...attr, value: attr.value + value });
