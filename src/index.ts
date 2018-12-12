import { IElement, IHTMLElement, IElementProps, IInstance } from "./interface";
import { isAttribute, isListener, isTextElement, isFalsy, getEventType } from "./utils";

let rootInstance: IInstance = null;

/**
 * render 函数, 更新react instance
 * 
 * @export
 * @param {IElement} element 是 JSX 被 jsxFactory(TS) 或者 babel-preset-react(JS) 解析后生成的类型
 * @param {IHTMLElement} parentDom
 */
export function render(element: IElement, parentDom: IHTMLElement) {
  const prevInstance: IInstance = rootInstance;
  const nextInstance: IInstance = reconcile(parentDom, prevInstance, element);
  rootInstance = nextInstance;
}

/**
 * reconcile 调和函数
 * 副作用: 对 parentDOM 进行追加、删除或替换。
 * @param {IHTMLElement} parentDom
 * @param {IInstance} instance 当前 react 应用中存在的 instance
 * @param {IElement} element 下一个状态对应的 JSX 生成的 Element
 * @returns {IInstance} 返回更新后的 instance
 */
function reconcile(parentDom: IHTMLElement, instance: IInstance, element: IElement): IInstance {
  if (isFalsy(instance)) {
    const newInstance = instantiate(element);
    parentDom.appendChild(newInstance.dom);
    return newInstance;
  } else if (isFalsy(instance)) {
    parentDom.removeChild(instance.dom);
    return null;
    // 简单的 diff, type 相同，只更新属性，不重新实例化
  } else if (instance.element.type === element.type) {
    updateDOMProperties(instance.dom, instance.element.props, element.props);
    instance.childInstances = reconcileChildren(instance, element);
    instance.element = element;
    return instance;
  } else {
    // 简单的 diff, type 不同，重新实例化
    const newInstance = instantiate(element);
    parentDom.replaceChild(newInstance.dom, instance.dom);
    return newInstance;
  }
}

/**
 * reconcileChildren, 调和 instance.childrenInstance 的函数，与 reconcile 嵌套递归
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
 * instantiate, 实例化 JSX Element
 *
 * @export
 * @param {IElement} element JSX Element
 * @returns {IInstance} React 实例
 */
export function instantiate(element: IElement): IInstance {
  const { type, props } = element;
  const dom: IHTMLElement = isTextElement(type)
    ? document.createTextNode(props.nodeValue)
    : document.createElement(type);

  // 为 DOM 部署属性
  updateDOMProperties(dom, {}, props);

  const childElements = props.children || [];
  const childInstances = childElements.map(instantiate);
  const childDoms = childInstances.map(childInstance => childInstance.dom);


  childDoms.forEach(childDom => dom.appendChild(childDom));

  const instance = { dom, element, childInstances };
  return instance;
}

/**
 * updateDOMProperties 更新 DOM 属性, 避免每次都创建新的 DOM
 *
 * @param {IHTMLElement} dom
 * @param {IElementProps} prevProps
 * @param {IElementProps} nextProps
 */
function updateDOMProperties(dom: IHTMLElement, prevProps: IElementProps, nextProps: IElementProps) {

  // 取消旧的 event listener 和 property
  // 注：请区分 attribute 和 property 的区别
  if (!isFalsy(prevProps)) {
    Object.keys(prevProps).filter(isListener).forEach((name: string) => {
      const eventType: string = getEventType(name);
      dom.removeEventListener(eventType, prevProps[name]);
    })

    Object.keys(prevProps).filter(isAttribute).forEach((name: string) => {
      dom[name] = null;
    })
  }

  // 部署新的 event listener 和 property
  if (!isFalsy(nextProps)) {
    Object.keys(nextProps).filter(isListener).forEach((name: string) => {
      const eventType: string = getEventType(name);
      dom.addEventListener(eventType, nextProps[name]);
    })

    Object.keys(nextProps).filter(isAttribute).forEach((name: string) => {
      dom[name] = nextProps[name];
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
  const rawChildren = hasChildren ? [...args] : [];
  props.children = rawChildren
    .filter((c: any) => c != undefined && c != null)
    .map((c: any) => (typeof c === 'string' || typeof c === 'number') ? createTextElement(String(c)) : c);
  return { type, props };
}

export const Reactlike = {
  render,
  createElement,
}
