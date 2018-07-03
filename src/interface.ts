export interface IElementProps {
  [key: string]: any,
  id?: string | number,
  children?: any[],
  nodeValue?: string,
}
export interface IElement {
  type: any,
  props: IElementProps,
}

export interface IHTMLElement extends HTMLElement {
  [key: string]: any,
  [key: number]: any,
}

export interface IInstance {
  dom: IHTMLElement,
  element: IElement,
  childInstances: IInstance[],
}