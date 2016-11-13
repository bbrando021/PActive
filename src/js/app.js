/**
 * app.js!
 *
 * HackPSU Pebble App.
 */

var UI = require('ui');
var Vector2 = require('vector2');
var Voice = require('ui/voice');
var ajax = require('ajax');

var main = new UI.Card({
  title: 'Pact',
  icon: 'images/menu_icon.png',
  subtitle: 'Welcome to Pact!',
  body: 'Press any button to ask!',
  subtitleColor: 'indigo', // Named colors
  bodyColor: '#9a0036' // Hex colors
});

main.show();

main.on('click', 'select', function(e) {
  var wind = new UI.Window({
    backgroundColor: 'black'
  });

  var textfield = new UI.Text({
    size: new Vector2(140, 60),
    font: 'gothic-24-bold',
    text: 'Ask\nAway!',
    textAlign: 'center'
  });

  wind.add(textfield);
  wind.show();
  wind.on('click', 'select', function(e){
    Voice.dictate('start', true, function(e) {
      if (e.err) {
        console.log('Error: ' + e.err);
        return;
      }

      // ajax({
      //     url: 'http://echo.jsontest.com/message/'+encode(e.transcription),
      //     method: 'GET',
      //     type: undefined,
      //     headers: {
      //     }
      //   },
      //   function(data, status, request) {
      //       console.log('Awesome! Your message has been posted.');
      //   },
      //   function(error, status, request) {
      //       console.log('There was an error posting your message.');
      //   }
      // );

      ajax({
          url: "https://pebble-app-test-abdallahozaifa.c9users.io/pebble",
          method: "POST",
          type: 'json',
          data: {"data" : e.transcription},
          crossDomain: true
      });
    });  
  });
});


