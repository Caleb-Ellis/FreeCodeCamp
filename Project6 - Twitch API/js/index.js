// api key from twitch
var API_KEY = 'k6ficahr2ais0ofcajl46gdah925x3'

// initialise channels variable
var channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas","twitchpresents","northernlion"].sort();

function getChannelInfo() {
  // .forEach method runs the function for each channel in the channels variable
  channels.forEach(function(channel) {
    
    // append html to the #channels div
    $('#channels').append('<div id="'+channel+'Row" class="rows">'+
                          '<div id="'+channel+'Logo" class="logoColumn"></div>'+
                          '<div id="'+channel+'Name" class="name"></div>'+
                          '<div id="'+channel+'Status" class="status"></div>');
    
    // run ajax command to receive channel's stream data
    $.ajax({
      type: 'GET',
      url: 'https://api.twitch.tv/kraken/streams/'+channel,
      headers: {
        'Client-ID': API_KEY
      },
      success: function(streamData) {
        if (streamData.stream === null) {
          // channel is not streaming
          var online = false;
          $('#'+channel+'Row').addClass('offline');
          $('#'+channel+'Row').removeClass('online');
          $('#'+channel+'Status').html('OFFLINE');
        } else {
          // channel is currently streaming
          var online = true;
          $('#'+channel+'Row').addClass('online');
          $('#'+channel+'Row').removeClass('offline');
        }
        
        // run ajax command to receive channel's general data
        $.ajax({
          type: 'GET',
          url: 'https://api.twitch.tv/kraken/channels/'+channel,
          headers: {
            'Client-ID': API_KEY
            },
          success: function(channelData) {
            if (online == true) {
              // if channel is online, provide stream info in status column
              $('#'+channel+'Status').html('<a href ="' + channelData.url + '"target="_blank">' + streamData.stream.game + ': ' + channelData.status + '</a>');
            };
            // add logo and channel name to corresponding columns
            $('#'+channel+'Logo').html('<a href ="https://www.twitch.tv/'+channel+'/videos/all" target="_blank"><img class="logo" src="'+channelData.logo+'"></a>');
            $('#'+channel+'Name').html('<a href ="https://www.twitch.tv/'+channel+'/videos/all" target="_blank">'+channelData.display_name+'</a>');
            },
          error: function() {
            // if ajax command does not pass, return generic logo and name
            $('#'+channel+'Logo').html('<a href="#"><img class="logo" src="https://dummyimage.com/50x50/ecf0e7/5c5457.jpg&text=0x3F"></a>');
            $('#'+channel+'Name').html(channel);
            }
        });
      }
    });
    $('#channels').append('</div>');    
  })
}

// only run functions once document is ready
$(document).ready(function() {
  getChannelInfo();
  
  // go to my GitHub when clicking footer
  $('#me').on('click', function() {
    window.open('https://github.com/Caleb-Ellis','github');
  })
});