var arrResults = [];
var html = '';

function Result(title, snippet) {
  this.title = title;
  this.snippet = snippet;
}

function loadArticles() {
  var searchString = document.forms["searchForm"]["article"].value;
  if (searchString == "") {
    $('#search').attr("placeholder", "Please enter text here.");
  } else {
    $('#textSearch').fadeOut(500);
    $('#searchBtn').fadeOut(500);
    $('#randomBtn').fadeOut(500, function() {
      $('#main').toggleClass('mainBar tightBar', 200, 'swing');
      $('#main').toggleClass('center top', 400, 'swing');
      $.ajax({
        url: 'https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srsearch=' + searchString,
        dataType: 'jsonp',
        type: 'POST',
        headers: {
          'Api-User-Agent': 'Example/1.0'
        },
        success: function(data) {
          $('.results').empty();
          $('.results').css('visibility', 'visible');
          arrResults.length = 0;
          var resArr = data.query.search;
          for (var result in resArr) {
            arrResults.push(new Result(resArr[result].title, resArr[result].snippet));
            html = '<div id="articles" class="well"><a href="https://en.wikipedia.org/wiki/' + resArr[result].title + '"target="_blank"><h3>' + resArr[result].title + '</h3></a><p>' + resArr[result].snippet + '</p></div>';
            $('.results').append(html);
          }
        }
      });
    });
  }
}

$(document).ready(function() {
  $('#randomBtn').on('click', function() {
    window.open('https://en.wikipedia.org/wiki/Special:Random', 'Random');
  });
  $('#resetBtn').on('click', function() {
    $('.results').css('visibility', 'hidden');
    if ($('#main').hasClass('center')) {
      $('#search').value("");
    } else {
      $('#main').toggleClass('mainBar tightBar', 200, 'swing');
      $('#main').toggleClass('center top', 400, 'swing', function() {
        $('#textSearch').fadeIn(500);
        $('#searchBtn').fadeIn(500);
        $('#randomBtn').fadeIn(500);
      });
    }
  });
  $("#search").keydown(function(event) {
    if ((event.keyCode == 13) && ($('#main').hasClass('center'))) {
      loadArticles();
      return false;
    } else if ((event.keyCode == 13) && ($('#main').hasClass('top'))) {
      return false;
    }
  });
});