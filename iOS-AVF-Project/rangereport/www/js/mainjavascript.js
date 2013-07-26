
function onDeviceReady() {

	// Global Variables
	var staticJSON = json;

	// Clear Fields Function
	var resetFields = function() {
		$("#images img").remove();
		$(".input").css("color", "#CFCFCF");
		$('#reportForm')[0].reset();
	};

	// Store Data Function
	var storeData = function(key) {
		var month		 = new Date().getMonth() + 1;
		var day 		 = new Date().getDate();
		var year 		 = new Date().getFullYear();
		var currentDate  = month + "/" + day + "/" + year;
		var	item		 = {};
		item.reportImage = [""				   ,'<img class="displayImage" src="' + $(".cameraImage").attr("src") + '"></img>'];
		item.date		 = ["Date:            ", currentDate];
		item.mft	 	 = ["Manufacturer:    ", $("#manufacturer").val()];
		item.mod	 	 = ["Model:           ", $("#model").val()];
		item.dist		 = ["Distance(Yards): ", $("#distance").val()];
		item.temp		 = ["Temperature(F):  ", $("#temperature").val()];
		item.humid		 = ["Humidity:        ", $("#humidity").val()];
		item.wind		 = ["Wind Speed(mph): ", $("#windSpeed").val()];
		item.note		 = ["Notes:           ", $("#notes").val()];
		if (!key) {
			var NEWid				= Math.floor(Math.random() * 1000001);
			window.localStorage.setItem(NEWid, JSON.stringify(item));
			alert("Report Saved!");
		} else {
			var OLDid = key;
			window.localStorage.setItem(OLDid, JSON.stringify(item));
			alert("Report Saved!");
		}
	};

	// Edit Item Function
	var editItem = function(eButton) {
		console.log(eButton);
		var newKey 		= eButton;
		var editValue	= window.localStorage.getItem(newKey);
		var eItem 		= JSON.parse(editValue);
		$("#weather").prop("disabled", "disabled");
		$("#manufacturer").val(eItem.mft[1]);
		$("#model").val(eItem.mod[1]);
		$("#distance").val(eItem.dist[1]);
		$("#temperature").val(eItem.temp[1]);
		$("#humidity").val(eItem.humid[1]);
		$("#windSpeed").val(eItem.wind[1]);
		$("#notes").val(eItem.note[1]);
		$("#submit").click(function() {
			storeData(newKey);
		});
	};

	// Auto Fill Data Function
	var autoFillData = function() {
		for (var n in staticJSON) {
			var staticID = Math.floor(Math.random() * 1000001);
			console.log(staticID);
			window.localStorage.setItem(staticID, JSON.stringify(staticJSON[n]));
		}; 
	};

	// Display Function
	var displayData = function() {
		$("#display").append('<ul id="displayReports" data-role="listview"></ul>');
		$("#displayDetailedReports").remove();
		if (window.localStorage.length === 0) {
			alert("There are no reports to display. Loading Static Data.");
			autoFillData();
		}
		for (var i = 0, j = window.localStorage.length; i < j; i++) {
			var key = window.localStorage.key(i);
			var value = window.localStorage.getItem(key);
			var obj = JSON.parse(value);
			var liID = 1111 + (i);
			var ulID = key;
			$("#displayReports").append('<li><a href="#displayDetailsPage" id="' + ulID + '" class="linkToData">' + obj.mft[1] + ' - ' + obj.mod[1] + ' - ' + obj.date[1] + '</a></li>');
		};
	};

	// Display Details Function
	var displayDetailedData = function(dataKey) {
		for (var i = 0, j = window.localStorage.length; i < j; i++) {
			var detailedkey = window.localStorage.key(i);
			var detailedvalue = window.localStorage.getItem(detailedkey);
			var detailedobj = JSON.parse(detailedvalue);
			var liID = 1 + (i);
			if(dataKey == detailedkey) {
				var buttonKey = dataKey;
				$("#displayDetails")
					.append(detailedobj.reportImage[1])
					.append('<ul id="displayDetailedReports" data-role="listview"></ul>');
				var content = "";
				for (var n in detailedobj) {
					content += '<li id="' + liID + '">';
					content += detailedobj[n][0] + " " + detailedobj[n][1];
					content += '</li>';
				};
				$("#displayDetailedReports").append(content);
				$("#displayDetailedReports").append(
				"<a href='#displayPage' data-role='button' class='clickable' >Back</a>" + 
				"<a href='#createReport' data-role='button' data-key='" + buttonKey + "' class='clickable edit' >Edit Report</a>" + 
				"<a href='#homePage' data-role='button' data-key='" + buttonKey + "' class='clickable delete' >Delete Report</a>" +
				"<a href='#' data-role='button' data-key='" + buttonKey + "' class='clickable upload' >Upload Report</a>");
				$("#1").remove();
			}
		$("#displayDetailedReports").listview('refresh');
		};
	};

	// Delete Item Function
	var deleteItem = function(dButton) {
		var ask = confirm("Delete Report?");
		if (ask) {
			window.localStorage.removeItem(dButton);
			alert("Report Deleted");
		} else {
			alert("Report Not Deleted");
		}
	};

	// Clear Local Storage Function
	var clearLocal = function() {
		if (window.localStorage.length === 0) {
			alert("There are no reports to delete.");
		} else {
			var ask = confirm("Delete all Reports?");
			if (ask) {
				window.localStorage.clear();
				alert("All Reports Deleted.");
				return false;
			} else {
				alert("Reports Not Deleted.");
			}
		}
	};

	$("#homePage").on("pageinit", function() {
		$("#logInSubmit").click(function() {
			var networkState = navigator.network.connection.type;
			if(networkState != "wifi") {
				alert("Please Connect to a Wireless Network to Connect to Instagram.");
			} else {
				$.ajax({ 
					url : "https://api.instagram.com/v1/users/1574083/?access_token=471459235.f59def8.b8f40a3e3a014180b4ca0b38970de94d", 
					dataType : "jsonp", 
					success : function(instagram_json) { 
						var instagram = JSON.parse(instagram_json);
						console.log(instagram_json);
						//http://www.rangereport.com/index#access_token=471459235.f59def8.b8f40a3e3a014180b4ca0b38970de94d
					} 
				}); 
			}
		});
		$("#dispRPT").on('click', function() {
			$("#displayReports").remove();
			displayData();
		});
		$(".reportPage").click(function() {
			resetFields();
		});
	});

	$("#createReport").on("pageinit", function() {
		$("#imagePhotos").on("click", function() {
			var onPhotoSuccess = function(photoImageURI) {
				$("#images").append('<img class="cameraImage" src="' + photoImageURI + '"></img>');
			};
			var onPhotoFail = function(message) {
				console.log(message);
			};
			navigator.camera.getPicture(onPhotoSuccess, onPhotoFail, { quality: 50, destinationType: Camera.DestinationType.FILE_URI, sourceType: Camera.PictureSourceType.PHOTOLIBRARY });
		});
		$("#imageCamera").click(function() {
			alert("Button Works!!");
			var onCamSuccess = function(imageURI) {
			    $("#images").append('<img class="cameraImage" src="' + imageURI + '"></img>');
			};
			var onCamFail = function(message) {
				console.log(message);
			};
			navigator.camera.getPicture(onCamSuccess, onCamFail, { quality: 50, destinationType: Camera.DestinationType.FILE_URI });
		});
		$("#weather").change(function() {
			var networkState = navigator.network.connection.type;
			if(networkState == "none") {
				alert("Please Connect to a Network to Auto Fill Weather Data.");
			} else {
				var onSuccess = function(position) {
				$.ajax({ 
					url : "http://api.wunderground.com/api/521e1e1e0e1cd815/geolookup/q/" + position.coords.latitude + "," + position.coords.longitude + ".json", 
					dataType : "jsonp", 
					success : function(parsed_jsonLoc) { 
						$.ajax({ 
							url : "http://api.wunderground.com/api/521e1e1e0e1cd815/geolookup/conditions/q/" + parsed_jsonLoc.location.state + "/" + parsed_jsonLoc.location.city + ".json", 
							dataType : "jsonp", 
							success : function(parsed_json) { 
								console.log(parsed_json);
								var location 	= parsed_json.location.city; 
								var tempF 		= parsed_json.current_observation.temp_f; 
								var HUMIDITY 	= parsed_json.current_observation.relative_humidity;
								var WINDSPEED	= parsed_json.current_observation.wind_mph;
								$("#temperature").css("color", "#000000");
								$("#temperature").val(tempF);
								$("#humidity").css("color", "#000000");
								$("#humidity").val(HUMIDITY);
								$("#windSpeed").css("color", "#000000");
								$("#windSpeed").val(WINDSPEED);
							} 
						}); 
					} 
				}); 
			};
			var onError = function(error) {
				console.log(error.message);
			};
			navigator.geolocation.getCurrentPosition(onSuccess, onError);
			}
		}); 
		$("#submit").click(function() {
			storeData();
		});
		$(".reportPage").click(function() {
			resetFields();
		});
		$(".input").focus(function() {
			$(this).css("color", "#000000");
			$(this).val("");
		});
	});

	$("#displayPage").on("pageinit", function() {
		$("#clearLoc").click(function() {
			clearLocal();
		});
		$(".linkToData").click(function() {
			displayDetailedData($(this).attr("id"));
		});

		$(".reportPage").click(function() {
			resetFields();
		});
	});

	$("#displayDetailsPage").on("pageinit", function() {
		$("#clearLoc").click(function() {
			clearLocal();
		});
		$(".linkToData").click(function() {
			displayDetailedData($(this).attr("id"));
		});
		$(".edit").click(function() {
			var editButton = $(this).data("key");
			editItem(editButton);
		});
		$(".delete").click(function() {
			var deleteButton = $(this).data("key");
			deleteItem(deleteButton);
		});
		$(".upload").click(function() {

		});
		$(".reportPage").click(function() {
			resetFields();
		});
	});

	$("#aboutPage").on("pageinit", function() {
		$(".reportPage").click(function() {
			resetFields();
		});
	});
};
$(document).on("deviceready", onDeviceReady() ,false);