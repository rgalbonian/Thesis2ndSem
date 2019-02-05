//filter variables
var filterCat = "metals";
var sorting = "az";
var lab = "chemistry"
var order = "name";
var setOrder = "name";
var searchQueryInventory = ""
var namedir = "az"
var quandir = "asc";
function inventory(){
	clearInterval(loadingforever);
	//inventory is active show inventory div
	document.getElementById("inventory-div").style.display="block";
	document.getElementById("inventory").classList.add("active");

	//other tabs inactive
	document.getElementById("history").classList.remove("active");
	document.getElementById("accountability").classList.remove("active");
	document.getElementById("request").classList.remove("active");

	//hide the divs of other tabs
	document.getElementById("request_div").style.display="none";
	document.getElementById("accountability_div").style.display="none";
	document.getElementById("history_div").style.display="none";

    var user = firebase.auth().currentUser;
	var uid = user.uid
	
		
	var usersRef = firebase.database().ref("0/users/" + uid);
	var userId = firebase.auth().currentUser.uid;
	firebase.database().ref('0/users/' + userId).once('value').then(function(snapshot) {
	  	lab = (snapshot.val() && snapshot.val().laboratory) || 'Anonymous';
  		console.log(lab)
  		filterTab()
  		loadJSONdata();
  		//loadItems();
	});
	
}
$( document ).ready(function() {

});
$("#items-div").ready(function(){
	console.log("ready")
})

$(document).on("change", "input[type=radio][name='itemCat']", function(event){
	console.log("wtf");
    console.log(this.value);
    if (this.value == 'apparatus') {
        $(".appa-quan").css("visibility", "visible");
        $(".appa-quan").css("display", "block");
          $(".chem-quan").css("display", "none");
          $(".chem-quan").css("visibility", "hidden");
    }
    else if ((this.value == 'metal') || (this.value == 'nonmetal')  ){
        $(".chem-quan").css("visibility", "visible");
         $(".chem-quan").css("display", "block");
          $(".appa-quan").css("display", "none");
          	$(".appa-quan").css("visibility", "hidden");
    }
});


$( "#searchInventory").click(function() {
	searchQueryInventory = $("#searchQueryInventory").val();
	console.log(searchQueryInventory);
	loadJSONdata()
	//loadItems();
});


$( "#view-in-list").click(function() {
	window.open('inventory-list.html', '_blank')
});


$( "#choose-btn-item-img" ).click(function(){
	alert(work);
		$("#submit-btn-item-img").attr("hidden","false");
});
$( "#add-item-btn").click(function(){
	console.log("what")
	loadAddItem("chemistry");
});

$(document).on("click", "#modal-confirm-summary-btn", function(event){
	console.log("you bebeh");
	$('#item-summary-modal').modal('hide')
	$('#add-item-modal').modal('hide')
	$('#alertModal').modal('show')
	$('input').val('');
});
$(document).on("click", "#modal-edit-summary-btn", function(event){
	console.log("wasss")
	$("#add-item-modal").find("span").html("");
});

$("#add-item-modal").on("hidden.bs.modal", function () {
	console.log("CLOSED")
    $("#error-name").html("");
	$("#error-amount").html("");
    $("#error-unit").html("");
    $("#error-quan").html("");
});
$(document).on("click", "#modal-add-btn", function(event){
	var name, category, quantity, amount, unit, image;
  	var name = $("#item-name").val()
	var image = $('#item-image').get(0).files[0];
    var category = $("input[name='itemCat']:checked").val();

    $("#sum-name").html("Item Name: "+ name);
    $("#sum-cat").html("Category: " + category);
    if (category == "apparatus"){
    	$("#sum-amount").html("");
    	$("#sum-unit").html("");
    	var quantity = $("#item-quantity").val()
    	var check = validateItem(name, category, quantity, amount, unit, image);
    	if (check){
       		$("#sum-quan").html("Quantity: " + quantity + "<br>");
    		console.log(name + quantity + category, image);
    		$('#item-summary-modal').modal('show');
    	}
    }else {
    	$("#sum-quan").html("");
    	var amount = $("#item-amount").val()
      	var unit = $("#item-unit").val()
    	var check = validateItem(name, category, quantity, amount, unit, image);
    	if (check){
      		$("#sum-amount").html("Amount: " + amount +  "<br>");
    		$("#sum-unit").html("Unit: " +unit);
      		console.log(name + amount + unit + category);
      		$('#item-summary-modal').modal('show');
    	}
    	
    }
});


$(document).on("click", "#modal-cancel-btn", function(event){
	console.log("canceled")
	$('#add-item-modal').find('input').val('');
	$('#add-item-modal').find('span').html('');
	var preview = document.querySelector("#img-previewer");
	preview.src = "images/add-item-default.png";
});

function filterTab() {
	console.log("loading filters")
	var filterHTML = ""
	if (lab == "chemistry") {
				console.log("you here?")
			filterHTML += " <input type='radio' name='categories' class='cat' value='metals' checked>Metal </input> <br> <input type='radio' name='categories' class='cat' value='nonmetals'>Non-metal</input> <br> <input type='radio' name='categories' class='cat' value='apparatus'>Apparatus </input> "
			var container = document.getElementById("categories-div");
			container.innerHTML = filterHTML;
	}
}
function loadAddItem(lab){
	console.log("adding loading filters")
	var cat = ""
	var units = ""
	if (lab == "chemistry") {
			console.log("you here?")
			cat += " <input type='radio' name='itemCat' class='cat' value='metal'>Metal  &emsp; </input> <input type='radio' name='itemCat' class='cat' value='nonmetal'>Non-metal  &emsp;</input><input type='radio' name='itemCat' class='cat' value='apparatus'>Apparatus </input> "
			var container = document.getElementById("add-item-categories-div");
			container.innerHTML = cat;
			
			units += "<select class='input-unit' id='item-unit'><option value='mL'>mL</option> <option value='L'>L</option>    </select>"
			var container2 = document.getElementById("add-item-unit-div");
			container2.innerHTML = units;
	}
	
}

function loadItems(){
	console.log("loading items in " + lab + " category: " + filterCat);
	console.log(searchQueryInventory, order)
	if (order == "name"){
		console.log("was here")
		setOrder = "name"

		if (filterCat == "metals" || filterCat == "nonmetals"){
			getChemicals();
		}else {
			getApparatus();
		}

	}else{
		console.log("ngaa wala")
		if (filterCat == "metals" || filterCat == "nonmetals"){
			console.log("ngaaaaaaaaaaaaaaaaaa")
			setOrder = "amount"
			getChemicals();
		}else {
			setOrder = "quantity"
			getApparatus();
		}
	}

}


function getChemicals(){
	console.log("getting chemicals", filterCat, setOrder,searchQueryInventory)
	var itemsCard = "";
	var chemistryDataRef = firebase.database().ref("2/" + lab);
	chemistryDataRef.child("chemicals").child(""+filterCat).orderByChild(setOrder).startAt(searchQueryInventory).endAt(searchQueryInventory+"\uf8ff").once("value").then(function(snapshot) {

	snapshot.forEach(function(childSnapshot) {
	  var key = childSnapshot.key;
	  var childData = childSnapshot.val();      
	  var name_val = childSnapshot.val().name;
	  var cat_val = childSnapshot.val().category;
	  var amount_val = childSnapshot.val().amount;
	  var unit_val = childSnapshot.val().unit;
	  itemsCard += '<div class="card-div"> <span class="card item">Item Name: '+ name_val+'</span> <span class="card unit">Amount: '+amount_val+ ' Unit: '+ unit_val+'</span> <span class="card cat">Category: '+cat_val+'</span> <button class="card-btn"> View history </button> <button class="card-btn"> Update </button> </div>';

	  });
	var container = document.getElementById("items-div");
	container.innerHTML = itemsCard;
	console.log("vge");
	});
}

function getApparatus(){

	console.log("getting chemicals", filterCat, setOrder,searchQueryInventory)
	var itemsCard = "";
	var chemistryDataRef = firebase.database().ref("2/" + lab);
	chemistryDataRef.child("chemicals").child(""+filterCat).limitToFirst(10).orderByChild(setOrder).startAt(searchQueryInventory).endAt(searchQueryInventory+"\uf8ff").once("value").then(function(snapshot) {

	snapshot.forEach(function(childSnapshot) {
	  var key = childSnapshot.key;
	  var childData = childSnapshot.val();      
	  var name_val = childSnapshot.val().name;
	  var cat_val = childSnapshot.val().category;
	  var quantity_val = childSnapshot.val().quantity;
	  
	  itemsCard += '<div class="card-div"> <span class="card item">Item Name: '+ name_val+'</span> <span class="card unit">Quantity: '+quantity_val+'</span> <span class="card cat">Category: '+cat_val+'</span> <button class="btn-info btn card-btn"> View history </button> <button class="btn-info btn card-btn"> Update </button> </div>';

	  });
	var container = document.getElementById("items-div");
	container.innerHTML = itemsCard;
	console.log("vgeeeenot chemicals");
	});
}

function previewFile(sourceID, destID){
	var check = true;
	console.log(sourceID, destID);
       var preview = document.querySelector(destID); //selects the query named img
       var file = $(sourceID).get(0).files[0];
       console.log(file)

       console.log(preview)
       var reader  = new FileReader();

       reader.onloadend = function () {
           preview.src = reader.result;
       		
       }

       if (file) {
           reader.readAsDataURL(file); //reads the data as a URL
           $("#error-image").html("");
       } else {
       	check = false;
           preview.src = "images/add-item-default.png";
           console.log("please upload photo");
           $("#error-image").html("Please upload a photo for this item.");
       }
       return check;
  }

//firebase upload file
function tryUpload() {
	// body...

const ref = firebase.storage().ref();
const file = $('#photo').get(0).files[0];
const name = file.name;
console.log(name);
const metadata = {
  contentType: file.type
};
const task = ref.child(name).put(file, metadata);
task
  .then(snapshot => snapshot.ref.getDownloadURL())
  .then((url) => {
    console.log(url);
    document.querySelector('#photo').src = url;
  })
  .catch(console.error);
}

function validateItem(name, category, quantity, amount, unit, image){
	console.log(category);
	var valid = true;
	if (!previewFile('#item-image', '#sum-image')){
		valid = false;
	}
	if (name.length == 0 ) {
	  	$("#error-name").html("Name cannot be blank. <br>");
	  	valid = false;
	}else{
		$("#error-name").html("");
	}
	if (category == "apparatus"){
		$("#error-cat").html("");
		var intRegex = /^[0-9]+$/;
		var testing = intRegex.test(quantity);
		console.log(testing);
		if (quantity.length == 0 || quantity <= 0 || testing == false){
		  	valid = false;
		  	$("#error-quan").html("Please enter a valid quantity.");
		  	//$(".input-quantity").css("border-color", "red");
		}else{
			$("#error-quan").html("");
		}
	}else if (category == undefined){
			$("#error-cat").html("Please choose item category.");
	}else{
		$("#error-cat").html("");
		if (amount.length == 0 || amount <= 0){
		  	valid = false;
		  	$("#error-amount").html("Please enter a valid amount.");
		  	//$(".input-quantity").css("border-color", "red");
		}else{
			$("#error-amount").html("");
		}
	}
    return valid;
}

/*$(document).on("change", "input[type=radio][name='categories']", function(event){
	console.log(this.value);
	filterCat = this.value;
	var user = firebase.auth().currentUser;
	var uid = user.uid

	var usersRef = firebase.database().ref("0/users/" + uid);
	var userId = firebase.auth().currentUser.uid;
	//loadItems();

});
$(document).on("change", "input[type=radio][name='sorting']", function(event){
	order = "name"
	console.log(this.value)
	loadJSONdata()
	//loadItems();

});

$(document).on("change", "input[type=radio][name='quantity']", function(event){
	console.log(this.value);
	direction = this.value;
	order = "direction";
	
	//loadItems();

});*/
$(document).on("change", "input[type=radio][name='categories']", function(event){
	console.log(this.value);
	filterCat = this.value;
	var user = firebase.auth().currentUser;
	var uid = user.uid

	var usersRef = firebase.database().ref("0/users/" + uid);
	var userId = firebase.auth().currentUser.uid;
	loadJSONdata();
	//loadItems();

});
$(document).on("change", "input[type=radio][name='sorting']", function(event){
	
	sorting = this.value;
	console.log(this.value)
	loadJSONdata()
	//loadItems();

});



//USING EXTERNAL JSON FILE

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}
function filtering(element) {
	var regex = new RegExp( searchQueryInventory, 'gi' );
    return element['name'].match(regex);
}

//usage:
function loadJSONdata(){
	console.log("loadinggggggggggggg")

   	document.getElementById("items-loader").style.display = "block"; 	
   	document.getElementById("items-div").style.display = "none"; 	

	var metalfile = "https://firebasestorage.googleapis.com/v0/b/liarsproject.appspot.com/o/metals.json?alt=media&token=863770d4-84a1-43f3-a579-b9b737086d65";
	var nonmetalfile = "https://firebasestorage.googleapis.com/v0/b/liarsproject.appspot.com/o/nonmetals.json?alt=media&token=c2440f18-e509-4169-a363-27e22d086dc3";
	var apparatusfile = "https://firebasestorage.googleapis.com/v0/b/liarsproject.appspot.com/o/apparatus.json?alt=media&token=64bc14b9-b186-4aad-8588-513922823175";
	var quantifier;
	if (filterCat == "metals"){
		quantifier = "amount"
		choosefile = metalfile;
	}else if (filterCat == "nonmetals"){
		quantifier = "amount"
		choosefile = nonmetalfile;
	}else{
		quantifier = "quantity"
		choosefile = apparatusfile;
	}
	console.log(filterCat, quantifier);
readTextFile(choosefile, function(text){
    var data = JSON.parse(text);
    console.log(data);
    var itemsCard = "";
    //var searchquery = "alprazolam";
    //$.grep(data, function(n, i){
    //	return n['name'] == searchquery;
    //});


	var data = data.filter(filtering);
	console.log(data);
    if (sorting == "az"){
    	data.sort(function(a, b){
	        	if(a.name < b.name) { return -1; }

			    if(a.name > b.name) { return 1; }
			    return 0;
	        });
    }else if (sorting == "za"){
    	data.sort(
		   function(a, b) {          
		      if (a["quantity"] === b["quantity"]) {
		         // Price is only important when cities are the same
		         return b["name"] - a["name"];
		      }
		      return a["quantity"] > b["quantity"] ? 1 : -1;
		   });
	    }
	else if (sorting == "asc"){
			data.sort(function(a, b){return a[quantifier] - b[quantifier]});
	    	
	}else{
			data.sort(function(a, b){return a[quantifier] - b[quantifier]});
	    	data.reverse();
		}
	if (data.length == 0){
		itemsCard = "No item matched your request."
	}
    for (property in data) {
    	
    			  //console.log(`${data[property]['amount']}`)
    	if (filterCat == "apparatus"){
    	    itemsCard += "<div class='card-div'> <span class='card item'>Item Name: "+ `${data[property]['name']}`+"</span> <span class='card unit'> Quantity: "+ `${data[property]['quantity']}`+ "</span> <span class='card cat'>Category: "+ `${data[property]['category']}`+"</span> <button class='btn-info btn card-btn'> View history </button> <button class='btn-info btn card-btn'> Update </button> </div>";

    	}else{
    	 itemsCard += "<div class='card-div'> <span class='card item'>Item Name: "+ `${data[property]['name']}`+"</span> <span class='card unit'> Amount: "+ `${data[property]['amount']}`+ " Unit: "+ `${data[property]['unit']}`+"</span> <span class='card cat'>Category: "+ `${data[property]['category']}`+"</span> <button class='btn-info btn card-btn'> View history </button> <button class='btn-info btn card-btn'> Update </button> </div>";
    	
    	}


//    	 itemsCard += '<div class="card-div"> <span class="card item">Item Name: '+ ${data[property]['name']}+'</span> <span class="card unit">Amount: '+ ${data[property]['amount']}+ ' Unit: '+ ${data[property]['unit']}+'</span> <span class="card cat">Category: '+ ${data[property]['category']}+'</span> <button class="card-btn"> View history </button> <button class="card-btn"> Update </button> </div>';
	    
	console.log("vge");
//   console.log(`key= ${property} value = ${JSON.stringify(data[property])}`)
}
    
    	document.getElementById("items-loader").style.display = "none"; 
    	   	document.getElementById("items-div").style.display = "block"; 	

var container = document.getElementById("items-div");
	container.innerHTML = itemsCard;
});
}