n =  new Date();
y = n.getFullYear();
m = n.getMonth() + 1;
d = n.getDate();
document.getElementById("date").innerHTML = m + "/" + d + "/" + y;
var inventorylist_category = $("#inventorylist-category").val();
$("#inventorylist-category").change(function(){
	inventorylist_category = $("#inventorylist-category").val();
	loadInventorylist();
});

$( document ).ready(function(){
	loadInventorylist();
	});

function loadInventorylist() {
	document.getElementById("inventorylist-loader").style.display = "block"; 
   	document.getElementById("inventorydiv").style.display = "none";
   	var inventory = "";
	console.log(inventorylist_category)
	var inventoryRef = firebase.database().ref("2/chemistry/chemicals/"+ inventorylist_category);
	inventoryRef.orderByKey().once("value").then(function(snapshot) {
	
	var data = snapshotToArray(snapshot);
	console.log(data)
	if (data.length == 0){
		inventory += "No records found."
	}else{
		if (inventorylist_category == "metal" || inventorylist_category == "nonmetal"){
			
		console.log("here")
		inventory+="asdsad"
			inventory += "<table id='inventorytable'><tr> <th>Item</th><th>Amount</th><th>Unit</th><th>Category</th></tr>"
			
			data.forEach(function(item){
			inventory += "<tr> <td>" + item.name + " </td> <td>"+ item.amount+ "</td><td>" + item.unit+ "</td><td>"+ item.category +"</td> </tr>";
			});
		}else {
			inventory += "<table id='inventorytable'><tr> <th>Item</th><th>Quantity</th><th>Category</th></tr>"
	
			data.forEach(function(item){
			inventory += "<tr> <td>" + item.name + " </td> <td>"+ item.quantity + "</td><td>"+ item.category +"</td> </tr>";
			});
		}
	}

	
	var container = document.getElementById("inventorydiv");
	container.innerHTML = inventory;
	console.log("vge");
	
	document.getElementById("inventorylist-loader").style.display = "none"; 
   	document.getElementById("inventorydiv").style.display = "block";
   	});
}