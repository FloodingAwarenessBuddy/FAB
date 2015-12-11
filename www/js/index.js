$( document ).ready(function() {
	if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
		document.addEventListener("deviceready", init, false);
	} else {
		init();
	}
});

var previousWaterLevel = 0;

var loading = $('<div />', {
	"class": 'mdl-progress mdl-js-progress mdl-progress__indeterminate',
	"id": 'pageLoadingBar',
	"style": 'width: 100%;'
});

function init () {
	getFabStatus();
	console.log(navigator.notification);
	console.log("1");
};

function getFabStatus() {
	var fabId = 1;
	var url = "http://project.cmi.hr.nl/2015_2016/mtnll_mt2b_t1/api/sensor.php?sensor=" + fabId + "&callback=?";
	$.ajax({
		url: url,
		async: false,
		jsonpCallback: 'jsonCallback',
		jsonp: 'jsoncallback',
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
		var src = "img/sensorStatus/unknown.png";
		var sensorWarning = $('<img />', {
			"src": src,
			"id": 'sensorStatusIcon'
		})
		var sensorWarningDescription = $('<span/>', {
			"text": 'Er is geen werkende internetverbinding beschikbaar.',
			"id": 'sensorStatusDescription'
		})
	}
	else if (data.waterlevel > 2) {
		var src = "img/sensorStatus/unknown.png";
		var sensorWarning = $('<img />', {
			"src": src,
			"id": 'sensorStatusIcon'
		})
		var sensorWarningDescription = $('<span/>', {
			"text": 'Waterhoogte ophalen mislukt.',
			"id": 'sensorStatusDescription'
		})
	}
	else if (data.error == 0 && data.waterlevel < 3) {
		var src = "img/sensorStatus/" + data.waterlevel + ".png";
		var sensorWarning = $('<img />', {
			"src": src,
			"id": 'sensorStatusIcon'
		})
		var text = "";
		if (data.waterlevel==0) {
			text = "Geen gevaar";
			previousWaterLevel = data.waterlevel;
		}
		else if (data.waterlevel == 1) {
			text = "Gevaar";
			displayNotification(text, "Het water komt hoger", data.waterlevel);
		}
		else if (data.waterlevel == 2) {
			text = "Enorm gevaar";
			displayNotification(text, "Het water staat hoog", data.waterlevel);
		}
		var sensorWarningDescription = $('<span/>', {
			"text": text,
			"id": 'sensorStatusDescription'
		})
	}
	else {
		var src = "img/sensorStatus/unknown.png";
		var sensorWarning = $('<img />', {
			"src": src,
			"id": 'sensorStatusIcon'
		})
		var sensorWarningDescription = $('<span/>', {
			"text": 'Sensor niet gevonden.',
			"id": 'sensorStatusDescription'
		})
	}
	$("#sensorWarning").empty();
	$("#sensorWarning").append(sensorWarning);
	$("#sensorWarning").append(sensorWarningDescription);
	stopLoadingAnimation();
	setTimeout(function(){
		getFabStatus();
	},10000);
}

function stopLoadingAnimation()
{
	$( "#pageLoadingBar" ).hide();
}

function startLoadingAnimation()
{
	$( "#pageLoadingBar" ).show();
}

function displayNotification(title, text, waterlevel) {
	if (previousWaterLevel != waterlevel) {
		if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
			navigator.notification.alert(
				text,  // message
				alertDismissed,         // callback
				title,            // title
				'OK'                  // buttonName
			);
			navigator.vibrate([100, 200, 100, 200, 100, 200, 500, 200, 500, 200, 500, 100, 200, 100, 200, 100, 200]);
		} else {
			alert(title.toUpperCase() + ": " + text);
		}
	}
	previousWaterLevel = waterlevel;
}

function alertDismissed() {

}