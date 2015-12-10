$(document).ready(function() {
	init();
});

var loading = $('<div />', {
	"class": 'mdl-progress mdl-js-progress mdl-progress__indeterminate',
	"id": 'pageLoadingBar',
	"style": 'width: 100%;'
});

function init () {
	getFabStatus();
};

function getFabStatus() {
	var fabId = 1;
	var url = "http://project.cmi.hr.nl/2015_2016/mtnll_mt2b_t1/api/sensor.php?sensor=" + fabId + "&callback=?";
	$.ajax({
		type: 'GET',
		url: url,
		async: false,
		jsonpCallback: 'jsonCallback',
		contentType: "application/json",
		dataType: 'jsonp',
		success: function(json) {
			showSensorWarning(json);
		},
		error: function(e) {
			showSensorWarning("");
		}
	});
}

function showSensorWarning(data)
{
	console.log(data);
	if (data == "") {
		var src = "img/sensorStatus/unknown.svg";
		var sensorWarning = $('<img />', {
			"src": src,
			"id": 'sensorStatusIcon'
		})
		var sensorWarningDescription = $('<span/>', {
			"text": 'Er is geen internetverbinding beschikbaar.',
			"id": 'sensorStatusDescription'
		})
	}

	else if (data.error == 0) {
		// var sensorWarning = $('<div />', {
		// 	"style": 'width: 100%;',
		// 	"text": 'Sensor ' + data.id + " geeft een waterhoogte aan van " + data.waterlevel + "."
		// })
		var src = "img/sensorStatus/" + data.waterlevel + ".svg";
		var sensorWarning = $('<img />', {
			"src": src,
			"id": 'sensorStatusIcon'
		})
		var sensorWarningDescription = $('<span/>', {
			"text": 'Geen gevaar',
			"id": 'sensorStatusDescription'
		})
	}
	else {
		var src = "img/sensorStatus/unknown.svg";
		var sensorWarning = $('<img />', {
			"src": src,
			"id": 'sensorStatusIcon'
		})
		var sensorWarningDescription = $('<span/>', {
			"text": 'Sensor niet gevonden.',
			"id": 'sensorStatusDescription'
		})
	}
	
	$("#sensorWarning").append(sensorWarning);
	$("#sensorWarning").append(sensorWarningDescription);
	stopLoadingAnimation();
	
}

function stopLoadingAnimation()
{
	$( "#pageLoadingBar" ).hide();
	
}