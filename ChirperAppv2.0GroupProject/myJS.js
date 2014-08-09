/*Chirper App Object*/
ChirpApp = {};
/*Array of Chirps*/
ChirpApp.chirps = [];
/*Array to push friends into*/
ChirpApp.friends = [];
/*Arrays of friends Chirps*/
ChirpApp.friendsChirps = [];
ChirpApp.currentFriends = [];
/*Arrays of Private Messages*/
ChirpApp.pMessages = [];
ChirpApp.pMessagesToMe = [];
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
ChirpApp.Chirps = function (message) {
	this.message = message;
	this.timestamp = Date.now();
	this.name = "James";
}
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
ChirpApp.Friends = function (name, firebaseURL, current) {
	this.name = name;
	this.firebaseURL = firebaseURL;
	this.current = current;
};
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*My Profile*/

ChirpApp.Profile = {
	bio: "Ninja Duck is a masked super hero Duck, who fights evil and trains with other ninjas such as ninja fish, ninja dog, and ninja dolpin. Each ninja has their special traits.",
	image: "http://th01.deviantart.net/fs71/PRE/f/2013/278/0/b/cold_shadow_tribute__maui_mallard_by_thitaniumprince-d6p7quo.png"
};
//<img src: "http://th01.deviantart.net/fs71/PRE/f/2013/278/0/b/cold_shadow_tribute__maui_mallard_by_thitaniumprince-d6p7quo.png " width="250" height="350" />
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var f = ChirpApp.Friends;
//var James = new f('James', "https://chirrperapp.firebaseio.com", true);
var James = new f('James', "https://chirperappv2.firebaseio.com", true);
var Christopher = new f("Christopher", "https://chris-chirper.firebaseio.com ", false);
var Craig = new f("Craig", " ", false);
var Dean = new f("Dean", "https://dean-chirper.firebaseio.com", true);
var Joshua = new f("Joshua", "https://joshchirpr.firebaseio.com", true);
var Paul = new f("Paul", "https://thesoundofonechirp.firebaseio.com", true);
var Son = new f("Son", "https://9er.firebaseio.com", true);
var Taaha = new f("Taaha", "https://htcchirper.firebaseio.com", true);
ChirpApp.friends.push(James, Christopher, Craig, Dean, Joshua, Paul, Son, Taaha);
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
ChirpApp.findCurrentFriends = function () {
	ChirpApp.currentFriends = [];
	for (var i in ChirpApp.friends) {
		if (ChirpApp.friends[i].current === true) {
			ChirpApp.currentFriends.push(ChirpApp.friends[i]);
		}
	}
};
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Make URL~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
ChirpApp.makeURL = function (baseURL, arr) {
	if (!baseURL) {
		//alert("You Are Not Friends");
	}
	if (!arr) {
		arr = [];
	}
	return baseURL + "/" + arr.join("/") + "/.json";
};
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~C.R.U.D.~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
ChirpApp.addMessage = function () {
	var chirp = document.getElementById('inputMessage').value;
	if (chirp.length <= 200) {
		var message = new ChirpApp.Chirps(chirp);

		var URL = ChirpApp.makeURL("https://chirperappv2.firebaseio.com", ["chirps"]);
		ChirpApp.sendChirpToFirebase(message, URL);
	} else {
		alert("200 Characters or Less Please")
	}
};
/*Made A Temp Modal For This*/
ChirpApp.newChirp = function () {
	document.getElementById('modal-table').innerHTML = "";
	document.getElementById('modal-title').innerHTML = "Post New Message";
	var holder = "<textarea class='form-control' id='inputMessage' rows='4'></textarea>";
	document.getElementById('modal-body').innerHTML = holder;
	var h = "<button id='sendButton' type='button' class='btn btn-info' onclick='ChirpApp.addMessage();'>Post Msg</button>";
	document.getElementById('modal-buttons').innerHTML = h;
	$("#modal-feed").modal();
};
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
ChirpApp.drawTable = function () {
	var h = "";
	h += "<table class='table-condensed' id='messageTable'>"
	h += "<tr><th class='chirp-td chirps-heading'> Message </th><th class='timestamp-td chirps-heading'>Time	</th></tr>";
	for (var i in ChirpApp.chirps) {
		var c = ChirpApp.chirps[i];
		h += "<tr><td class='chirp-td'>" + c.message + "</td>";
		h += "<td class='timestamp-td'>" + (new Date(c.timestamp)).toLocaleString() + "</td></tr>";
	}
	h += "</table>";
	document.getElementById("messageTable").innerHTML = h;
};
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
ChirpApp.Ajax = function (verb, url, success, failure, data) {
	var xhr = new XMLHttpRequest();
	xhr.open(verb, url);
	xhr.onload = function () {
		if (this.status >= 200 && this.status < 400) {
			console.log("Success");
			var response = JSON.parse(this.response);
			if (typeof success === "function") { success(response); }
		}
		else {
			console.log("Failure");
			if (typeof failure === "function") { failure(this.status + ":" + this.response) }
		}
	};
	xhr.onerror = function () {
		console.log("Communication Error");
		if (typeof failure === "function") { failure("Communication Error") }
	};
	xhr.send(JSON.stringify(data));
};
ChirpApp.sendChirpToFirebase = function (post, url) {
	var success = function (data) {
		/*Get FirebaseID*/
		ChirpApp.firebaseId = data.name;
		/*Push Chirps Into Array*/
		ChirpApp.chirps.unshift(post);
		ChirpApp.drawTable();
		document.getElementById("inputMessage").value = "";
		$('#modal-feed').modal('hide');
	};
	var failure = function () {
		alert("Failure Happend Please Try Again")
	};
	ChirpApp.Ajax("POST", url, success, failure, post);
};
ChirpApp.getAllFromFirebase = function (url, callback) {
	var success = function (rdata) {
		ChirpApp.chirps = [];
		for (var i in rdata) {
			rdata[i].firebaseId = i;
			ChirpApp.chirps.push(rdata[i]);
		}
		ChirpApp.chirps.sort(function (a, b) {
			if (a.timestamp < b.timestamp)
				return -1;
			if (a.timestamp > b.timestamp)
				return 1;
			return 0;
		});
		ChirpApp.drawTable();
		//setTimeout(function () { callback(ChirpApp.makeURL('https://chirperappv2.firebaseio.com', ['chirps']), ChirpApp.getAllFromFirebase) }, 10000);
		//console.log("OMG IT HURTS");

	};
	ChirpApp.Ajax("GET", url, success, alert, null);
};
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
ChirpApp.viewMyProfile = function () {
	var h = "<img id='profilePic' stlye='border-radius:10px' src='" + ChirpApp.Profile.image + "' width='175' height='250'>";
	h += "<h4>" + ChirpApp.Profile.bio + "</h4>";
	h += "<button type='button' class='btn btn-default btn-block text-info' id='message-button' onclick='ChirpApp.editMyProfile()'>Edit Bio</button>";
	document.getElementById("profileTable").innerHTML = h;
};
ChirpApp.editMyProfile = function () {
	document.getElementById('modal-table').innerHTML = '';
	var h = "<div class='input-group profile-edit'>";
	h += "Bio <br/>"
	h += "<input type='text' placeholder='Bio' id='bio-input' class='profile-input form-control'>";
	h += "<div><br/>";
	h += "Pic Link <br/>"
	h += "<input type='text' placeholder='image Link' id='pic-input' class='profile-input form-control'><br/>";
	h += "<img id='profilePict' style='border-radius: 10px;' src='" + ChirpApp.Profile.image + "'/></div><br/>";
	document.getElementById('modal-title').innerHTML = "Edit Profile";
	document.getElementById('modal-body').innerHTML = h;
	document.getElementById('bio-input').value = ChirpApp.Profile.bio;
	document.getElementById('pic-input').value = ChirpApp.Profile.image;
	var holder = "<button type='button' class='btn btn-default' data-dismiss='modal'>Cancel</button>";
	holder += "<button type='button' class='btn btn-primary' onclick='ChirpApp.editProfileFirebase()'>Save Changes</button>";
	document.getElementById('modal-buttons').innerHTML = holder;
	$('#modal-feed').modal();
};
ChirpApp.getMyProfile = function () {
	var url = ChirpApp.makeURL('https://chirperappv2.firebaseio.com', ['profile']);
	var success = function (rdata) {
		for (var j in rdata) {
			ChirpApp.Profile = rdata;
		}
		ChirpApp.viewMyProfile();
	};
	var failure = function () {
		alert('Error, Please Try Again')
	};
	ChirpApp.Ajax("GET", url, success, failure, null);
	ChirpApp.getAllFromFirebase(ChirpApp.makeURL('https://chirperappv2.firebaseio.com', ['chirps']), ChirpApp.getAllFromFirebase);
};
ChirpApp.editProfileFirebase = function () {
	ChirpApp.Profile.bio = document.getElementById('bio-input').value;
	ChirpApp.Profile.image = document.getElementById('pic-input').value;
	var url = ChirpApp.makeURL('https://chirperappv2.firebaseio.com', ['profile']);
	var success = function () {
		ChirpApp.firebaseId = ChirpApp.Profile.name;
		ChirpApp.viewMyProfile();
	};
	var failure = console.log("Did Not Update, Please Try Again");
	var data = ChirpApp.Profile;
	ChirpApp.Ajax("PATCH", url, success, failure, data);
	$("#modal-feed").modal("hide");
};
ChirpApp.getProfileFromFirebase = function () {
	var url = ChirpApp.makeURL('https://chirperappv2.firebaseio.com', ['Profile']);
	var success = function () {
		ChirpApp.viewMyProfile();
	};
	var failure = console.log("Error on getProfile");
	ChirpApp.Ajax("GET", url, success, failure, null);
};
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
ChirpApp.drawFriendsTable = function () {
	h = "<table class='table-condensed' id='friendsTable'>";
	for (var i in ChirpApp.friends) {
		if (ChirpApp.friends[i].name !== "James") {
			h += "<tr style='font-size:18px'><td class='text-info'>" + ChirpApp.friends[i].name + "</td>";
			if (ChirpApp.friends[i].current === true) {
				h += "<td><i class='fa fa-2x glyphicon glyphicon-user profile-button text-primary' onclick='ChirpApp.getFriendsProfile(" + i + ")'></i>";
				h += "<i class='fa fa-2x fa-minus add-button text-danger' onclick='ChirpApp.toggleFriend(" + i + ")'></i></td></tr>";
			}
			else { h += "<td><i class='fa fa-2x fa-plus delete-button text-success' onclick='ChirpApp.toggleFriend(" + i + ")'></i>"; }
		}
	}
	h += "</table>";
	document.getElementById("friendsTable").innerHTML = h;
};
ChirpApp.drawFriendsTable();
var friendNumber = 0;
ChirpApp.viewFriendsProfile = function (i) {
	if (ChirpApp.friendsProfile.length === 0) {
		var h = "<h3>" + ChirpApp.friends[friendNumber].name + "</h3>";
		h += "<h4>Bio N/A</h4>";
	}
	else {
		if (!ChirpApp.friendsProfile[0].image) {
			var h = "<h3>" + ChirpApp.friends[friendNumber] + "</h3>";
		}
		else {
			var h = "<img id='profilePic' width='175' height='250' src='" + ChirpApp.friendsProfile[0].image + "'/>";
		}
		if (!ChirpApp.friendsProfile[0].bio) {
			h += "<h4>Bio N/A</h4>";
		}
		else {
			h += "<h4>" + ChirpApp.friendsProfile[0].bio + "</h4>";
		}
	}
	h += "<button type='button' class='btn btn-default text-info'id='message-button' onclick='ChirpApp.seePM(" + friendNumber + ")'>Message</button>";
	document.getElementById("profileTable").innerHTML = h;
};
ChirpApp.getFriendsProfile = function (i) {
	var url = ChirpApp.makeURL(ChirpApp.friends[i].firebaseURL, ['profile']);
	var success = function (rdata) {
		ChirpApp.friendsProfile = [];
		for (var j in rdata) {
			rdata[j].firebaseId = j;
			ChirpApp.friendsProfile.push(rdata[j]);
		}
		friendNumber = i;
		ChirpApp.viewFriendsProfile();
	};
	var failure = function () {
		alert("Error.  Please try again.");
	};

	ChirpApp.Ajax("GET", url, success, failure, null);
	ChirpApp.getAllFromFirebase(ChirpApp.makeURL(ChirpApp.friends[i].firebaseURL, ["chirps"]));
};
ChirpApp.toggleFriend = function (i) {
	if (ChirpApp.friends[i].current === true) {
		ChirpApp.friends[i].current = false;
	}
	else if (ChirpApp.friends[i].current === false) {
		ChirpApp.friends[i].current = true;
	}
	ChirpApp.drawFriendsTable();
};
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*On Page Load*/
ChirpApp.getMyProfile();
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
ChirpApp.createFeed = function () {
	ChirpApp.findCurrentFriends();
	ChirpApp.friendsChirps = [];
	counter = 0;
	for (var i in ChirpApp.currentFriends) {
		var url = ChirpApp.makeURL(ChirpApp.currentFriends[i].firebaseURL, ['chirps']);
		var success = function (data) {
			for (var j in data) {
				ChirpApp.friendsChirps.push(data[j]);
			};
			ChirpApp.friendsChirps.sort(function (b, a) {
				if (a.timestamp < b.timestamp)
					return -1;
				if (a.timestamp > b.timestamp)
					return 1;
				return 0;
			});
			if (ChirpApp.currentFriends.length == counter) {
				ChirpApp.seeFeed();
			}
		};
		var failure = console.log("Error on " + ChirpApp.friends[i].name);
		ChirpApp.Ajax("GET", url, success, null);
		counter++;
	}
};
ChirpApp.seeFeed = function () {
	document.getElementById('modal-title').innerHTML = "Feed";
	document.getElementById('modal-table').innerHTML = "";
	var h = "<table class='table-condensed'>";
	for (var i in ChirpApp.friendsChirps) {
		h += "<tr><td class='chirper-td'>" + ChirpApp.friendsChirps[i].name + "</td>";
		h += "<td class='chirps-td'>" + ChirpApp.friendsChirps[i].message + "</td>";
		h += "<td class='time-td'>" + (new Date(ChirpApp.friendsChirps[i].timestamp)).toLocaleString() + "</td></tr>";
	}
	h += "</table>";
	document.getElementById('modal-body').innerHTML = h;
	$('#modal-feed').modal();
};
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
ChirpApp.addPM = function () { };
ChirpApp.seePMs = function () { };
ChirpApp.sendPMToFirebase = function () { };
ChirpApp.getPMsFromFriends = function () { };
ChirpApp.getfriendsPMsFromFirebase = function () { };
ChirpApp.drawPMTable = function () { };
ChirpApp.drawMessageTable = function () { };
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/