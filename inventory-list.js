n =  new Date();
y = n.getFullYear();
m = n.getMonth() + 1;
d = n.getDate();
document.getElementById("date").innerHTML = m + "/" + d + "/" + y;

$( document ).ready(function() {
	console.log("hehehe");

	var inventory = "";
	inventory += "<table id='inventorytable'><tr> <th>Item</th><th>Quantity/Amount</th><th>Unit</th><th>Category</th></tr>"
	var chemistryDataRef = firebase.database().ref("2/chemistry");
	chemistryDataRef.child("chemicals").child("metals").once("value").then(function(snapshot) {
	snapshot.forEach(function(childSnapshot) {
	  var key = childSnapshot.key;
	  var childData = childSnapshot.val();      
	  var name_val = childSnapshot.val().name;
	  console.log(name_val);
	  var cat_val = childSnapshot.val().category;
	  var amount_val = childSnapshot.val().amount;
	  var unit_val = childSnapshot.val().unit;
	  inventory += "<tr> <td>" + name_val + " </td> <td>"+ amount_val+ "</td><td>" +unit_val+ "</td><td>"+cat_val +"</td> </tr>";
	  });

	
	var container = document.getElementById("inventorydiv");
	container.innerHTML = inventory;
	console.log("vge");
	});
});

