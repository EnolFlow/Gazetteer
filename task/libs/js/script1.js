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

                $('#txtClouds').html(result['data']['clouds']);
                $('#txtTemperature').html(result['data']['temperature']);
                $('#txtHumidity').html(result['data']['humidity']);
               

            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
          
        }
    }); 

});

$('#btnRun2').click(function() {

    $.ajax({
        url: "libs/php/getNearAddress.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: $('#lati').val(),
            lng: $('#longi').val()
        },
        success: function(result) {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {

                $('#txtLocality').html(result['data']['locality']);
                $('#txtStreet').html(result['data']['street']);
                $('#txtHouseNumber').html(result['data']['houseNumber']);
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            
        }
    }); 

});













