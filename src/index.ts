import { IElement, IHTMLElement, IElementProps, IInstance } from "@src/interface";
import { reconcile } from '@src/reconcile';
import { createTextElement } from "@src/dom";


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
    .filter((c: any) => c != undefined && c != null && c != false)
    .map((c: any) => (typeof c === 'string' || typeof c === 'number') ? createTextElement(String(c)) : c);
  return { type, props };
}
