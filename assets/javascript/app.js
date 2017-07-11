$("#welcome-modal").modal("show");
$("#lets-go").on("click", function() {
  $("#welcome-modal").modal("hide");
  $("#initial-form").modal("show");
     
});   

var map;
var infowindow;
//var lat="";
//var lng="";


//ajax for movie data for specific chosen location 
function movieDisplay (theaterLat, theaterLng){
  console.log("theaterlat:" +theaterLat);
   console.log("theaterlng:" +theaterLng);
   var currentdate = moment().format('YYYY-MM-DD');
   var queryURL = "http://data.tmsapi.com/v1.1/movies/showings?startDate="+ currentdate+"&lat=" + theaterLat + "&lng=" + theaterLng + "&radius=1&units=km&imageSize=Sm&imageText=true&api_key=3vqwthgf9q8feq2mkdjnjs7j";
//2017-07-10
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
function loadMap(){
  initMap(35.9940,-78.8986);
}
// creating popup 
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
}

function placeMarkers(results, status) {                    

  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
      console.log(results[i]);
    }
  }
}

function initMap(lat, lng){// use lat and lng 
  var pyrmont = {lat: lat, lng: lng};
  console.log("lat1: " + lat);
 console.log("lng2: " + lng);
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
  }, placeMarkers);
}



function getlocation(zipCode, callback){

   axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
        params:{
          address:zipCode,
          key:'AIzaSyBO59mo6rMe4ChzmBqEQ8gz9QmWjg_X38c'
        }
      })
      .then(function(response){
        // Log full response
        console.log(response);

        var addressComponents = response.data.results[0].address_components;
        var addressComponentsOutput = '<ul class="list-group">';
       
        var lat = response.data.results[0].geometry.location.lat;
        var lng = response.data.results[0].geometry.location.lng;

        console.log("latt: " + lat)

        console.log("lngg: " + lng)
        callback(lat, lng);
       
      })
      .catch(function(error){
      console.log(error);
      });
    }
  
 

//important 


    $("#sumbitbtn").on("click", function() {
     // Don't refresh the page!

     event.preventDefault();
     $("#initial-form").modal("hide");
 
      var zipCode = $("#zipCodeInput").val().trim();
      //var zipCode = document.getElementById('zipCodeInput').value;
      console.log("zipcode:" + zipCode);
      // call the fucntion getlocation()
       

       getlocation(zipCode,initMap);


      });

   
  
     
   


     


// $("#initial-form").modal("show");

