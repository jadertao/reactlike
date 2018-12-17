import { render, createElement } from "../src";

export function timer(rootDom): number {
  const a = 1
  function tick() {
    const time = new Date().toLocaleTimeString();
    const clockElement = (
      <h1>
        {time}
        <div>{2 * a}</div>
      </h1>);
    render(clockElement, rootDom);
  }

  tick();
  return setInterval(tick, 1000);
}

