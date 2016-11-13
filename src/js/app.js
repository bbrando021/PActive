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

      var coordinates = {"lat": "", "longt": ""};

      function success(pos) {
        console.log('lat= ' + pos.coords.latitude + ' lon= ' + pos.coords.longitude);
        coordinates.lat = pos.coords.latitude;
        coordinates.longt = pos.coords.longitude;

        ajax({
          url: "https://pebble-app-test-abdallahozaifa.c9users.io/activity",
          method: "POST",
          type: 'json',
          data: {"text" : e.transcription, "longitude": coordinates.longt, "latitude": coordinates.lat},
          crossDomain: true,
        }, function(data){
          console.log(data);
        });
      }

      function error(err) {
        console.log('location error (' + err.code + '): ' + err.message);
      }

      /* ... */

      // Choose options about the data returned
      var options = {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 10000
      };

      // Request current position
      navigator.geolocation.getCurrentPosition(success, error, options);

    });  
  });
});


