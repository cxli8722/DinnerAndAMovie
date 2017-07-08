      var map;
      var infowindow;
      var lat="";
      var lng="";
      function initMap() {
        var pyrmont = {lat: 35.9940, lng: -78.8986};




        map = new google.maps.Map(document.getElementById('map'), {
          center: pyrmont,
          zoom: 10
        });

        infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
          location: pyrmont,
          radius: 50000,
          type: ['movie_theater']
        }, callback);
      }

      function callback(results, status) {
                    

        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
            console.log(results[i]);
          }
        }
      }

      function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });

        google.maps.event.addListener(marker, 'click', function() {
          lat=JSON.stringify(marker.getPosition().lat());


          lng=JSON.stringify(marker.getPosition().lng());

          console.log(lat);
          console.log(lng);
                    //magic happens here!!!


          infowindow.setContent(place.name);
          infowindow.open(map, this);

          movieDisplay(lat, lng);

        });

function movieDisplay (theaterLat, theaterLng)
{
   var queryURL = "http://data.tmsapi.com/v1.1/movies/showings?startDate=2017-07-08&lat=" + theaterLat + "&lng=" + theaterLng + "&radius=1&units=km&imageSize=Sm&imageText=true&api_key=3vqwthgf9q8feq2mkdjnjs7j";


   //"http://data.tmsapi.com/v1.1/movies/showings?startDate=2017-07-08&lat=43&lng=44&radius=1&units=km&imageSize=Sm&imageText=true&api_key=3vqwthgf9q8feq2mkdjnjs7j"


   //"http://data.tmsapi.com/v1.1/movies/showings?startDate=2017-07-08&lat=" + theaterLat + "lng=" + theaterLng + "&radius=1&units=km&imageSize=Sm&imageText=true&api_key=3vqwthgf9q8feq2mkdjnjs7j";

    $.ajax({
      url: queryURL,
      method: "GET"
    }).done(function(response) {
        console.log(response);
       // console.log(response[0].showtimes[0].theatre);


   /* for (i = 0; i < response.length; i++) { 
      //console.log(response[i]) loop all the object 
      for (j = 0; j < response[i].showtimes.length; j++) { 
          //console.log(response[i].showtimes[j])  
      var movietheater=response[i].showtimes[j];
      //console.log(movietheater.theatre)
        for ( var key in movietheater.theatre){
           //console.log(movietheater.theatre[key]) // return theater name 

          


        };
      };
    };
*/
});

}

      }