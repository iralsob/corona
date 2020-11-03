"use strict";

var App = React.createClass({
  displayName: "App",
  render: function render() {
    return /*#__PURE__*/React.createElement(Header, null);
  }
});
var Header = React.createClass({
  displayName: "Header",
  render: function render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "test"
    }, "test");
  }
});
React.render( /*#__PURE__*/React.createElement(App, null), document.querySelector("#main"));