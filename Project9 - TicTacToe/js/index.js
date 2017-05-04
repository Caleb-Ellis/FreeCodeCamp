// Initialise variables
var board = Array(9).fill(null);
var player;
var ai = 'O';
var playing = false;
var winner = null;

// Reset board to original state
function resetBoard() {
  board = Array(9).fill(null);
  ai = 'O';
  playing = false;
  winner = null;
  $('#title').html('Tic Tac Toe!');
  $('#message').html('Choose Your Icon');
  $('.box').css('display', 'block');
  $('#reset-game').css('display', 'none');
  drawBoard();
}

// When tile is clicked, update board array
function tileClick(tile) {
  board[tile] = player;
  drawBoard();
  if (winner === null) {
    aiTurn();
  }
};

// Draw board based on board array
function drawBoard() {
  for (let i=0; i<board.length; i++) {
    $('#t'+i).html(board[i]);
  }
  calculateWinner(board);
};

// Ai turn
function aiTurn() {
  var tile = Math.floor(Math.random() * 8);
  // If tile is not occupied, insert AI icon
  if (board[tile] === null) {
    board[tile] = ai;
    drawBoard();
  } else {
    aiTurn();
  }
}

function calculateWinner(tiles) {
  // Winning combinations
  var lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i=0; i<lines.length; i++) {
    var [a, b, c] = lines[i];
    // If there is a 3-icon line match, determine winner
    if (tiles[a] && tiles[a] === tiles[b] && tiles[a] === tiles[c]) {
      winner = tiles[a];
      gameOver(winner);
      return null;
      // Otherwise if board is full and no 3-icon match, nobody wins
    } else if (board.includes(null) === false) {
      winner = 'Nobody';
      gameOver(winner);
    };
  }
  return null;
}

// Game over screen rendering
function gameOver(winner) {
  playing = false;
  $('#title').html(winner + ' wins!');
  $('#message').html('Play again?')
  $('.box').css('display', 'none');
  $('#reset-game').css('display', 'block');
};


// jQuery click functions

// When an icon button is pressed...
$('button').click(function() {
  // Player is the button's value (X or O)
  player = $(this).attr('value');
  // If player chooses O, AI goes first as X
  if (player === 'O') {
    ai = 'X';
    aiTurn();
  }
  $('#message').html("Playing as " + player);
  $('.box').css('display', 'none');
  $('#reset-game').css('display', 'block');
  playing = true;
});

// When a game tile is clicked...
$('.tile').click(function() {
  // The clicked tile is given a value 0-8
  var clicked = $(this).attr('value');
  // Only change board if game is in session
  if (playing === true) {
    if (board[clicked] === null) {
      tileClick(clicked);
    }
    // If player doesn't choose icon, start game as X
  } else if (playing === false && winner === null) {
    player = 'X';
    playing = true;
    $('#message').html("Playing as " + player);
    $('.box').css('display', 'none');
    $('#reset-game').css('display', 'block');
    tileClick(clicked);
  }
});

// When reset game button is pressed...
$('#reset-game').click(function() {
  resetBoard();
});

$(document).ready(function() {
  resetBoard();
});