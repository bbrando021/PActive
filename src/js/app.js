/**
 * app.js!
 *
 * HackPSU Pebble App.
 */

var UI = require('ui');
var Vector2 = require('vector2');
var Voice = require('ui/voice');
var ajax = require('ajax');
var timeline = require('./timeline');
var PIN_ID = "timeline-push-pin-test";

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

  var radial = new UI.Radial({
    size: new Vector2(140, 140),
    angle: 0,
    angle2: 300,
    radius: 20,
    backgroundColor: 'cyan',
    borderColor: 'celeste',
    borderWidth: 1,
  });
  var textfield = new UI.Text({
    size: new Vector2(140, 60),
    font: 'gothic-24-bold',
    text: 'Ask\nAway!',
    textAlign: 'center'
  });
  var windSize = wind.size();
  // Center the radial in the window
  var radialPos = radial.position()
      .addSelf(windSize)
      .subSelf(radial.size())
      .multiplyScalar(0.5);
  radial.position(radialPos);
  // Center the textfield in the window
  var textfieldPos = textfield.position()
      .addSelf(windSize)
      .subSelf(textfield.size())
.multiplyScalar(0.5);

  textfield.position(textfieldPos);
  wind.add(radial);
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
        }, function success(data, status){
          console.log("Status: " + status);
          var times = data;
          var list = [];

          for(var i=0; i<times.length; i++){
            console.log(times[i].timeString);
            if(times[i].day != undefined){
              list.push({"title": times[i].day + " " + times[i].timeString});
            }else{
              list.push({"title": times[i].timeString});
            }
          }

          Pebble.getTimelineToken(function(token) {
            console.log('My timeline token is ' + token);
          }, function(error) {
            console.log('Error getting timeline token: ' + error);
          });

            // An hour ahead
          var date = new Date();
          date.setHours(date.getHours() + 1);

            // Create the pin
          var pin = {
              "id": "pin-" + PIN_ID,
              "time": date.toISOString(),
              "layout": {
                "type": "genericPin",
                "title": e.transcription,
                "body": "This event has been added to the calendar!",
                "tinyIcon": "system://images/SCHEDULED_EVENT"
              }
            };

          console.log('Inserting pin in the future: ' + JSON.stringify(pin));

          timeline.insertUserPin(pin, function(responseText) { 
              console.log('Result: ' + responseText);
          });

          var timesCard = new UI.Menu({
              backgroundColor: 'black',
              textColor: 'blue',
              highlightBackgroundColor: 'blue',
              highlightTextColor: 'black',
              sections: [{
                items: list
              }]
          });

          if(list.length == 1){
            timesCard.font = 'gothic-24-bold'; 
          }

          var usrVoiceInput = e.transcription;
          timesCard.on('select', function(e) {
              console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
              console.log('The item is titled "' + e.item.title + '"');
              var resultCard = new UI.Card();
              resultCard.title(usrVoiceInput);
              resultCard.show();
              var evt_image = new UI.Image({
                position: new Vector2(0, 0),
                size: new Vector2(144, 144),
                backgroundColor: 'black',
                image: 'images/eventscheduled.png'
              });
              resultCard.add(evt_image);
          });

          timesCard.show();          
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