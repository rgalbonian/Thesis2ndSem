//filter variables with default values
var filterCat = "metal";
var lab = "chemistry"
var order = "name";
var setOrder = "name";
var searchQueryInventory = ""
var namedir = "az"
var quandir = "asc";
var reverseData = false;
var validateCheck = false;
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
	
		
	var usersRef = firebase.database().ref("users/" + uid);
	var userId = firebase.auth().currentUser.uid;
	firebase.database().ref('users/' + userId).once('value').then(function(snapshot) {
	  	lab = (snapshot.val() && snapshot.val().laboratory) || 'Anonymous';
  		console.log(lab)
  		filterTab()
  		//loadJSONdata();
  		loadItems();
	});
	
}


function viewHistoryFunc(card) {
	console.log(card.id);
	var myitem = card.id;
	var chemistryDataRef = firebase.database().ref(""+ lab);
	chemistryDataRef.child(""+filterCat).orderByChild("itemID").equalTo(myitem).once("value").then(function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
	        $("#hist-name").html("Item Name: "+ childSnapshot.val().name);
    		$("#hist-cat").html("Category: " + childSnapshot.val().category);
    	}); 
	});
	$('#item-history-modal').modal('show');
}

function updateFunc(card) {
	console.log(card.id +filterCat);
	var myitem = parseInt(card.id);
	var chemistryDataRef = firebase.database().ref(""+lab);

	chemistryDataRef.child(""+filterCat).orderByChild("itemID").equalTo(myitem).once("value").then(function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			console.log(childSnapshot.val().name);
			$("#update-name").attr("placeholder",childSnapshot.val().name );
	        //$("#update-name").html("Item Name: "+ childSnapshot.val().name);
    		$("#update-cat").html("Category: " + childSnapshot.val().category);

    		if (filterCat == 'apparatus'){
    			$("#update-amount").attr("style","display:none");
    			$("#update-unit").attr("style","display:none");
    			$("#text-amount").html("");
    			$("#text-unit").html("");

    			$("#update-quan").attr("style","display:inline");
    			$("#text-quan").html("Quantity: ");
 				$("#update-quan").attr("placeholder",childSnapshot.val().quantity );
    			
    		}else{
    			$("#update-quan").attr("style","display:none");
    			$("#text-quan").html("");
    			$("#update-amount").attr("style","display:inline");
    			$("#update-unit").attr("style","display:inline");

    			$("#text-amount").html("Amount: ");
    			$("#text-unit").html("Unit: ");
  				$("#update-amount").attr("placeholder",childSnapshot.val().amount );   			
  				$("#update-unit").attr("placeholder",childSnapshot.val().unit );   			
    		}
    	}); 
	});
	$('#item-update-modal').modal('show');
}

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
$( "modal-confirm-update-btn").click(function() {
	$('#item-update-modal').modal('hide');
	$('#alertModal').modal('show')
	alert("huhu");
	console.log("huhu")
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
	var name, category, quantity, amount, unit, image;
  	var name = $("#item-name").val()
	var image = $('#item-image').get(0).files[0];
    var category = $("input[name='itemCat']:checked").val();

    if (category == "apparatus"){
    	var quantity = $("#item-quantity").val()
    	var chemicalsRef = firebase.database().ref("" + lab  +"/" + category);
	
		var addChemicals = chemicalsRef.push({
	 	name: name,
	 	image: image,
	 	category: category,
	 	id: 1,
	 	quantity: quantity
		});
    }else {
    	
    	var amount = $("#item-amount").val()
      	var unit = $("#item-unit").val()
    	var chemicalsRef = firebase.database().ref("" + lab  +"/" + category);
	
		var addChemicals = chemicalsRef.push({
	 	name: name,
	 	image: image,
	 	category: category,
	 	id: 1,
	 	amount: amount,
	 	unit: unit
		});
    }

	//console.log("you bebeh");
	
	$('#item-summary-modal').modal('hide')
	$('#add-item-modal').modal('hide')
	$('#alertModal').modal('show')
	var preview = document.querySelector("#img-previewer");
	preview.src = "images/add-item-default.png";
	$('#add-item-modal').find('input').val('');
	$('#add-item-modal').find('span').html('');
	
});
$(document).on("click", "#modal-edit-summary-btn", function(event){
	console.log("wasss")
	$("#add-item-modal").find("span").html("");
	validateCheck = false;
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
    	var validateCheck = validateItem(name, category, quantity, amount, unit, image);
    	if (validateCheck){
       		$("#sum-quan").html("Quantity: " + quantity + "<br>");
    		console.log(name + quantity + category, image);
    		$('#item-summary-modal').modal('show');
    	}
    }else {
    	$("#sum-quan").html("");
    	var amount = $("#item-amount").val()
      	var unit = $("#item-unit").val()
    	var validateCheck = validateItem(name, category, quantity, amount, unit, image);
    	if (validateCheck){
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
			filterHTML += " <label class='radio-container'>Metal <input type='radio' name='categories'  class='cat' value='metal' checked> <span class='checkmark'></span></label> 					<label class='radio-container'>Non-metal <input type='radio' name='categories'  class='cat' value='nonmetal'> <span class='checkmark'></span></label><label class='radio-container'>Apparatus <input type='radio' name='categories'  class='cat' value='apparatus' > <span class='checkmark'></span></label> "
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
	document.getElementById("items-loader").style.display = "block"; 	
   	document.getElementById("items-div").style.display = "none";
	
	console.log("getting items", filterCat, setOrder,searchQueryInventory)
	
	var itemsCard = "";
	//connect to db and get elements
	var chemistryDataRef = firebase.database().ref("" + lab);
	chemistryDataRef.child(""+filterCat).orderByChild(setOrder).once("value").then(function(snapshot) {
	//convert object to array
	var data = snapshotToArray(snapshot);
	//filter data, you can edit filtering() function (i mean create your own para indi maoverridae) depende sa need mo kung pano magfilter
	data = data.filter(filtering);
	//sort data based on attribute
	data.sort(
		   function(a, b) {
		      return a[setOrder] > b[setOrder] ? 1 : -1;
		   });
	console.log(reverseData)
	if (reverseData){
		console.log("reversing");
		data.reverse();
	}
	if (data.length == 0){
		itemsCard = "No item matched your request."
	}
	//use data.forEach for iterate sa data
	if (filterCat == "metal" || filterCat == "nonmetal"){
		data.forEach(function(item){
			console.log("item id" +item.id)
		  itemsCard += '<div class="card-div"  > <span class="card item">Item Name: '+ item.name+'</span> <span class="card unit">Amount: '+item.amount+ ' Unit: ' + item.unit +'</span> <span class="card cat">Category: '+item.category+'</span> <button class="btn-info btn card-btn view-history-btn" id='+item.itemID+' onclick="viewHistoryFunc(this)"> View history </button> <button class="btn-info btn card-btn" id='+item.itemID+' onclick="updateFunc(this)"> Update </button> </div>';
		});
	}else {
		data.forEach(function(item){
		  itemsCard += '<div class="card-div" > <span class="card item">Item Name: '+ item.name+'</span> <span class="card unit">Quantity: '+item.quantity+'</span> <span class="card cat">Category: '+item.category+'</span> <button class="btn-info btn card-btn"  id='+item.itemID+' onclick="viewHistoryFunc(this)"> View history </button> <button class="btn-info btn card-btn" id='+item.itemID+' onclick="updateFunc(this)"> Update </button> </div>';
		});
	}

	var container = document.getElementById("items-div");
	container.innerHTML = itemsCard;

	document.getElementById("items-loader").style.display = "none"; 	
   	document.getElementById("items-div").style.display = "block";
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
}
/*
function loadItems(){
	console.log("loading items in " + lab + " category: " + filterCat);
	console.log(searchQueryInventory, order)
	document.getElementById("items-loader").style.display = "none"; 	
   	document.getElementById("items-div").style.display = "block";
	if (order == "name"){
		console.log("was here")
		setOrder = "name"

		if (filterCat == "metal" || filterCat == "nonmetal"){
			getChemicals();
		}else {
			getApparatus();
		}

	}else{
		console.log("ngaa wala")
		if (filterCat == "metal" || filterCat == "nonmetal"){
			console.log("ngaaaaaaaaaaaaaaaaaa")
			setOrder = "amount"
			getChemicals();
		}else {
			setOrder = "quantity"
			getApparatus();
		}
	}
}*/


/*function getChemicals(){
	console.log("getting chemicals", filterCat, setOrder,searchQueryInventory)
	var itemsCard = "";
	var chemistryDataRef = firebase.database().ref("2/" + lab);
	chemistryDataRef.child("chemicals").child(""+filterCat).orderByChild(setOrder).once("value").then(function(snapshot) {
	var data = snapshotToArray(snapshot);
	data = data.filter(filtering);
	if 
	data.forEach(function(item){
	  itemsCard += '<div class="card-div"> <span class="card item">Item Name: '+ item.name+'</span> <span class="card unit">Amount: '+item.amount+ ' Unit' + item.unit +'</span> <span class="card cat">Category: '+item.category+'</span> <button class="btn-info btn card-btn view-history-btn" id="view-history-btn"> View history </button> <button class="btn-info btn card-btn"> Update </button> </div>';

	});
	var container = document.getElementById("items-div");
	container.innerHTML = itemsCard;
	console.log("vge");
	});
}
*/


function getApparatus(){
	console.log("getting apparatus", filterCat, setOrder,searchQueryInventory)
	var itemsCard = "";
	var chemistryDataRef = firebase.database().ref("" + lab);
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

$(document).on("change", "input[type=radio][name='categories']", function(event){
	console.log(this.value);
	filterCat = this.value;
	var user = firebase.auth().currentUser;
	var uid = user.uid

	var usersRef = firebase.database().ref("users/" + uid);
	var userId = firebase.auth().currentUser.uid;
	//loadJSONdata();
	loadItems();
});
$(document).on("change", "input[type=radio][name='alphabetical']", function(event){
	setOrder = "name";
	namedir = this.value;
	if (namedir == "za"){
		reverseData = true;
	}else{
		reverseData = false;
	}
	console.log(this.value)
	//loadJSONdata()
	loadItems();

});

$(document).on("change", "input[type=radio][name='direction']", function(event){
	if (filterCat == "apparatus"){
		setOrder = "quantity";
	} else{
		setOrder = "amount";
	}
	quandir = this.value;
	if (quandir == "desc"){
		reverseData = true;
	}else{
		reverseData = false;
	}
	console.log(this.value)
	//loadJSONdata()
	loadItems();

});


function filtering(element) {
	var regex = new RegExp( searchQueryInventory, 'gi' );
    return element['name'].match(regex);
}



