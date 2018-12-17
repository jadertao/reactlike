import { Component } from "./compoent";

interface IElementProp {
  [key: string]: any,
  id?: string | number,
  children?: any[],
  nodeValue?: string,
}
export type IElementProps = IElementProp | null


export interface IElement {
  type: any;
  props: IElementProps;
}

export interface IHTMLElement extends HTMLElement {
  [key: string]: any;
  [key: number]: any;
}

export interface IInstance {
  dom: IHTMLElement;
  element: IElement;
  childInstance?: IInstance;
  childInstances?: IInstance[];
  publicInstance?: Component;
}

export type state = any;
