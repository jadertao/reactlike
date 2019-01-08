import { Component } from "@src/component";
import { render, createElement } from "@src";

export class App extends Component {
  state = {
    time: new Date()
  }
  render() {
    setInterval(() => { this.setState({ time: new Date() }) }, 1000)
    return (
      <h2>{this.state.time}</h2>
    )
  }
}

const rootDom = document.getElementById('host');
render(<App />, rootDom);