var APPKEY = "3670c6e8995f48a171ca6e3dbf7519b6"
var units = "c";

function getDate() {
  var date = new Date();
  var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  var daysSmall = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  var day = days[date.getDay()];
  var smallDays = [];
  for (i=0;i<5;i++) {
    smallDays[i] = daysSmall[date.getDay()+i];
  }
  var dd = date.getDate();
  var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  var month = months[date.getMonth()];
  if (dd == 1) {
    dd += 'st';} else if (dd == 2) {dd += 'nd';} else if (dd == 3) {dd += 'rd';} else {dd += 'th';
  }
  $('#date').html(day+' '+dd+' '+month);
  for (i=0;i<smallDays.length;i++) {
    $('#day'+i).html(smallDays[i]);
  }
}

function getLocation() {
  $.get("http://ipinfo.io", function(response) {
  var city = response.city;
  var country = response.country;
  $('#location').html(city+', '+country);
  }, "jsonp");
}

function getWeather() {
  $.getJSON("http://ipinfo.io", function(response) {
    var x = response.loc;
    var lat = x.split(",")[0];
    var lon = x.split(",")[1];
    $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&APPID="+APPKEY,function(data){
      if (units == 'c') {
        $('#temp').html(Math.round(data.main.temp-273)+"°");
      } else if (units =='f') {
        $('#temp').html(Math.round((data.main.temp-273)*(9/5)+(32))+"°");
      }
      var status = data.weather[0].main;
      if (status == "Clear") {
        $('#status').html("Clear");
        document.getElementById("mainIcon").className = "wi wi-day-sunny sun";
        document.getElementById("screen").className = "screen clear";
      } else if (status == "Rain" || status == "Drizzle") {
        $('#status').html("Rainy");
        document.getElementById("mainIcon").className = "wi wi-rain";
        document.getElementById("screen").className = "screen rainy";
      } else if (status == "Thunderstorm") {
        $('#status').html("Thunderstorm");
        document.getElementById("mainIcon").className = "wi wi-lightning";
        document.getElementById("screen").className = "screen lightning";
      } else if (status == "Snow") {
        $('#status').html("Snow");
        document.getElementById("mainIcon").className = "wi wi-snowflake-cold";
        document.getElementById("screen").className = "screen snowy";
      } else {
        $('#status').html("Cloudy");
        document.getElementById("mainIcon").className = "wi wi-cloudy";
        document.getElementById("screen").className = "screen cloudy";
      }
    });
    $.getJSON("http://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&APPID="+APPKEY,function(data){
      var status = [];
      for (i=0;i<5;i++) {
        status[i]=data.list[i].weather[0].main;
      }
      for (i=0;i<status.length;i++) {
        if (status[i] == "Clear") {
          document.getElementById("icon"+i).className = "wi wi-day-sunny week-icon";
        } else if (status[i] == "Rain" || status[i] == "Drizzle") {
          document.getElementById("icon"+i).className = "wi wi-rain week-icon";
        } else if (status[i] == "Thunderstorm") {
          document.getElementById("icon"+i).className = "wi wi-lightning week-icon";
        } else if (status[i] == "Snow") {
          document.getElementById("icon"+i).className = "wi wi-snowflake-cold week-icon";
        } else {
          document.getElementById("icon"+i).className = "wi wi-cloudy week-icon";
        }
      }
    });
  });
}

$(document).ready(function() {
  getLocation();
  getDate();
  getWeather();
  
  $('#degrees').on('click', function () {
    if (units == 'c') {
      $('#degrees').html('°F');
      units = 'f';
    } else if (units == 'f') {
      $('#degrees').html('°C');
      units = 'c';
    }
    getWeather();
  })
  
  $('#me').on('click', function() {
    window.open('https://github.com/Caleb-Ellis','github');
  })
  
  
});