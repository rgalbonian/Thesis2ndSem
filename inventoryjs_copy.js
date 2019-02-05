//filter variables with default values
var filterCat = "metals";
var v1 = "alphabet";
var v2 = "direction";
var lab = "chemistry"
var order = "name";
var setOrder = "name";
var searchQueryInventory = ""
var namedir = "az"
var quandir = "asc";

function inventory(){
	clearInterval(accountabilityloading);
	clearInterval(historyloading);

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
  		//loadJSONdata();
  		loadItems();
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
	//loadJSONdata()
	loadItems();
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
			filterHTML += " <label class='radio-container'>Metal <input type='radio' name='categories'  class='cat' value='metals' checked> <span class='checkmark'></span></label> 					<label class='radio-container'>Non-metal <input type='radio' name='categories'  class='cat' value='nonmetals'> <span class='checkmark'></span></label><label class='radio-container'>Apparatus <input type='radio' name='categories'  class='cat' value='apparatus' > <span class='checkmark'></span></label> "
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
	document.getElementById("items-loader").style.display = "none"; 	
   	document.getElementById("items-div").style.display = "block";
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
	chemistryDataRef.child("chemicals").child(""+filterCat).orderByChild(setOrder).endAt(searchQueryInventory+"\uf8ff").once("value").then(function(snapshot) {
	var data = snapshotToArray(snapshot);
	data = data.filter(filtering);
	data.forEach(function(item){
	  itemsCard += '<div class="card-div"> <span class="card item">Item Name: '+ item.name+'</span> <span class="card unit">Amount: '+item.amount+ 'Unit' + item.unit +'</span> <span class="card cat">Category: '+item.category+'</span> <button class="btn-info btn card-btn"> View history </button> <button class="btn-info btn card-btn"> Update </button> </div>';

	});
/*
	snapshot.forEach(function(childSnapshot) {
	  var key = childSnapshot.key;
	  var childData = childSnapshot.val();      
	  var name_val = childSnapshot.val().name;
	  var cat_val = childSnapshot.val().category;
	  var amount_val = childSnapshot.val().amount;
	  var unit_val = childSnapshot.val().unit;
	  itemsCard += '<div class="card-div"> <span class="card item">Item Name: '+ name_val+'</span> <span class="card unit">Amount: '+amount_val+ ' Unit: '+ unit_val+'</span> <span class="card cat">Category: '+cat_val+'</span> <button class="card-btn"> View history </button> <button class="card-btn"> Update </button> </div>';

	  });
*/	var container = document.getElementById("items-div");
	container.innerHTML = itemsCard;
	console.log("vge");
	});
}

function snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;

        returnArr.push(item);
    });

    return returnArr;
};

function getApparatus(){
	console.log("getting apparatus", filterCat, setOrder,searchQueryInventory)
	var itemsCard = "";
	var chemistryDataRef = firebase.database().ref("2/" + lab);
	chemistryDataRef.child("chemicals").child(""+filterCat).limitToFirst(10).orderByChild(setOrder).once("value").then(function(snapshot) {

	var data = snapshotToArray(snapshot);
	data = data.filter(filtering);
	
	data.forEach(function(item){
	  itemsCard += '<div class="card-div"> <span class="card item">Item Name: '+ item.name+'</span> <span class="card unit">Quantity: '+item.quantity+'</span> <span class="card cat">Category: '+item.category+'</span> <button class="btn-info btn card-btn"> View history </button> <button class="btn-info btn card-btn"> Update </button> </div>';

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
	loadItems();

});
$(document).on("change", "input[type=radio][name='sorting']", function(event){
	order = "name"
	console.log(this.value)
	//loadJSONdata()
	loadItems();

});

$(document).on("change", "input[type=radio][name='quantity']", function(event){
	console.log(this.value);
	direction = this.value;
	order = "direction";
	
	loadItems();

});*/
$(document).on("change", "input[type=radio][name='categories']", function(event){
	console.log(this.value);
	filterCat = this.value;
	var user = firebase.auth().currentUser;
	var uid = user.uid

	var usersRef = firebase.database().ref("0/users/" + uid);
	var userId = firebase.auth().currentUser.uid;
	//loadJSONdata();
	loadItems();

});
$(document).on("change", "input[type=radio][name='alphabetical']", function(event){
	v1 = "alphabet";
	v2 = "direction";
	namedir = this.value;
	console.log(this.value)
	//loadJSONdata()
	loadItems();

});

$(document).on("change", "input[type=radio][name='direction']", function(event){
	v2 = "alphabet";
	v1 = "direction";
	quandir = this.value;
	console.log(this.value)
	//loadJSONdata()
	loadItems();

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
	data = sorter(data, v1, v2, quantifier);
    
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
}
    
    	document.getElementById("items-loader").style.display = "none"; 
    	document.getElementById("items-div").style.display = "block"; 	

var container = document.getElementById("items-div");
	container.innerHTML = itemsCard;
});
}


function sorter(data, v1,v2, q){
	console.log(v1, v2, q, namedir, quandir)
	if (v1 == "alphabet"){
		n1 = "name";
		n2 = q;
	}else{
		n1 = q;
		n2 = "name";
	}

	if (namedir === "az" && quandir === "asc"){
		console.log("both unnn");
			data.sort(
		   function(a, b) {          
		      if (a[n1] === b[n1]) {
		         // Price is only important when cities are the same
		         return b[n2] - a[n2];
		      }
		      return a[n1] > b[n1] ? 1 : -1;
		   });
	}else if ((namedir === "za" && quandir === "asc") || (namedir === "az" && quandir === "desc")){
		console.log("got one");
		data.sort(
				   function(a, b) {          
				      if (a[n1] === b[n1]) {
				         // Price is only important when cities are the same
				         return a[n2] - b[n2];
				      }
				       return a[n1] > b[n1] ? 1 : -1;
				   });	
			
			if (namedir === "za" && n1 == "name"){
				data.reverse();
			}else if (quandir == "desc" && n1 == q){
				data.reverse();
			}
}
	else{
		console.log("both down");
		data.sort(
		   function(a, b) {          
		      if (a[n1] === b[n1]) {
		         // Price is only important when cities are the same
		         return b[n2] - a[n2];
		      }
		      return a[n1] > b[n1] ? 1 : -1;
		   });
		data.reverse();
	}
	

	return data;
}