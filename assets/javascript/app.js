

$("#welcome-modal").modal("show");
$("#lets-go").on("click", function(event) {

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

   var queryURL = "https://data.tmsapi.com/v1.1/movies/showings?startDate="+ currentdate+"&lat=" + theaterLat + "&lng=" + theaterLng + "&radius=1&units=km&imageSize=Sm&imageText=true&api_key=3vqwthgf9q8feq2mkdjnjs7j";

//2017-07-10
    $.ajax({
      url: queryURL,
      method: "GET"
    }).done(function(response) {
        console.log(response);
       // console.log(response[0].showtimes[0].theatre);


   for (i = 0; i < response.length; i++) { 
      //console.log(response[i]) loop all the object 
      for (j = 0; j < response[i].showtimes.length; j++) { 
          //console.log(response[i].showtimes[j])  

      var movietheater=response[i].showtimes[j];
        console.log("showtime:" +movietheater.dateTime+ "movieTitle: "+ response[i].title)
        
        //for ( var key in movietheater.theatre){
           //console.log(movietheater.theatre[key]) // return theater name 

          


        };
      };
    //};

});

}
function loadMap(){
  initMap(35.9940,-78.8986);
}

// // get a list of places based on cuisine keywords
// function getPlaces(type) {
//   var queryUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670,151.1957&radius=500&types=restaurant&keyword=" + type + "key=AIzaSyAyJ9StHU9kwMRBGiBeCgdPaCbQtdAe9Wo";
//   console.log("queryURL: " + queryUrl);
//     $.ajax ({
//         url: queryUrl,
//         method: "GET",
//         dataType: "json",
//         cache: false,
//         // success: function(response){      
//         //     alert(response);                   
//         // }
//     }).done(function(result) {
//         console.log(result);
//         //var name = response.;
//         // var rating;
//         // var hours;
//     });
// }

// create the locationUrl based on checked values
// function locationParameter() {
//     var foodTypes = document.forms[0];
//     var locationUrl = "";
//     for (var i = 0; i < foodTypes.length; i++) {
//         if (foodTypes[i].checked) {
//             locationUrl = locationUrl + foodTypes[i].value + "&";
//         }
//     }
//    console.log("locationUrl: "+ locationUrl);
//    getPlaces(locationUrl);
// }

// $("#food-submit").on("click", function(event) {
//     event.preventDefault();
//     locationParameter();
// });

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

function initMap(lat, lng, keyword){// use lat and lng 
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
    keyword: [keyword]
  }, placeMarkers);
}



function getlocation(address, keyword){


   axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
        params:{
          address:address,
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
        initMap(lat, lng, keyword);
       
      })
      .catch(function(error){
      console.log(error);
      });
    }

//important 




    $("#sumbitbtn").on("click", function(event) {
     // Don't refresh the page!
     
      event.preventDefault();
     $("#initial-form").modal("hide");
 
      var zipCode = $("#zipCodeInput").val().trim();
      //var zipCode = document.getElementById('zipCodeInput').value;
      console.log("zipcode:" + zipCode);
      // call the fucntion getlocation()
       

       getlocation(zipCode, "movie_theater");




      });

    /*

   $("#food-sumbit").on("click", function(event) {
     // Don't refresh the page!
     
      event.preventDefault();
     //$("#food-form").modal("hide");
 
      var foodtype = $('input[type=checkbox]').val().trim();
      //var zipCode = document.getElementById('zipCodeInput').value;
      console.log("foodtype:" + foodtype);
      // call the fucntion getlocation()
       

       getlocation(address, foodtype);




      });
*/
   

  //still working on it 
  
     /*
  function initMap(lat, lng, keyword){// use lat and lng 
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

   //keyword: ['movie_theater']

    if (chosenfood === pizza){
        keyword: [ ]
        else if ()
        else 

    }


  }, placeMarkers);
}

var fruits = ["Banana", "Orange", "Apple", "Mango"];
fruits.push("Kiwi");


     */



// $("#initial-form").modal("show");

