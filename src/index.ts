import { IElement, IHTMLElement } from "./interface";

function render(element: IElement, parentDom: HTMLElement) {
  const { type, props } = element;

  const isListener = (name: string) => name.startsWith("on");
  const isAttribute = (name: string) => !isListener && name !== 'children';
  const isTextElement = (type: string) => type === 'TEXT ELEMENT';

  const dom: IHTMLElement = isTextElement
    ? document.createTextNode("")
    : document.createElement(type);


  Object.keys(props).filter(isListener).forEach((name: string) => {
    const eventType: string = name.slice(2).toLowerCase();
    dom.addEventListener(eventType, props[eventType]);
  })

  Object.keys(props).filter(isAttribute).forEach((name: string) => {
    dom[name] = props[name];
  })

  const childrenElements = props.children || [];
  childrenElements.forEach((child) => render(child, dom));
  parentDom.appendChild(dom);
}