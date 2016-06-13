var socket = io();

function startGame() {
  socket.emit('startGame', $("#name").val(), function (playerButtons) {
    document.getElementById("buttons").innerHTML = playerButtons;
  });
  return false;
}

function buyTech(ele) {
  console.log($(ele).attr("tech"));
  socket.emit("buyTech", $(ele).attr("tech"));
}

socket.on('clearTech', function() {
  $('#listOfTech').empty();
});

socket.on('publishPlayerOrder', function(playerOrder) {
  $('#playerOrder').empty();
  for(var i=0;i<playerOrder.length;i++) {
    var html = "<div>" + playerOrder[i].name + "</div>";
    console.log(html);
    $('#playerOrder').append(html);
  }
});

socket.on('addTech', function(tech){
  var html = "<li>" + tech + "<button onclick='buyTech(this)' tech='" + tech + "'>Buy</button></li>";
  $('#listOfTech').append(html);
});