$("#homePage").on("pageinit", function() {
	$("#logInSubmit").click(function() {

	});
	$("#dispRPT").on('click', function() {
		$("#displayReports").children().remove();
		displayDetailData();
	});
	$(".reportPage").click(function() {
		resetFields();
	});
});

$("#createReport").on("pageinit", function() {
	$("#imagePhotos").click(function() {

	});
	$("#imageCamera").click(function() {

	});
	$("#weather").on("change", function() {

	});
	$("#submit").click(function() {

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

// Clear Fields Function
var resetFields = function() {
	$(".input").css("color", "#CFCFCF");
	$('#reportForm')[0].reset();
};

// Store Data Function
var storeData = function(key) {
	if (!key) {
		var id				= Math.floor(Math.random() * 1000001);
	} else {
		var id = key;
	}
	var currentDate = new Date();
	var month		= currentDate.getMonth() + 1;
	var day 		= currentDate.getDate();
	var year 		= currentDate.getFullYear();
	var currentDate = month + "/" + day + "/" + year;
	var	item		= {};
	item.date		= ["Date:            ", currentDate];
	item.mft		= ["Manufacturer:    ", $("#manufacturer").val()];
	item.mod		= ["Model:           ", $("#model").val()];
	item.dist		= ["Distance(Yards): ", $("#distance").val()];
	item.temp		= ["Temperature(F):  ", $("#temperature").val()];
	item.humid		= ["Humidity:        ", $("#humidity").val()];
	item.wind		= ["Wind Speed(mph): ", $("#windSpeed").val()];
	item.note		= ["Notes:           ", $("#notes").val()];
	window.localStorage.setItem(id, JSON.stringify(item));
	alert("Report Saved!")
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

// Display Details Function
var displayDetailData = function() {
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
		console.log(key);
		console.log(liID);
		$("#displayReports").append('<li id="' + liID + '">' + obj.mft[1] + ' - ' + obj.mod[1] + ' - ' + obj.date[1] + '</li>');
		$("#" + liID + "").append("<ul id=" + ulID + "></ul>");
		var content = "";
		for (var n in obj) {
			content += "<li>";
			content += obj[n][0] + " " + obj[n][1];
			content += "</li>";
		};
		$("#" + ulID + "").append(content);
		$("#" + ulID + "").append(
			"<a href='#createReport' data-role='button' data-key='" + ulID + "' class='clickable edit' >Edit Report</a>" 
			+ 
			"<a href='#homePage' data-role='button' data-key='" + ulID + "' class='clickable delete' >Delete Report</a>"
			+ 
			"<a href='#' data-role='button' data-key='" + ulID + "' class='clickable upload' >Upload Report</a>"
		);
	};
	$("displayPage").on('pageinit', function() {
		$("#displayReports").listview('refresh');
	})
};

// Auto Fill Data Function
var autoFillData = function() {
	for (var n in json) {
		var staticID = Math.floor(Math.random() * 1000001);
		console.log(staticID);
		window.localStorage.setItem(staticID, JSON.stringify(json[n]));
	};
};

// Delete Item Function
var deleteItem = function(dButton) {
	var ask = confirm("Delete Report?");
	if (ask) {
		window.localStorage.removeItem(dButton);
		alert("Report Deleted");
	} else {
		alert("Report Not Deleted")
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


