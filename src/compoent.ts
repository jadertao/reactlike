import { state, IInstance, IElement } from "./interface";
import { updateInstance } from ".";

export abstract class Component {
  public state: state;
  public __internalInstance:  Partial<IInstance>;

  constructor(public props: any) {
    this.state = this.state || {};
  }

  setState(partialState: Partial<state>): void {
    this.state = Object.assign({}, this.state, partialState);
    updateInstance(this.__internalInstance);
  }

  abstract render(): IElement;
}