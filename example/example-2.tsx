import { Component } from "@src/component";
import { render, createElement } from "@src";

export class App extends Component {
  state = {
    time: new Date()
  }
  render() {
    return (
      <h2>{this.state.time.getSeconds()}</h2>
    )
  }
}

const rootDom = document.getElementById('host');
render(<App />, rootDom);