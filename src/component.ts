import { IInstance, IElement } from "@src/interface";
import { updateInstance } from "@src/dom";

// class compoenent 的声明合并

// "声明合并"是指编译器将针对同一个名字的两个独立声明合并为单一声明.
// 合并后的声明同时拥有原先两个声明的特性. 
// 任何数量的声明都可被合并; 不局限于两个声明.

// 约束 class component 的 props, state 类型
// 和可能存在的成员方法(生命周期函数, 目前未实现)及必须实现的方法(render 方法)
// 并存储一些内部信息
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
