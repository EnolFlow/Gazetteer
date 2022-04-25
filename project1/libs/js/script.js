let boundary;
let map;
let popup;
let greenIcon;
let layer;
let lat;
let lng;
let markers;
let country_code;
 map = L.map('map',{zooomcontrol:false,attributionControl: false}).setView([51.505, -0.09], 13);

  layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}',
  {foo: 'bar', attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);

L.control.scale().setPosition("bottomleft").addTo(map);
map.zoomControl.setPosition("bottomleft");


boundary = new L.geoJSON().addTo(map);

let earthquakes_pin = new L.FeatureGroup();
  map.addLayer(earthquakes_pin);

let  wikipedia_pin = new L.FeatureGroup();
  map.addLayer(wikipedia_pin);

  markers =  L.markerClusterGroup();

  let marker_w = new L.markerClusterGroup();
  map.addLayer(marker_w);

  
  let marker_e =new L.markerClusterGroup();
  map.addLayer(marker_e);



 popup = L.popup();


 function onClick() {
     popup

         .openOn(map)
 }

map.on('click', onMapClick);
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

earthquakeIcon = L.icon({
  iconUrl: 'earthquake.png',

  iconSize:     [32, 37], 
  iconAnchor:   [16, 37], 
  popupAnchor:  [0, -35] 
});

wIcon = L.icon({
  iconUrl: 'w.png',

  iconSize:     [32, 37], 
  iconAnchor:   [16, 37], 
  popupAnchor:  [0, -35] 
});


 pinIcon = L.icon({
  iconUrl: 'pin.png',

  iconSize:     [32, 32], 
  iconAnchor:   [16, 32], 
  popupAnchor:  [0, -30] 
});

$(document).ready(function () {
  $("#loader").fadeOut("slow");;
  get_country_codes();
  findLocation();

});




function get_country_codes() {
  $.ajax({
    url: "libs/php/countryCode.php",
    type: "GET",
    success: function (json) {
      let countries = JSON.parse(json);
      let option = "";
      for (country of countries) {
        option +=
          '<option value="' + country[1] + '">' + country[0] + "</option>";
      }
      $("#country_list").append(option);
    },
  });
}


  


const findLocation = () => {
  
  const success = (position) => {
    console.log(position)
   const  latitude = position.coords.latitude;
  const   longitude = position.coords.longitude
    L.marker([latitude, longitude], {icon: pinIcon})
    .bindPopup("This is your Location").addTo(map);
    L.circle([latitude, longitude], {radius: 50}).addTo(map);

          $.ajax({
          url: "libs/php/countryCodeLatLng.php",
          type: 'POST',
          data: {
            latitude: latitude,
            longitude: longitude
          },
          success: function(result) {
         const country_code = result.data;
            country_border(country_code);
            country_information(country_code)
            
          },
          error: function(jqXHR, textStatus, errorThrown){   
          }
      });     
  };
 const error = () => {
   alert('Location not found');
 }
  navigator.geolocation.getCurrentPosition(success, error);
}

function country_border(country_code) {
  $.ajax({
    url: "libs/php/countryBorder.php",
    type: "GET",
    data: {
      country_code: country_code,
    },
    success: function (json) {
      const border = JSON.parse(json);
      boundary.clearLayers();
      boundary.addData(border).setStyle(polystyle());
      const bounds = boundary.getBounds();
      map.fitBounds(bounds);

      const east = bounds.getEast();
      const west = bounds.getWest();
      const north = bounds.getNorth();
      const south = bounds.getSouth();

      wikipedia_info(north,south,east,west)
      earthquake_info(north,south,east,west)
      
    },
  });
}

function polystyle() {
  return {
    color: "red",
    weight: 0.5,
    opacity: 1,
    fillColor: "red",
    fill: true
  };
}


function zoomToCountry(){
   country_code =  $('#country_list').val();
  if (country_code == "") return  ;
country_border(country_code);
country_information(country_code);

}


function wikipedia_info(north,south,east,west) {
  wikipedia_pin.clearLayers();
  marker_w.clearLayers();
  $.ajax({
    url: "libs/php/getWikipedia.php",
    type: "GET",
    data: {
      north: north,
      south: south,
      east: east,
      west: west,
    },
    success: function (result) {
     let data = result.data
     for (let i = 0; i < data.length; i++) {
     let marker = marker_w.addLayer(L.marker([data[i].lat, data[i].lng], {
        icon: wIcon,
      }).bindPopup(
        "<img src='" +
        data[i].thumbnailImg +
        "' width='100px' height='100px' alt='" +
        data[i].title +
        "'><br><b>" +
        data[i].title +
        "</b><br><a href='https://" +
        data[i].wikipediaUrl +
        "' target='_blank'>Wikipedia Link</a>"
      )).addTo(map)
      wikipedia_pin.addLayer(marker);
     
      }
    }
  })
}

function earthquake_info(north,south,east,west) {
  earthquakes_pin.clearLayers();
  marker_e.clearLayers();
  $.ajax({
    url: "libs/php/getEarthquakes.php",
    type: "GET",
    data: {
      north: north,
      south: south,
      east: east,
      west: west,
        },
    success: function (result) {
      let earthquake = result.data
     for (let i = 0; i < earthquake.length; i++) {
     let marker = marker_e.addLayer(L.marker([earthquake[i].lat, earthquake[i].lng], {
        icon: earthquakeIcon,
      }).bindPopup(
       "Datetime:"+ earthquake[i].datetime +
       "<br>" + "Magnitude:" + earthquake[i].magnitude
      )).addTo(map)
      earthquakes_pin.addLayer(marker);
   
      }
   
    },
  });
}

function country_information(country_code) {
  $.ajax({
    url: "libs/php/countryInfo.php",
    type: "GET",
    data: {
      country_code: country_code,
    },
    success: function (json) {
      let info  = $.parseJSON(json);
     let infor = info[0];
     let currency = "";
     for (const x in infor.currencies) {
       currency += x ;
     }
     lat = infor.latlng[0];
     lng = infor.latlng[1];
   let country_capital = infor.capital[0].toLowerCase();
  
      $("#country_name").html(infor.name.common);
      $("#country_capital").html(infor.capital[0]);
      $("#country_population").html(infor.population);
      $("#country_flag").attr("src", infor.flags.png);
      $("#country_currency").html(currency);
      $("#country_wikipedia").attr(
        "href",
        "https://en.wikipedia.org/wiki/" + infor.name.common
      );
      weather_information(lat,lng);
      news_information( country_capital)
    },
  });
}

function weather_information(lat,lng) {
  $.ajax({
    url: "libs/php/weatherInfo.php",
    type: "GET",
    data: {
      lat: lat,
      lng: lng,
    },
    success: function (json) {
      let winfo  = $.parseJSON(json);
    const icon = winfo.current.weather[0].icon;

      $("#weather_image").attr("src", 'http://openweathermap.org/img/wn/' + icon + '@2x.png');
      $("#weather_descr").html(winfo.current.weather[0].description);
      $("#temp").html(winfo.current.temp + '°C');
      $("#feels_like").html(winfo.current.feels_like+ '°C');
      $("#humidity").html(winfo.current.humidity + '%');
      $("#wind").html(winfo.current.wind_speed + 'meter/sec');
     
    },
  });
}

function news_information( country_capital) {
  $("#news_data").html("");
  $.ajax({
    url: "libs/php/newsInfo.php",
    type: "GET",
    data: {
     country_capital: country_capital,
    },
    success: function (json) {
      let news_info  = $.parseJSON(json);
    const data = news_info.articles;
    console.log(data)
    for (let i = 0; i < data.length; i++) {
      $("#news_data").append(news_card(data[i]));
    }

     
    },
  });
}

function news_card(data) {
  const card =
    '<div class="card"> <img class="card-img-top" src="' +
    data.urlToImage +
    '" alt="News Image"> <div class="card-body"> <h5 class="card-title">' +
    data.author +
    '</h5> <p class="card-text">' +
    data.title +
    '</p> <a href="' +
    data.url +
    '" target="_blank" class="btn btn-primary">Details</a> </div> </div>';
  return card;
}