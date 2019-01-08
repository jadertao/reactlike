import { isFalsy } from '@src/utils'
import { IElement, IHTMLElement, IElementProps, IInstance } from "@src/interface";
import { reconcile } from '@src/reconcile';


let rootInstance: IInstance = null;

/**
 * render 函数, 更新 react instance
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
 * 解析 jsx 的函数
 * 返回 element
 * @export
 * @param {string} type
 * @param {IElementProps} config 即 props
 * @param {...any[]} args 子元素
 * @returns {IElement}
 */
export function createElement(type: string, config: IElementProps, ...args: any[]): IElement {
  const props: IElementProps = Object.assign({}, config);
  const hasChildren = args.length > 0;
  const rawChildren = hasChildren ? [].concat(...args) : [];
  props.children = rawChildren
    .filter((c: any) => !isFalsy(c))
    .map((c: any) => (typeof c === 'string' || typeof c === 'number') ? createTextElement(String(c)) : c);
  return { type, props };
}

/**
 * createTextElement
 * 创建 text 类型节点
 * @param {string} nodeValue
 * @returns {IElement}
 */
function createTextElement(nodeValue: string): IElement {
  const TEXT_ELEMENT = "TEXT_ELEMENT";
  return createElement(TEXT_ELEMENT, { nodeValue });
}
