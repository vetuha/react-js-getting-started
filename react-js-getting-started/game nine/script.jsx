var possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};

var StarsFrame = React.createClass({
  render:function() {
    var numberOfStars = this.props.numberOfStars;
    var stars = [];
    for(var i=0; i<numberOfStars; i++){
      stars.push(<span className="glyphicon glyphicon-star"></span>)
    }
    return (
      <div id="stars-frame">
      <div className="well">
      {stars}
      </div>
    </div>
    );
  }
});

var ButtonFrame = React.createClass({
  render:function() {
    var disabled = this.props.selectedNumbers.length == 0,
    checkAnswer = this.props.checkAnswer,
    button,
    correct = this.props.correct;
    switch(correct){
      case true:
      button = (<button onClick={this.props.acceptAnswer} className="btn btn-success btn-lg">
        <span className="glyphicon glyphicon-ok"></span>
        </button>
       );
          break;
      case false:
       button = (<button className="btn btn-danger btn-lg">
        <span className="glyphicon glyphicon-remove"></span>
        </button>
       );
          break;
      default:
      button = (<button onClick={checkAnswer} className="btn btn-primary btn-lg" disabled={disabled}>
          =</button>
       );
    }
    return (
      <div id="button-frame">
      {button}
      <br /><br />
      <button onClick={this.props.refreshStars} className="btn btn-warning btn-xs"
              disabled={this.props.numberOfRefresh==0}>
      <span className="glyphicon glyphicon-refresh">&nbsp;{this.props.numberOfRefresh}</span>
      </button>
    </div>
    );
  }
});

var AnswerFrame = React.createClass({
  render:function() {
    var clickNumber = this.props.unselectNumber;
    var numbers = this.props.selectedNumbers.map((num) => {
      return (<span onClick={clickNumber.bind(null,num)}>{num}</span>)
    });
    return (
      <div id="answer-frame">
      <div className="well">
      {numbers}
      </div>
    </div>
    );
  }
});

var NumbersFrame = React.createClass({
  render:function() {
    var numbers = [], className, 
    clickNumber = this.props.selectNumber,
    selectedNumbers = this.props.selectedNumbers,
    usedNumbers = this.props.usedNumbers;
    for(var i=1; i<=9; i++){
      className = "number selected-" + (selectedNumbers.indexOf(i) >=0);
      className += " used-"+ (usedNumbers.indexOf(i) >=0);
      numbers.push(<div onClick={clickNumber.bind(null,i)} className={className}>{i}</div>)
    }
    return (
      <div id="numbers-frame">
      <div className="well">
      {numbers}
      </div>
    </div>
    );
  }
});

var DoneFrame = React.createClass({
  render: function(){
    return (
      <div className="well text-center">
      <h2>{this.props.doneStatus}</h2>
      <br />
      <hr/>
      <button onClick={this.props.newGame} className="btn btn-lg btn-default">New Game</button>
      </div>
   );
  }
});

var Game = React.createClass({
  getInitialState:function() {
    return {
      numberOfStars: this.generateStars(),
      selectedNumbers: [],
      usedNumbers: [],
      correct:null,
      numberOfRefresh: 5,
      doneStatus: ''
    };
  },
  selectNumber: function(num) {
    if(this.state.selectedNumbers.indexOf(num) < 0){
       this.setState({selectedNumbers:this.state.selectedNumbers.concat(num),
                    isCorrect:null
       })
    }
  },
  unselectNumber: function(num) {
    var selectedNumberIndex = this.state.selectedNumbers.indexOf(num),
    numbers = this.state.selectedNumbers;
    numbers.splice(selectedNumberIndex,1)
    this.setState({selectedNumbers:numbers,
                    isCorrect:null
    })
  },
  sumOfSelectedNumbers: function(){
    return this.state.selectedNumbers.reduce(function (p,n) {
      return p+n;
    },0);
  },
  checkAnswer: function() {
    var isCorrect = this.state.numberOfStars === this.sumOfSelectedNumbers();
    this.setState({isCorrect:isCorrect});
  },
  acceptAnswer: function() {
    this.setState({usedNumbers:this.state.usedNumbers.concat(this.state.selectedNumbers),
                  isCorrect:null,
                  selectedNumbers: [],
                  numberOfStars: this.generateStars()
    }, function(){
      this.updateDoneStatus();
    });
    
  },
  newGame:function() {
    this.replaceState(this.getInitialState());
  },
  generateStars: function(){
    return Math.floor(Math.random()*9) + 1;
  },
  refreshStars: function(){
    if(this.state.numberOfRefresh > 0)
     {
       this.setState({
         numberOfStars: this.generateStars(),
         numberOfRefresh: this.state.numberOfRefresh - 1,
         isCorrect:null,
         selectedNumbers:[]
       },function(){this.updateDoneStatus();});
     }
  },
  updateDoneStatus: function(){
    if(this.state.usedNumbers.length === 9){
      this.setState({
        doneStatus: 'You won! Nice!'
      });
      return;
    }
    if(this.state.numberOfRefresh == 0 && !this.checkSolutions()){
      this.setState({
        doneStatus: 'You lose! Try again.'
      });
      return;
    }
  },
  checkSolutions: function(){
    var numberOfStars = this.state.numberOfStars,
        possibleNumbers = [],
        usedNumbers = this.state.usedNumbers;
    
    for(var i=1; i<=9; i++){
      if(usedNumbers.indexOf(i)<0)
        possibleNumbers.push(i);
    }
    
    return possibleCombinationSum(possibleNumbers, numberOfStars);
  },
  render:function() {
    var selectedNumbers = this.state.selectedNumbers,
    numberOfStars = this.state.numberOfStars,
    correct= this.state.isCorrect,
    usedNumbers=this.state.usedNumbers,
    numberOfRefresh = this.state.numberOfRefresh,
    doneStatus = this.state.doneStatus,
    bottomFrame;
    
    if(doneStatus){
      bottomFrame = (<DoneFrame doneStatus={doneStatus}
                                newGame={this.newGame}/>);
    }else{
      bottomFrame = (<NumbersFrame selectedNumbers={selectedNumbers} 
                  usedNumbers={usedNumbers}
                  selectNumber={this.selectNumber}/>);
    }
    return (
      <div id="game">
    <h2>Play Nine</h2>
    <hr/>
    <div className="clearfix">
    <StarsFrame numberOfStars={numberOfStars}/>
    <ButtonFrame selectedNumbers={selectedNumbers}
                 correct={correct}
                 checkAnswer={this.checkAnswer}
                 acceptAnswer={this.acceptAnswer}
                 refreshStars={this.refreshStars}
                 numberOfRefresh={numberOfRefresh}/>
    <AnswerFrame selectedNumbers={selectedNumbers}
                 unselectNumber={this.unselectNumber}/>
    </div>
    {bottomFrame}
    </div>
    );
  }
});

ReactDOM.render(
  <Game />,
  document.getElementById('container')
);
