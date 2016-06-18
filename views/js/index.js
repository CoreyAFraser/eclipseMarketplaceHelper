var socket = io();

function startTheGame() {
  socket.emit('startGame', $("#numberOfPlayers").val());
}

function endTheGame() {
  socket.emit("endTheGame");
}

function endTheRound() {
  socket.emit("endTheRound");
}