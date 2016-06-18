var RoundIndicator = React.createClass({
  getInitialState() {
    return {round : ""};
  },
  componentDidMount() {
      socket.on('updateRound', this.updateRound);
  },
  updateRound(html) {
    this.setState({round : html});
  },
  render() {
    return (
      <div className="roundIndicator">
        {this.state.round}
      </div>
    );
  }
});
ReactDOM.render(
  <RoundIndicator/>,
  document.getElementById('round')
);

var ButtonView = React.createClass({
  getInitialState() {
    return {buttons : "<input id='numberOfPlayers' autocomplete='off' hint='Number Of Players'/><button id='startTheGame' onclick='startTheGame()'>Start Game</button>"};
  },
  componentDidMount() {
      socket.on('updateButtons', this.updateButtons);
  },
  updateButtons(html) {
    this.setState({buttons : html});
  },
  rawMarkup: function() {
    return { __html: this.state.buttons };
  },
  render() {
    return (
      <div className="buttonView" dangerouslySetInnerHTML={this.rawMarkup()}>
      </div>
    );
  }
});
ReactDOM.render(
  <ButtonView/>,
  document.getElementById('buttons')
);

var TechView = React.createClass({
  getInitialState() {
    return {availablTech : []};
  },
  componentDidMount() {
      socket.on('publishTech', this.publishTech);
  },
  publishTech(data) {
    this.setState({availablTech : data});
  },
  clickHandler: function clickHandler(e) {
    var nodes = Array.prototype.slice.call( e.currentTarget.children );
    socket.emit("buyTech", e.target.id);
  },
  render() {
    var techNodes = this.state.availablTech.map(function(tech) {
      return (
        <li id={tech.name} key={tech.id}>
          <div id='quantity'>
            {tech.qty}
          </div>
          {tech.name}
          <div>
            <button id={tech.name}>
              Buy
            </button>
          </div>
          <div>
            {tech.track}
          </div>
          <div>
            {tech.descr}
          </div>
        </li>
      );
    });
    return (
      <div className="techList" onClick={this.clickHandler}>
        {techNodes}
      </div>
    );
  }
});
ReactDOM.render(
  <TechView/>,
  document.getElementById('listOfTech')
);