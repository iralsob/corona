class App extends React.Component {
  render() {
    return (
          <Header />
    );
  }
};

class Header extends React.Component {
 render() {
   return (
            <div className="test">test</div>
   )
 }
};

ReactDOM.render(<App/>, document.querySelector("#main"));
