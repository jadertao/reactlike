import { isFalsy } from '@src/utils';
import { IHTMLElement, IInstance, IElement } from '@src/interface';
import { updateDOMProperties } from '@src/dom';
import { instantiate } from '@src/dom';

/**
 * reconcile 调和函数, 即为人熟知的 diff 函数
 * 副作用: 对 parentDOM 进行追加、删除或替换
 * @param {IHTMLElement} parentDom
 * @param {IInstance} instance, 当前 react 应用中存在的 instance
 * @param {IElement} element, 下一个状态对应的 JSX 生成的 Element
 * @returns {IInstance} 返回更新后的 instance
 */
export function reconcile(parentDom: IHTMLElement | Node, instance: Partial<IInstance>, element: IElement): IInstance {
  if (isFalsy(instance)) {
    // 当前实例不存在, 则认为此次为全量更新, 实例化 element 即可
    const newInstance = instantiate(element);
    parentDom.appendChild(newInstance.dom);
    return newInstance;
  } else if (isFalsy(element)) {
    // 当前实例存在但 element 不存在, 则认为此次为全量移除, 删除当前实例节点即可
    parentDom.removeChild(instance.dom);
    return null;
  } else if (instance.element.type !== element.type) {
    // 当前实例存在且 element 也存在, 比较两者的类型(type), 
    const newInstance = instantiate(element);
    parentDom.replaceChild(newInstance.dom, instance.dom);
    return newInstance;
  } else if (typeof element.type === "string") {
    // type 类型为 string 的非 class component
    // 对节点递归更新
    updateDOMProperties(instance.dom, instance.element.props, element.props);
    instance.childInstances = reconcileChildren(instance, element);
    instance.element = element;
    return instance as IInstance;
  } else {
    // class component 的处理

    // 更新 props
    console.log(instance);
    instance.publicInstance.props = element.props;
    // re-render
    const childElement: IElement = instance.publicInstance.render();
    const oldChildInstance: IInstance = instance.childInstance;
    // 递归更新节点
    const childInstance: IInstance = reconcile(parentDom, oldChildInstance, childElement);
    instance.dom = childInstance.dom;
    instance.childInstance = childInstance;
    instance.element = element;
    return instance as IInstance;
  }
}

/**
 * reconcileChildren, 调和 instance.childrenInstance 的函数，与 reconcile 嵌套递归
 *
 * @param {IInstance} instance
 * @param {IElement} element
 * @returns {Array<IInstance>}
 */
export function reconcileChildren(instance: Partial<IInstance>, element: IElement): Array<IInstance> {
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
  return newChildInstances.filter(instance => instance !== null);
}