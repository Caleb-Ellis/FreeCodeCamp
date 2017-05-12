/////* Initialise variables */////

var game = {
  status: 'off',
  strict: 'off',
  score: "--",
  gameSequence: [],
  playerSequence: [],
  timestep: 1000,
  allowPress: true,
  active: false
};
var sounds = [
  "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3",
  "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3",
  "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3",
  "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3",
  "https://raw.githubusercontent.com/Caleb-Ellis/FreeCodeCamp/master/Extras/Party%20Horn%20Sound%20Effect.mp3"
]
var colors = {
  blueOn: '#7baefe',
  blueOff: '#2659a9',
  redOn: '#fb7b7b',
  redOff: '#d62626',
  yellowOn: '#fff57b',
  yellowOff: '#eec026',
  greenOn: '#7bfb99',
  greenOff: '#26b644'
}


/////* Game functions */////

// Reset game to initial state
function resetGame() {
  game = {
    status: 'off',
    strict: 'off',
    score: "--",
    gameSequence: [],
    playerSequence: [],
    timestep: 1000,
    allowPress: true,
    active: false
  };
  counter = 0;
  $('#score-screen').attr("placeholder", game.score);
  $('.strict-led').css('background-color', '#460000');
}

// Add a number to the game sequence
function addNumber() {
  game.gameSequence.push(Math.floor(Math.random() * 4));
  game.score === "--" ? game.score = 1 : game.score += 1;
  $('#score-screen').attr("placeholder", game.score);
}

// Play the game sequence
function playSequence() {
  // If score is 20 (or somehow above), the player has won
  if (game.score >= 20) {
    winScreen();
  } else {
    $('#btn-start').css('background-color', colors.greenOn);
    game.allowPress = false;
    // Timestep gets shorter with each addition to the sequence
    game.timestep = 1000 - (game.gameSequence.length * 25);
    game.gameSequence.forEach(function(button, counter) {
      setTimeout(function() {
        playSound(button);
      }, game.timestep*(counter+1));
    });
    setTimeout(function() {
      game.allowPress = true;
      $('#btn-start').css('background-color', colors.greenOff);
    }, game.timestep*(game.gameSequence.length+1))
  }
}

// Check if player's input matches the game sequence
function checkSequence() {
  var index = game.playerSequence.length - 1;
  // If they do not match, run wrongButton function
  if (game.playerSequence[index] != game.gameSequence[index]) {
    game.playerSequence = [];
    wrongButton();
    return false;
  }
  // If they do match and the sequences are the same length, add another number to the sequence
  if (game.playerSequence[index] === game.gameSequence[index] && game.playerSequence.length === game.gameSequence.length) {
    game.playerSequence = [];
    game.allowPress = false;
    setTimeout(function() {
      addNumber();
      playSequence();
    }, 1000);
  }
  // If they match but the lengths are not the same, do nothing
  else if (game.playerSequence[index] === game.gameSequence[index]) {
    return true;
  }
  // Otherwise, assume wrong button input
  else {
    game.playerSequence = [];
    wrongButton();
    return false;
  }
}

// Wrong button function, for when the player inputs the incorrect button
function wrongButton() {
  $('#score-screen').attr("placeholder", "!!");
  // If Strict Mode is on, reset game - otherwise replay the sequence
  if (game.strict === "on") {
    setTimeout(function() {
      resetGame();
    }, 2000);
  } else {
    setTimeout(function() {
      $('#score-screen').attr("placeholder", game.score);
      playSequence();
    }, 2000);
  }
}

// Play sound function - also animates the button flashes
function playSound(btnNum) {
  switch(btnNum) {
    case 0:
      $('#btn0').stop().animate({backgroundColor: colors.blueOn}, 10);
      $('#btn0').animate({backgroundColor: colors.blueOff}, 400);
      break;
    case 1:
      $('#btn1').stop().animate({backgroundColor: colors.redOn}, 10);
      $('#btn1').animate({backgroundColor: colors.redOff}, 400);
      break;
    case 2:
      $('#btn2').stop().animate({backgroundColor: colors.yellowOn}, 10);
      $('#btn2').animate({backgroundColor: colors.yellowOff}, 400);
      break;
    case 3:
      $('#btn3').stop().animate({backgroundColor: colors.greenOn}, 10);
      $('#btn3').animate({backgroundColor: colors.greenOff}, 400);
      break;
               }
  var sound = new Audio(sounds[btnNum]);
  sound.play();
}

// Win screen function, for when the player reaches 20 points
function winScreen() {
  $('#score-screen').attr("placeholder", "GG");
  playSound(4);
  var cycle = setInterval(function() {
    $('#btn0').stop().animate({backgroundColor: colors.blueOn}, 500);
    $('#btn0').animate({backgroundColor: colors.blueOff}, 500);
    $('#btn1').stop().animate({backgroundColor: colors.redOn}, 500);
    $('#btn1').animate({backgroundColor: colors.redOff}, 500);
    $('#btn2').stop().animate({backgroundColor: colors.yellowOn}, 500);
    $('#btn2').animate({backgroundColor: colors.yellowOff}, 500);
    $('#btn3').stop().animate({backgroundColor: colors.greenOn}, 500);
    $('#btn3').animate({backgroundColor: colors.greenOff}, 500);
  }, 1000);
  setTimeout(function() {
    clearInterval(cycle);
    resetGame();
  }, 3800);
}


/////* Event listeners */////

$('#btn-start').click(function() {
  if (game.allowPress === true && game.active === false) {
    game.active = true;
    addNumber();
    playSequence();
  };
});

$('#btn-strict').click(function() {
  if (game.active === false) {
    if (game.strict === "off") {
      game.strict = "on";
      $('.strict-led').css('background-color', 'red');
    } else {
      game.strict = "off";
      $('.strict-led').css('background-color', '#460000');
    }
  };
});

$('#btn-reset').click(function() {
  if (game.allowPress === true) {
    resetGame();
  }
});

$('.game-btn').mousedown(function() {
  if (game.allowPress === true) {
    var id = this.id;
    var button = parseInt(id.substr(id.length - 1));
    playSound(button);
    if (game.active === true) {
      game.playerSequence.push(button);
      checkSequence();
    }
  }
});

// Fire when page loads
$(document).ready(function() {
  resetGame();
});