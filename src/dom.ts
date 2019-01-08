import { IElement } from '@src/interface'
import { isTextElement, getType } from '@src/utils'
import { Component } from '@src/component'
import { isAttribute } from '@src/utils'
import { isFalsy, getEventType, isListener } from '@src/utils'
import { IHTMLElement, IElementProps, IInstance } from '@src/interface'
import { reconcile } from '@src/reconcile';


/**
 * instantiate, 实例化 JSX Element
 *
 * element => instance
 * @export
 * @param {IElement} element JSX Element
 * @returns {IInstance} React 实例
 */
export function instantiate(element: IElement): IInstance {
  if (getType(element) !== 'object') {
    throw new Error(`${element} is not a valid child`);
  }
  const { type, props } = element;
  const isDomElement = typeof type === "string";

  // 1. type 为 string 的普通元素
  if (isDomElement) {
    // 普通元素
    // 区分 text 节点还是普通 dom 节点
    const dom: IHTMLElement = isTextElement(type)
      ? document.createTextNode(props.nodeValue)
      : document.createElement(type);

    // 为 DOM 初始化属性
    updateDOMProperties(dom, {}, props);
    const childElements = props.children || [];

    const childInstances = childElements.map(instantiate);
    const childDoms = childInstances.map(childInstance => childInstance.dom);

    childDoms.forEach(childDom => dom.appendChild(childDom));

    const instance: IInstance = { dom, element, childInstances };
    return instance;
  } else {
    // class component
    const instance: Partial<IInstance> = {};
    const publicInstance: Component = createPublicInstance(element, instance);

    // 这里可以调用声明周期(暂未实现)
    const childElement: IElement = publicInstance.render();
    const childInstance = instantiate(childElement);
    const dom = childInstance.dom;

    Object.assign(instance as IInstance, { dom, element, childInstance, publicInstance });
    return instance as IInstance;
  }

}


/**
 * updateDOMProperties 更新 DOM 属性, 避免每次都创建新的 DOM
 *
 * @param {IHTMLElement} dom
 * @param {IElementProps} prevProps
 * @param {IElementProps} nextProps
 */
export function updateDOMProperties(dom: IHTMLElement, prevProps: IElementProps, nextProps: IElementProps) {

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
 * 实例化 class component 的函数
 *
 * @export
 * @param {IElement} element
 * @param {Partial<IInstance>} internalInstance
 * @returns {Component}
 */
export function createPublicInstance(element: IElement, internalInstance: Partial<IInstance>): Component {
  const { type, props } = element;
  const publicInstance: Component = new type(props);
  publicInstance.__internalInstance = internalInstance;
  return publicInstance;
}


/**
 * updateInstance 
 *
 * @export
 * @param {Partial<IInstance>} internalInstance
 */
export function updateInstance(internalInstance: Partial<IInstance>) {
  if (internalInstance && internalInstance.dom) {
    const parentDom = internalInstance.dom.parentNode;
    const element = internalInstance.element;
    parentDom && element && reconcile(parentDom, internalInstance, element);
  }
}