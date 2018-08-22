import { IElement, IHTMLElement, IElementProps, IInstance } from "./interface";
import { isAttribute, isListener, isTextElement, isFalsy, getEventType } from "./utils";

let rootInstance: IInstance = null;

/**
 * element 是JSX被jsxFactory(TS)或者babel-preset-react(JS)解析后生成的类型
 * 
 * @export
 * @param {IElement} element
 * @param {IHTMLElement} parentDom
 */
export function render(element: IElement, parentDom: IHTMLElement) {
  const prevInstance: IInstance = rootInstance;
  const nextInstance: IInstance = reconcile(parentDom, prevInstance, element);
  rootInstance = nextInstance;
}


/**
 *
 *
 * @param {IHTMLElement} parentDom
 * @param {IInstance} instance
 * @param {IElement} element
 * @returns {IInstance}
 */
function reconcile(parentDom: IHTMLElement, instance: IInstance, element: IElement): IInstance {
  if (instance == null) {
    const newInstance = instantiate(element);
    parentDom.appendChild(newInstance.dom);
    return newInstance;
  } else if (element == null) {
    parentDom.removeChild(instance.dom);
    return null;
  } else if (instance.element.type === element.type) {
    updateDOMProperties(instance.dom, instance.element.props, element.props);
    instance.childInstances = reconcileChildren(instance, element);
    instance.element = element;
    return instance;
  } else {
    const newInstance = instantiate(element);
    parentDom.replaceChild(newInstance.dom, instance.dom);
    return newInstance;
  }
}


/**
 *
 *
 * @param {IInstance} instance
 * @param {IElement} element
 * @returns {Array<IInstance>}
 */
function reconcileChildren(instance: IInstance, element: IElement): Array<IInstance> {
  const dom = instance.dom;
  const childInstances = instance.childInstances;
  const nextChildElements = element.props.children || [];
  const newChildInstances: Array<IInstance> = [];
  const count = Math.max(childInstances.length, nextChildElements.length);

  for (let i = 0; i < count; i++) {
    const childInstance = childInstances[i];
    const childElement = nextChildElements[i];

    const newChildInstance = reconcile(dom, childInstance, childElement);
    newChildInstances.push(newChildInstance);
  }
  return newChildInstances.filter(instance => instance != null);
}

/**
 *
 *
 * @export
 * @param {IElement} element
 * @returns {IInstance}
 */
export function instantiate(element: IElement): IInstance {
  const { type, props } = element;
  const dom: IHTMLElement = isTextElement(type)
    ? document.createTextNode(props.nodeValue)
    : document.createElement(type);

  updateDOMProperties(dom, {}, props);

  const childElements = props.children || [];
  const childInstances = childElements.map(instantiate);
  const childDoms = childInstances.map(childInstance => childInstance.dom);

  childDoms.forEach(childDom => dom.appendChild(childDom));

  const instance = { dom, element, childInstances };
  return instance;
}

/**
 *
 *
 * @param {IHTMLElement} dom
 * @param {IElementProps} prevProps
 * @param {IElementProps} nextProps
 */
function updateDOMProperties(dom: IHTMLElement, prevProps: IElementProps, nextProps: IElementProps) {

  if (prevProps && !isFalsy(prevProps)) {
    Object.keys(prevProps).filter(isListener).forEach((name: string) => {
      const eventType: string = getEventType(name);
      dom.removeEventListener(eventType, prevProps[name]);
    })

    Object.keys(prevProps).filter(isAttribute).forEach((name: string) => {
      dom[name] = null;
    })
  }

  if (nextProps && !isFalsy(nextProps)) {
    Object.keys(nextProps).filter(isAttribute).forEach((name: string) => {
      dom[name] = nextProps[name];
    })

    Object.keys(nextProps).filter(isListener).forEach((name: string) => {
      const eventType: string = getEventType(name);
      dom.addEventListener(eventType, nextProps[name]);
    })
  }
}


/**
 *
 *
 * @param {string} nodeValue
 * @returns {IElement}
 */
function createTextElement(nodeValue: string): IElement {
  const TEXT_ELEMENT = "TEXT_ELEMENT";
  return createElement(TEXT_ELEMENT, { nodeValue });
}

/**
 *
 *
 * @export
 * @param {string} type
 * @param {IElementProps} config
 * @param {...any[]} args
 * @returns {IElement}
 */
export function createElement(type: string, config: IElementProps, ...args: any[]): IElement {
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
