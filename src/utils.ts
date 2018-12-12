export const isListener = (name: string) => name.startsWith("on");
export const isAttribute = (name: string) => !isListener(name) && name !== 'children';

export const isTextElement = (type: string | number) => type === 'TEXT_ELEMENT';

const getType = (v: any) => Object.prototype.toString.call(v).slice(8, -1).toLowerCase();

function isPlainObject(obj: any): boolean {
  if (typeof obj !== 'object' || obj === null) return false

  let proto = obj
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto)
  }

  return Object.getPrototypeOf(obj) === proto
}

export const isFalsy = (v: any) => {
  const type = getType(v);
  if (type === 'array' && v.length === 0) {
    return true;
  } else if (isPlainObject(v) && Object.keys(v).length === 0) {
    return true;
  } else if (type === 'undefined') {
    return true;
  } else if (type === 'null') {
    return true;
  }
  return false;
}

export const getEventType = (name: string) => name.slice(2).toLowerCase();
