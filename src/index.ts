import { IElement, IHTMLElement, IElementProps, IInstance } from "./interface";

let rootInstance = null;

export function render(element: IElement, parentDom: HTMLElement) {
  const prevInstance = rootInstance;
  const nextInstance = reconcile(parentDom, prevInstance, element);
  rootInstance = nextInstance;
}

function reconcile(parentDom: HTMLElement, instance, element: IElement) {
  if (instance == null) {
    const newInstance = instantiate(element);
    parentDom.appendChild(newInstance.dom);
    return newInstance;
  } else {
    const newInstance = instantiate(element);
    parentDom.replaceChild(newInstance.dom, instance.dom);
    console.log(newInstance, instance);
    return newInstance;
  }
}
export function instantiate(element: IElement): IInstance {

  const { type, props } = element;
  const TEXT_ELEMENT = "TEXT ELEMENT";
  const isListener = (name: string) => name.startsWith("on");
  const isAttribute = (name: string) => !isListener(name) && name !== 'children';
  const isTextElement = (type: string | number) => type === TEXT_ELEMENT;

  const dom: IHTMLElement = isTextElement(type)
    ? document.createTextNode(props.nodeValue)
    : document.createElement(type);

  Object.keys(props).filter(isListener).forEach((name: string) => {
    const eventType: string = name.slice(2).toLowerCase();
    dom.addEventListener(eventType, props[name]);
  })

  Object.keys(props).filter(isAttribute).forEach((name: string) => {
    dom[name] = props[name];
  })

  const childElements = props.children || [];
  const childInstances = childElements.map(instantiate);
  const childDoms = childInstances.map(childInstance => childInstance.dom);

  childDoms.forEach(childDom => dom.appendChild(childDom));

  const instance = { dom, element, childInstances };
  return instance;
}

function createTextElement(nodeValue: string) {
  const TEXT_ELEMENT = "TEXT ELEMENT";
  return createElement(TEXT_ELEMENT, { nodeValue });
}

export function createElement(type: string, config: IElementProps | null, ...args: any[]): IElement {
  const props: IElementProps = Object.assign({}, config);
  const hasChildren = args.length > 0;
  const rawChildren = hasChildren ? [].concat(...args) : [];
  props.children = rawChildren
    .filter((c: any) => c != undefined && c != null)
    .map((c: any) => (typeof c === 'string' || typeof c === 'number') ? createTextElement(String(c)) : c);
  return { type, props };
}

export const Reactlike = {
  render,
  createElement,
}