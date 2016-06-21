var RoundIndicator = React.createClass({
  getInitialState() {
    return {round : ""};
  },
  componentDidMount() {
      socket.on('updateRound', this.updateRound);
  },
  updateRound(html) {
    if(html != "") {
      html = "Round : " + html;
    }
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

var ErrorField = React.createClass({
  getInitialState() {
    return {error : ""};
  },
  componentDidMount() {
      socket.on('error', this.updateError);
  },
  updateError(html) {
    this.setState({error : html});
  },
  render() {
    return (
      <div className="error">
        {this.state.error}
      </div>
    );
  }
});
ReactDOM.render(
  <ErrorField/>,
  document.getElementById('error')
);

var ButtonView = React.createClass({
  getInitialState() {
    return {buttons : "Enter the Number of Players<input id='numberOfPlayers' autocomplete='off' hint='Number Of Players'/><button id='startTheGame' onclick='startTheGame()'>Start Game</button>"};
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

var TechTrack = React.createClass({
  techClickHandler: function(e) {
    var ele = e.target.parentElement;
    if($(ele).hasClass('techNode')) {
       $(ele).find('.info').css('display', 'inline-block');
    } else {
      if($(ele).hasClass('buttons')) {
        if($(e.target).hasClass('cancel')) {
          $(ele.parentElement).css('display','none');
        } else {
          if($(e.target).hasClass('buy')) {
            var tech = ele.parentElement.parentElement;
            socket.emit("buyTech", $(tech).attr('id'));
            $(ele.parentElement).css('display','none');
          }
        }
      }
    }
  },
  render: function() {
    var createTechNode = function(tech) {
      return <div className="techNode" id={tech.name} key={tech.id}>
                  <div className='quantity'>
                    {tech.qty} x
                  </div>
                  <div className='techName'>
                    {tech.name}
                  </div>
                  <div className='price'>
                    {tech.cost}/{tech.minCost}
                  </div>
                  <div className='info'>
                    <div className='content'>
                      <div className="descr">
                        {tech.descr}
                      </div>
                      <div className='extraInfo'>
                        <div className='energy'>
                          Energy : {tech.energy}
                        </div>
                        <div className='initiative'>
                          Initiative : {tech.initiative}
                        </div>
                      </div>
                    </div>
                    <div className='buttons'>
                      <button className='buy'>
                        Buy
                      </button>
                      <button className='cancel'>
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>;
    };
    return <span className="techList" onClick={this.techClickHandler}>
          {this.props.tech.map(createTechNode)}
        </span>;
  }
});

var TechView = React.createClass({
  getInitialState() {
    return { availableTech : {
      "military" : [],
      "grid" : [],
      "nano" : [],
      "rare" : []
    }};
  },
  componentDidMount() {
      socket.on('publishTech', this.publishTech);
  },
  publishTech(data) {
    this.setState({availableTech : data});
  },
  render: function() {
    return (
    <div>
      <TechTrack tech={this.state.availableTech.military}/>
      <TechTrack tech={this.state.availableTech.grid}/>
      <TechTrack tech={this.state.availableTech.nano}/>
      <TechTrack tech={this.state.availableTech.rare}/>
    </div>
    );
  }
});
ReactDOM.render(
  <TechView/>,
  document.getElementById('listOfTech')
);