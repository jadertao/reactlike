interface IElementProps {
  [key: string]: any,
  id?: string | number,
  children?: any[],
}
export interface IElement {
  type: any,
  props: IElementProps,
}

export interface IHTMLElement extends HTMLElement {
  [key: string]: any,
  [key: number]: any,
}