// I realize this was probably just used for debugging, but two versions of a file == no bueno
// Git commit the file and then make changes or delete the file,
// you won't lose any work if its in a git commit. Having two versions of anything
// is a sure recipe for bugs and banging-your-head-against-desk

$("#welcome-modal").modal("show");
$("#lets-go").on("click", function(event) {

  $("#welcome-modal").modal("hide");
  $("#initial-form").modal("show");
});   

var map;
var infowindow;
var lat = 0;
var lng = 0;
var keyword = "park";
var radiusValue = 50000;


var newLat;
var newLng;

//ajax for movie data for specific chosen location 
function movieDisplay(theaterLat, theaterLng) {

    newLat = lat;
    newLng = lng;

  //console.log("theaterlat:" +theaterLat);
   //console.log("theaterlng:" +theaterLng);
  $("#movie").animate({width:'toggle'},350);
  var currentdate = moment().format('YYYY-MM-DD');
  var queryURL = "https://data.tmsapi.com/v1.1/movies/showings?startDate="+ currentdate+"&lat=" + theaterLat + "&lng=" + theaterLng + "&radius=1&units=km&imageSize=Sm&imageText=true&api_key=3vqwthgf9q8feq2mkdjnjs7j";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(response) {
      console.log(response);
      var movies = [];
      for (i = 0; i < response.length; i++) {
        if (response[i].ratings) {
          movies.push({
            title: response[i].title,
            rating: response[i].ratings[0].code,
            showtimes: response[i].showtimes.map(function(v){
            return moment(v.dateTime).format('LT');
            })
          });
        } 
      }
      movies.forEach(function(movie){
        console.log(movie.title);
        console.log("Rated " + movie.rating);
        console.log("Showing at: " + movie.showtimes);
        var newDiv = $("<div class='movieDiv'>");
        newDiv.append($("<p><bold>Title:</bold> " + movie.title + "</p>"));
        newDiv.append($("<p><bold>Rating:</bold> " + movie.rating + "</p>"));
        newDiv.append($("<p><bold>Showing at:</bold> " + movie.showtimes + "</p>"));
        console.log("newDiv: " + newDiv);
        $("#movieListings").append(newDiv);
      });
  });
}

function loadMap() {
  initMap(35.9940, -78.8986, keyword);
}

// creating popup 
function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    $("#movieListings").empty();
    lat=JSON.stringify(marker.getPosition().lat());
    lng=JSON.stringify(marker.getPosition().lng());

    console.log("theaterSelected:" + lat);
    console.log(lng);
              //magic happens here!!!
    infowindow.setContent(place.name);
    infowindow.open(map, this);
    movieDisplay(lat, lng);

  });
}

// Place markers on map
function placeMarkers(results, status) {            
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
      console.log(results[i]);
    }
  }
}

// Display map with search results
function initMap(lat, lng, keyword) { // use lat and lng 
    // make sure we're dealing with floats
    let flat = parseFloat(lat);
    let flng = parseFloat(lng);
    var latLngObj = { lat: flat, lng: flng };
  console.log("lat1: " + flat);
  console.log("lng2: " + flng);
  console.log("keyword initmap function:" + keyword);  
  map = new google.maps.Map(document.getElementById('map'), {
    center: latLngObj,
    zoom: 10
  });
  infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: latLngObj ,
    radius: radiusValue,
    keyword: [keyword]
  }, placeMarkers);
}

// Get lat and lng to pass to movie API
function getlocation(address, keyword){
  console.log("getlocation: " + address + keyword);
  axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
    params:{
      address:address,
      key:'AIzaSyBO59mo6rMe4ChzmBqEQ8gz9QmWjg_X38c'
    }
  }).then(function(response){
    // Log full response
    console.log(response);

    var addressComponents = response.data.results[0].address_components;
    var addressComponentsOutput = '<ul class="list-group">';
    
    lat = response.data.results[0].geometry.location.lat;
    lng = response.data.results[0].geometry.location.lng;

    console.log("latt: " + lat)

    console.log("lngg: " + lng)
    initMap(lat, lng, keyword);
    
  }).catch(function(error){
    console.log(error);
  });
}

// Click event for initial form submit
$("#sumbitbtn").on("click", function(event) {
  event.preventDefault();
  $("#initial-form").modal("hide");
  var zipCode = $("#zipCodeInput").val().trim();
  console.log("zipcode:" + zipCode);    
  keyword = "movie_theater";
  console.log("keyword set: " + keyword);
  getlocation(zipCode, keyword);
});

// Click event for food form submit
$("#food-sumbit").on("click", function(event) {
  event.preventDefault();
  $("#food-form").modal("hide");
  foodInput();
});

// Get values of checked food choices and put markers on the map   
function foodInput() {

  //default is mini golf if your date is indecisive
  var checkedValue = "mini golf"; 
  var inputElements = document.getElementsByClassName('messageCheckbox');
  for(var i=0; inputElements[i]; ++i){
      if (inputElements[i].checked) {
          if (checkedValue === "mini golf") {
              checkedValue = "";
          }
      checkedValue += inputElements[i].value + " ";
      console.log(checkedValue );
    }
  }
     initMap(newLat, newLng, checkedValue);
}

// Get Radius
$(".dropdown-item").on("click", function() {
  var radiusMiles = parseInt($(this).attr('value'));
  radiusValue =  (radiusMiles * 1609.344);
  var buttonText = $(this).text();
  console.log("Radius: " + radiusMiles + " miles, " + radiusValue + " meters");
  $("#radius").text(buttonText);
});

// Click event for theater submit
$("#theaterSubmit").on("click", function(event) {
  event.preventDefault();
  $("#food-form").modal("show");
});
