let boundary;
let map;
let popup;
let greenIcon;
let layer;
let lat;
let lng;
let markers;
let country_code;


 map = L.map('map',{zooomcontrol:false}).setView([51.505, -0.09], 13);
 map.attributionControl.addAttribution('<a href="https://leafletjs.com/">Alexandru Beraru</a>');


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

let images = new Array();
function preLoader() {
 for (var i = 0; i < images.length; i++) {
     let tempImage = new Image();           
     tempImage.src = images[i];
 }
}

$(document).ready(function () {
  findLocation();
  get_country_codes();
  buttons_ready();
  preLoader();
  $("#loader").fadeOut("slow");
});

function buttons_ready(){
  L.easyButton( 'fa-info', function(){
    $('#country_information').modal('show')  }).setPosition("bottomright").addTo(map);
    L.easyButton( 'fa-newspaper', function(){
      $('#country_news').modal('show')  }).setPosition("bottomright").addTo(map);
      L.easyButton( 'fa-cloud', function(){
        $('#country_weather').modal('show')  }).setPosition("bottomright").addTo(map);
        L.easyButton( 'fa-wikipedia-w', function(){
          $('#country_wiki').modal('show')  }).setPosition("bottomright").addTo(map);
          L.easyButton( ' fa-dollar', function(){
            $('#currency').modal('show')  }).setPosition("bottomright").addTo(map);

          }



          const findLocation = () => {
  
            const success = (position) => {
             
             const  latitude = position.coords.latitude;
            const   longitude = position.coords.longitude
          
                    $.ajax({
                    url: "libs/php/countryCodeLatLng.php",
                    type: 'POST',
                    data: {
                      latitude: latitude,
                      longitude: longitude
                    },
                    success: function(result) {
                   let country_code = result.data;
                
                
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



$("#country_list").on('change', () => {
  country_code =  $('#country_list').val();
  if (country_code == "") return  ;
country_border(country_code);
country_information(country_code);
});



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
      images.push(data[i].thumbnailImg);
      
     
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
       let date = earthquake[i].datetime;
     
     let marker = marker_e.addLayer(L.marker([earthquake[i].lat, earthquake[i].lng], {
        icon: earthquakeIcon,
      }).bindPopup(
       "<b>Time: </b> "+ Date.parse(date).toString(" dS MMM yy") +
       "<br>" + "<b>Magnitude:</b>  " + earthquake[i].magnitude +
       "<br>" + "<b>Depth:</b>  "+ earthquake[i].depth + "km"
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
      let info  = JSON.parse(json);
    
     let infor = info[0];
     let currency = "";
     for (const x in infor.currencies) {
       currency += x ;
     }
     lat = infor.capitalInfo.latlng[0];
     lng = infor.capitalInfo.latlng[1];
     let country_capital = infor.capital[0].toLowerCase();
     let country_capitall=infor.capital[0];
     let countryN = infor.name.common.split(" ").join("");
     let countryName = infor.name.common;
     let population = infor.population
     let option ="";
     option +=
          '<option value="' + country_code + '">' + countryName + "</option>";
          $( option ).prependTo( "#country_default" );
          $("#img_info").attr("src", infor.coatOfArms.png);
      $("#country_name").html(infor.name.common);
      $("#country_capital").html(infor.capital[0]);
      $("#country_flag").attr("src", infor.flags.png);
      $("#country_population").html(Intl.NumberFormat('en-IN', { maximumSignificantDigits: 8 }).format(population));
      $("#country_currency").html(currency);
      $("#country_continent").html(infor.continents[0]);
      $("#country_wikipedia").attr(
        "href",
        "https://en.wikipedia.org/wiki/" + infor.name.common
      );
      weather_information(lat,lng,country_capitall);
      news_information( country_capital);
      wiki_summary( countryN, countryName);
      currency_exchange(currency)
    },
  });
}

function weather_information(lat,lng,country_capitall) {
  $.ajax({
    url: "libs/php/weatherInfo.php",
    type: "GET",
    data: {
      lat: lat,
      lng: lng,
    },
    success: function (json) {
      let winfo  =  JSON.parse(json);
    const icon = winfo.current.weather[0].icon;

   
      $("#weather_image").attr("src", 'http://openweathermap.org/img/wn/' + icon + '@2x.png');
      $("#weather_descr").html(winfo.current.weather[0].description);
      $("#temp").html(parseInt(winfo.current.temp) + '°C');
      $("#weather_capi").html(country_capitall);

      $("#tempmax").html(parseInt(winfo.daily[0].temp.max) + '°C');
      $("#tempmin").html(parseInt(winfo.daily[0].temp.min) + '°C');
      $("#weather_img").attr("src", 'http://openweathermap.org/img/wn/' + winfo.daily[0].weather[0].icon + '@2x.png');
      $("#today").html(Date.strftime("D", new Date(winfo.daily[1].dt)));

       $("#tempmax2").html(parseInt(winfo.daily[1].temp.max) + '°C');
      $("#tempmin2").html(parseInt(winfo.daily[1].temp.min) + '°C');
      $("#weather_img2").attr("src", 'http://openweathermap.org/img/wn/' + winfo.daily[1].weather[0].icon + '@2x.png');
      $("#today2").html(Date.strftime("D", new Date(winfo.daily[2].dt)));

      $("#tempmax3").html(parseInt(winfo.daily[2].temp.max) + '°C');
      $("#tempmin3").html(parseInt(winfo.daily[2].temp.min) + '°C');
      $("#weather_img3").attr("src", 'http://openweathermap.org/img/wn/' + winfo.daily[2].weather[0].icon + '@2x.png');
      $("#today3").html(Date.strftime("D", new Date(winfo.daily[3].dt)));

      $("#tempmax4").html(parseInt(winfo.daily[3].temp.max) + '°C');
      $("#tempmin4").html(parseInt(winfo.daily[3].temp.min) + '°C');
      $("#weather_img4").attr("src", 'http://openweathermap.org/img/wn/' + winfo.daily[3].weather[0].icon + '@2x.png');
      $("#today4").html(Date.strftime("D", new Date(winfo.daily[4].dt)));

     

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
      let news_info  =  JSON.parse(json);
    const data = news_info.articles;
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
    data.title +
    '</h5> <p class="card-text">' +
    data.description +
    '</p> <a href="' +
    data.url +
    '" target="_blank" class="btn btn-secondary">' + data.source.name +'</a> </div> </div>';
  return card;
}

function wiki_summary( countryN,countryName) {
  $.ajax({
    url: "libs/php/wikiSummary.php",
    type: "GET",
    data: {
     countryN: countryN,
    },
    success: function (json) {
      let data = JSON.parse(json);
    let n = "";
     for (const x in  data.query.pages) {
      n += x ;
     }
     let summary = data.query.pages[n].extract;
     $("#wiki_i").html(summary);
     $("#name").html(countryName);
    },
  });
}

function currency_exchange(currency) {
  $.ajax({
    url: "libs/php/currencyEx.php",
    type: "GET",
    success: function (json) {
      let data = JSON.parse(json);
      let rates = data.rates;
      let keys = Object.entries(rates);
    for (let i = 0; i < keys.length; i++) {
     if (keys[i][0] == currency) {
       let val = keys[i][1]
       $("#cur").html(keys[i][0] );
       $("#rate").html(Intl.NumberFormat('de-DE', { style: 'currency', currency: keys[i][0] }).format(val) );
       $("#rate_dol").html(Intl.NumberFormat('de-DE', { style: 'currency', currency: keys[149][0] }).format(keys[149][1]) );
     }
    }
    },
  });
}

