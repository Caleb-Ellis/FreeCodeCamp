
$(document).ready(function() {
  var entry = "";
  var log = "0";
  var eqn = "";
  var history = "0";
  $(".btn").click(function() {
    entry = $(this).attr("value");
    switch(entry) {        
      case "AC":
        log = "0";
        history = "0";
        eqn = "";
        break;
      case ".":
        log += ".";
        break;
      case "CE":
        if (log.length <= 1) {
          log = "0";
        } else {
          log = log.substring(0, log.length-1);
        }
        break;
      case "+":
      case "-":
      case "*":
      case "/":
        eqn += log + entry;
        log = "0";
        break;
      case "=":
        eqn += log;
        history = eqn;
        log = String(eval(eqn));
        eqn = "";
        break;
      default:
        if (log === "0") {
          log = entry;
        } else {
          log += entry;
        }
        break;
                }
    if (log.length >= 12) {
      log = log.substring(0, 12);
    }
    $(".log").html(log);
    if (eqn === "") {
      $(".history").html(history);
    } else {
      $(".history").html(eqn);
    }
  })
});