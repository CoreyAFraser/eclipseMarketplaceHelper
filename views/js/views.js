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
      var energyClass = 'energy energy-' + tech.energy;
      var initiativeClass = 'initiative initiative-' + tech.initiative;
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
                        <div className={energyClass}>
                          Energy : {tech.energy}
                        </div>
                        <div className={initiativeClass}>
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


var NewTechNode = React.createClass({
  render: function() {
    var createTechNode = function(tech) {
      return (<div className='newTechNode' key={tech.id}>
                <div>
                  {tech.qty}x
                </div>
                <div>
                  {tech.name}
                </div>
                <div>
                  - {tech.track}
                </div>
              </div>);
    };
    return <div>
          {this.props.tech.map(createTechNode)}
        </div>;
  }
});

var NewTechView = React.createClass({
  getInitialState() {
    return { newTech : {
      "military" : [],
      "grid" : [],
      "nano" : [],
      "rare" : []
    }};
  },
  componentDidMount() {
      socket.on('publishNewlyAvailableTech', this.publishNewTech);
  },
  publishNewTech(data) {
    this.setState({newTech : data});
    $('#newlyAddedTech').css('display','inline-block');
  },
  okClickHandler: function(e) {
    var ele = e.target;
    if($(ele).hasClass('ok')) {
       $('#newlyAddedTech').css('display','none');
    }
  },
  render: function() {
    return (
    <div onClick={this.okClickHandler}>
      <div className='newTechNodes'>
        <NewTechNode tech={this.state.newTech.military}/>
        <NewTechNode tech={this.state.newTech.grid}/>
        <NewTechNode tech={this.state.newTech.nano}/>
        <NewTechNode tech={this.state.newTech.rare}/>
      </div>
      <div className='buttons'>
        <button className='ok'>
          OK
        </button>
      </div>
    </div>
    );
  }
});
ReactDOM.render(
  <NewTechView/>,
  document.getElementById('newlyAddedTech')
);