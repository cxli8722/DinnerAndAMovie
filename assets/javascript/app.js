

$("#welcome-modal").modal("show");
$("#lets-go").on("click", function(event) {

  $("#welcome-modal").modal("hide");
  $("#initial-form").modal("show");
     
});   

var map;
var infowindow;
var lat=0;
var lng=0;
var keyword= "park";


//ajax for movie data for specific chosen location 
function movieDisplay (theaterLat, theaterLng){
  //console.log("theaterlat:" +theaterLat);
   //console.log("theaterlng:" +theaterLng);
   var currentdate = moment().format('YYYY-MM-DD');

   var queryURL = "https://data.tmsapi.com/v1.1/movies/showings?startDate="+ currentdate+"&lat=" + theaterLat + "&lng=" + theaterLng + "&radius=1&units=km&imageSize=Sm&imageText=true&api_key=6wyda8gpyrx5hr3uqbb33yxh";

//2017-07-10
    $.ajax({
      url: queryURL,
      method: "GET"
    }).done(function(response) {
        console.log(response);
        var movies = []

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
        console.log("Rated " +movie.rating);
        console.log("Showing at: "+movie.showtimes);
       });
      });
}


        
      
    




function loadMap(){
  initMap(35.9940,-78.8986,keyword);
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

    console.log("theaterSelected:" + lat);
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
  console.log("keyword initmap function:" + keyword);  
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
        //console.log(response);

        var addressComponents = response.data.results[0].address_components;
        var addressComponentsOutput = '<ul class="list-group">';
       
        lat = response.data.results[0].geometry.location.lat;
        lng = response.data.results[0].geometry.location.lng;

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
       
      keyword = "movie_theater";
      console.log("keyword set: " + keyword);
       getlocation(zipCode, keyword);


      $("#food-form").modal("show");

      });

    

   $("#food-sumbit").on("click", function(event) {
     // Don't refresh the page!
     $("#food-form").modal("hide");
     
      event.preventDefault();
     //$("#food-form").modal("hide");
      foodInput();
      //var foodtype = $('input[type=checkbox]:checked').val().trim();
      //var zipCode = document.getElementById('zipCodeInput').value;

     
   });

   
   function foodInput  (){

    var checkedValue = null; 
var inputElements = document.getElementsByClassName('messageCheckbox');
    for(var i=0; inputElements[i]; ++i){
      if(inputElements[i].checked){
        checkedValue = inputElements[i].value;
        console.log(checkedValue );
        //var address="8030 Renaissance Pkwy, Durham, NC 27713";
        //getlocation(address, checkedValue);
        initMap(lat,lng,checkedValue);
      }
}

    
   }

  

// $("#initial-form").modal("show");

