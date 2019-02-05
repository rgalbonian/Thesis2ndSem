function accountability(){
	clearInterval(historyloading);
	accountabilityloading = setInterval(loadJSONdataAccountability, 3000);
	//active menu is accountability and show accountability div
	document.getElementById("accountability").classList.add("active");
	document.getElementById("accountability_div").style.display="block";
	//set other tabs as inactive
	document.getElementById("history").classList.remove("active");
	document.getElementById("request").classList.remove("active");
	document.getElementById("inventory").classList.remove("active");
	
	//hide divs of other tabs
	document.getElementById("request_div").style.display="none";
	document.getElementById("history_div").style.display="none";
	document.getElementById("inventory-div").style.display="none";
}




$( "#searchQueryAccountability").click(function() {
	searchQueryAccountability = $("#searchQueryAccountability").val();
	console.log(searchQueryAccountability);
	loadJSONdataAccountability()
	//loadItems();
});

function filteringAccountability(element) {
	var regex = new RegExp(searchQueryAccountability, 'gi' );
    return (element['itemName'].match(regex) || element['studentName'].match(regex) || element['studentNumber'].match(regex));
}

function loadJSONdataAccountability(){
	searchQueryAccountability = $("#searchQueryAccountability").val();
	console.log("loadinggggggggggggg")

   	var accountabilityfile = "https://firebasestorage.googleapis.com/v0/b/liarsproject.appspot.com/o/liarsproject-accountability-export.json?alt=media&token=9490ef1c-6676-4cbd-85e2-c569c9aa32dc";
	
readTextFile(accountabilityfile, function(text){
    var data = JSON.parse(text);
   
   var accountability = "";
	accountability += "<table id='accountTable'><tr> <th>Student Name</th><th>Student Number</th><th>Item Name</th><th>Quantity</th><th>Request ID</th></tr>"
	

   	var data = data.filter(filteringAccountability);
	console.log(data);
    
	if (data.length == 0){
		itemsCard = "No records."
	}
    for (property in data) {
	  accountability += "<tr> <td>" + `${data[property]['studentName']}` + " </td> <td>"+`${data[property]['studentNumber']}`+ "</td><td>" +`${data[property]['itemName']}`+ "</td><td>" +`${data[property]['quantity']}`+ "</td><td>"+`${data[property]['requestID']}` +"</td> </tr>";
	}
    

		var container = document.getElementById("accountTablediv");
	container.innerHTML = accountability;
});
}




/*
$( document ).ready(function() {
	console.log("hehehe");

	var accountability = "";
	accountability += "<table id='accountTable'><tr> <th>Student Name</th><th>Student Number</th><th>Item Name</th><th>Quantity</th><th>Request ID</th></tr>"
	var chemistryDataRef = firebase.database().ref("6/accountability");
	chemistryDataRef.once("value").then(function(snapshot) {
	snapshot.forEach(function(childSnapshot) {
	  var key = childSnapshot.key;
	  var childData = childSnapshot.val();      
	  var studentname = childSnapshot.val().studentName;
	  
	  var studentnumber = childSnapshot.val().studentNumber;
	  var itemName = childSnapshot.val().itemName;
	  var quantity = childSnapshot.val().quantity;
	  var requestID = childSnapshot.val().requestID;
	  accountability += "<tr> <td>" + studentname + " </td> <td>"+studentnumber+ "</td><td>" +itemName+ "</td><td>" +quantity+ "</td><td>"+requestID +"</td> </tr>";
	  });

	
	var container = document.getElementById("accountTablediv");
	container.innerHTML = accountability;
	console.log("vge");
	});
});
*/
