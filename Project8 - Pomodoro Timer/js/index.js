
$(document).ready(function() {
  // Initialise variables
  var sMin = 25;
  var bMin = 5;
  var on = false;
  var paused = false;
  
  // Set session and break timers
  $("#sessionTime").html(sMin + ":00");
  $("#breakTime").html(bMin + ":00");
  
  // Initialise progress bar
  var bar = new ProgressBar.Circle(container, {
    color: '#fff',
    // This has to be the same size as the maximum width to
    // prevent clipping
    strokeWidth: 4,
    trailWidth: 1,
    trailColor: '#d52121',
    easing: 'easeInOut',
    text: {
      autoStyleContainer: false,
    },
    from: { color: '#ccc', width: 1 },
    to: { color: '#fff', width: 4 },
    // Set default step function for all animate calls
    step: function(state, circle) {
      circle.path.setAttribute('stroke', state.color);
      circle.path.setAttribute('stroke-width', state.width);
      var value = 3 - Math.round(circle.value() * 3);
      if (value === 0) {
        circle.setText('Ready?');
      } else {
        circle.setText(value);
      }
    }
  });
  
  // Set text style(couldn't get it to work in bar constructor)
  bar.text.style.fontSize = '2rem';
  
  // Call progress bar intro animation
  bar.animate(1.0, {
    duration: 2000
  });
  
  // Reset function - return to initial state (incl. intro animation)
  function reset() {
    on = false;
    sMin = 25;
    bMin = 5;
    $("#icon").removeClass('fa-pause');
    $("#icon").addClass('fa-play');
    $("#sessionTime").html(sMin + ":00");
    $("#breakTime").html(bMin + ":00");
    bar.set(0);
    bar.animate(1.0, {
      duration: 2000
    });
  }
  
  // Four click functions change the session and break timers (+ or -). They have
  // been set such that they can't be changed while a timer is running
  $("#sessionMinus").click(function() {
    if (bar.text.innerText === "Ready?") {
      if (sMin > 1) {
        sMin -= 1;
        $("#sessionTime").html(sMin + ":00");
      }
    }
  });
  $("#sessionPlus").click(function() {
    if (bar.text.innerText === "Ready?") {
      sMin += 1;
      $("#sessionTime").html(sMin + ":00");
    }
  });
  $("#breakMinus").click(function() {
    if (bar.text.innerText === "Ready?") {
      if (bMin > 1) {
        bMin -= 1;
        $("#breakTime").html(bMin + ":00");
      }
    }
  });
  $("#breakPlus").click(function() {
    if (bar.text.innerText === "Ready?") {
      bMin += 1;
      $("#breakTime").html(bMin + ":00");
    }
  });
  
  // If reset button clicked, restart app
  $("#resetBtn").click(function() {
    reset();
  });
  
  // If play/start button clicked...
  $("#startBtn").click(function() {
    // Break progress bar function declaration. Animates anticlockwise.
    function brk(s, b) {
      bar.animate(0, {
        easing: 'linear',
        duration: b * 1000 * 60,
        from: { color: '#fff', width: 4 },
        to: { color: '#fff', width: 4 },
        step: function(state, circle) {
          circle.path.setAttribute('stroke', state.color);
          circle.path.setAttribute('stroke-width', state.width);
          var value = b - Math.floor(circle.value() * b);
          circle.setText('Break!');
        }
      }, function() {
        // Callback to session progress bar
        ses(s, b)
      })
    }
    // Session progress bar function declaration. Animates clockwise.
    function ses(s, b) {
      bar.animate(1.0, {
        easing: 'linear',
        duration: s * 1000 * 60,
        from: { color: '#fff', width: 4 },
        to: { color: '#fff', width: 4 },
        step: function(state, circle) {
          circle.path.setAttribute('stroke', state.color);
          circle.path.setAttribute('stroke-width', state.width);
          // Set the timer in the center of progress bar
          var value = (sMin - (circle.value() * sMin)) * 60;
          var minutes = Math.floor(value/60);
          var seconds = Math.floor(value%60);
          if (seconds < 10) {
            seconds = "0" + seconds;
          }
          circle.setText(minutes + ":" + seconds);
        }
      }, function() {
        // Callback to break progress bar
        brk(s, b)
      })
    };
    
    // When session/break timer in action, the play button becomes a pause button
    $("#icon").toggleClass('fa-play fa-pause');
    // If a session has not yet been initialised, initialise it
    if (on === false) {
      on = true;
      bar.set(0);
      ses(sMin, bMin);
    } else if (on === true) {
      // If the timer is not paused and pause button is clicked, pause timer
      if (paused === false) {
        bar.stop();
        paused = true;
      } else if (paused === true) {
        // otherwise check whether the timer is going forward or backward, in order
        // to decide whether to call ses or brk functions
        if (bar.text.innerText === 'Break!') {
          bar.set(bar.value());
          brk(sMin, bMin-((1-bar.value())*bMin))
        } else {
          bar.set(bar.value());
          ses(sMin-(bar.value()*sMin), bMin);
        }
        paused = false;
      }
    }
  });
});