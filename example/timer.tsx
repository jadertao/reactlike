import { render, createElement } from "../src";

export function timer(rootDom): number {
  function tick() {
    const time = new Date().toLocaleTimeString();
    const clockElement = <h1>{time}</h1>;
    render(clockElement, rootDom);
  }

  tick();
  return setInterval(tick, 1000);
}

