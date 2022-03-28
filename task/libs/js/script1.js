$('#btnRun').click(function() {

    $.ajax({
        url: "libs/php/getOceanInfo.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: $('#selLat').val(),
            lng: $('#selLng').val()
        },
        success: function(result) {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {

                $('#txtDistance').html(result['data']['distance']);
                $('#txtGeonameId').html(result['data']['geonameId']);
                $('#txtName').html(result['data']['name']);
               

            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
          
        }
    }); 

});


$('#btnRun1').click(function() {

    $.ajax({
        url: "libs/php/getWeatherStation.php",
        type: 'POST',
        dataType: 'json',
        data: {
            north: $('#typeNorth').val(),
            south: $('#typeSouth').val(),
            east: $('#typeEast').val(),
            west: $('#typeWest').val()
        },
        success: function(result) {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {

                $('#txtClouds').html(result['data'][0]['clouds']);
                $('#txtTemperature').html(result['data'][0]['temperature']);
                $('#txtHumidity').html(result['data'][0]['humidity']);
               

            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
          
        }
    }); 

});

$('#btnRun2').click(function() {

    $.ajax({
        url: "libs/php/getCountryInfo.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: $('#selCountry').val(),
            lang: $('#selLanguage').val()
        },
        success: function(result) {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {

                $('#txtContinent').html(result['data'][0]['continent']);
                $('#txtCapital').html(result['data'][0]['capital']);
                $('#txtLanguages').html(result['data'][0]['languages']);
                $('#txtPopulation').html(result['data'][0]['population']);
                $('#txtArea').html(result['data'][0]['areaInSqKm']);

            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            
        }
    }); 

});













