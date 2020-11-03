var React = require('gulp-react');

var App = React.createClass({
  render: function() {
    return (
          <Header />
    );
  }
});


var Header = React.createClass({
 render: function() {
   return (
            <div className="test">test</div>
   )
 }
});

React.render(<App/>, document.querySelector("#main"));
