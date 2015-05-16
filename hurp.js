var MyComponent = React.createClass({
  getInitialState: function() {
    return {
      things: [{
        name: "Bob"
      },{
        name: "Jane"
      },{
        name: "Fred"
      }]
    };
  },

  remove: function(index) {
    var things = this.state.things
    things.splice(index, 1);
    this.setState({
      things: things
    })
  },

  render: function() {
    var self = this;
    return (
      <ul>
      {this.state.things.map(function(thing, index) {
        return (
          <li key={index}>
            <input type="text" defaultValue={thing.name} />
            <button onClick={self.remove.bind(self, index)}>Remove</button>
          </li>
        )
      })}
      </ul>
    )
  }
});
console.log(MyComponent);

React.render(document.querySelector('.app'), <MyComponent />);
