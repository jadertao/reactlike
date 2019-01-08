import { IInstance, IElement } from "@src/interface";
import { updateInstance } from "@src/dom";

export interface Component<P = {}, S = {}> { }
export abstract class Component<P, S> {
  public state: S;
  public __internalInstance: Partial<IInstance>;

  constructor(public props: P) {
  }

  setState(partialState: Partial<S>, callback?: () => void): void {
    this.state = Object.assign({}, this.state, partialState);
    updateInstance(this.__internalInstance);
  }

  abstract render(): IElement;
}
