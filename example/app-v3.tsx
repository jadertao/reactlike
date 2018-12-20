import { Component } from "../src/compoent";
import { render, createElement } from "../src";

const data = ['long long ago,', 'there is a fish', 'swimming in the sky'];
class App extends Component<{ data: Array<string> }> {
  render() {
    return (
      <div><h1>full react</h1>
        <ul>{this.props.data.map((v: string) => <Item name={v} />)}</ul>
      </div>
    );
  }
}
class Item extends Component<{ name: string }, { likes: number }> {
  state = { likes: Math.ceil(Math.random() * 100) };
  like = () => {
    this.setState({
      likes: this.state.likes + 1
    });
  }
  render() {
    const { likes } = this.state;
    return (
      <li><button onClick={this.like}>{likes}<b>❤</b><span>{this.props.name}</span></button></li>
    );
  }
}
render(<App data={data} />, document.getElementById('host'));