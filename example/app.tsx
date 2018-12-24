import { Component } from "@src/compoent";
import { render, createElement } from "@src";

export class App extends Component {
  render() {
    return (
      <form>
        <label>
          Name:
    <input type="text" name="name" />
        </label>
        <input type="submit" value="Submit" />
      </form>
    )
  }
}

const rootDom = document.getElementById('host');
render(<App />, rootDom);