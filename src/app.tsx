import { render, createElement } from "./";

const rootDom = document.getElementById("host");

function tick() {
  const time = new Date().toLocaleTimeString();
  const clockElement = <h1>{time}</h1>;
  render(clockElement, rootDom);
}

tick();
setInterval(tick, 1000);
