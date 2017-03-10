
function getQuote() {
  var output = $.ajax({
    url: 'https://andruxnet-random-famous-quotes.p.mashape.com/cat=famous',
    type: 'GET',
    data: {},
    dataType: 'json',
    success: function(quoteget) {
      quote = quoteget.quote;
      author = quoteget.author;
      $("#quoteAuthor").fadeOut(500);
      $("#quoteText").fadeOut(500, function() {
        $("#quoteText").html('"' + quote + '"');
        $("#quoteAuthor").html('- ' + author);
      });
      $("#quoteAuthor").fadeIn(500);
      $("#quoteText").fadeIn(500, function() {
      });
    },
    beforeSend: function(xhr) {
      xhr.setRequestHeader("X-Mashape-Authorization", "hlSSsz6r2nmshfN5d1ujZ0AXO8f2p1fDVUNjsnt2q05WBUr1dK");
      }
  })
}

$(document).ready(function() {
  getQuote();
  $("#quoteBtn").on("click", function(){
    getQuote();
  });
  $('#tweetBtn').on('click', function() {
    var url = 'https://twitter.com/intent/tweet?text=' + '"'+quote+'"  - '+author;
    window.open(url, 'twitter');
  });
  $('#me').on('click', function() {
    window.open('https://github.com/Caleb-Ellis','github');
  })
});