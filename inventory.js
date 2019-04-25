//filter variables with default values
var filterCat = "glassware";
var origCat, newCat;
var orgUnit;
var lab = "chemistry"
var order = "name";
var setOrder = "name";
var searchQueryInventory = ""
var namedir = "az"
var quandir = "asc";
var reverseData = false;
var validateCheck = false;
var updateThisItem = "";
	var newName = "";
	var newQuan = "";
	var newAmount = "";
	var newUnit = "";
	var newitemID = "";
	var transact = "add";
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
  		setTimeout(loadItems, 5000);
	});
	
}


function viewHistoryFunc(card) {
	
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


function updateFunc(card){
			transact = "update";
			var catDataRef = firebase.database().ref(""+ lab + "/inventory");
			catDataRef.once("value").then(function(snapshot) {
				var dropdown = "<select id='update-item-categories' class='add-item-categories'>";
				snapshot.forEach(function(childSnapshot) {
					dropdown += "<option value='"+childSnapshot.key+"' > "+ childSnapshot.key+ "</option>";
				});
				dropdown += "</select>"
				var container = document.getElementById("update-item-categories-div");
				container.innerHTML = dropdown;
		});
			var units= "";
			units += "<select class='input-unit' id='update-unit'><option value='mL'> mL</option><option value='L'> L</option><option value='g' >g</option><option value='mg'> mg</option></select>"
			var container2 = document.getElementById("update-item-unit-div");
			container2.innerHTML = units;

			setTimeout(function(){
				updateCategoryChange();
				console.log(filterCat)
					
			}, 2000);

	var myitem = card.id;
	$("#" + filterCat).prop("checked", true); 
	var chemistryDataRef = firebase.database().ref(""+lab + "/inventory");

	chemistryDataRef.child(""+filterCat).orderByChild("itemID").equalTo(myitem).once("value").then(function(snapshot) {
		snapshot.forEach(function(childSnapshot) {

			updateThisItem = childSnapshot.key;
			var oldname = childSnapshot.val().name;
			var oldunit = childSnapshot.val().unit;
			console.log(oldunit)
			setTimeout(function(){$("#update-unit").val(oldunit)},1000);
			var oldcat = filterCat;
			$("#update-name").attr("placeholder", oldname );
			
			if (oldcat == "nonmetal" || oldcat == "metal"){
				var oldamount = childSnapshot.val().amount;
				$("#update-amount").val(oldamount);
			}else{
				var oldquan = childSnapshot.val().quantity;
				$("#update-quantity").val(oldquan);
			}
			});
	});

				setTimeout(function(){
					$("#update-item-categories").val(filterCat)
					
				$('#update-item-modal').modal('show');
			}, 1000);
}



$(document).on('change', '#add-item-categories', categoryChange);
$(document).on('change', '#update-item-categories', updateCategoryChange);
function categoryChange() {

     console.log("wtf");
    console.log(this.value);
    var current = $('#add-item-categories').val();
    console.log(current)
    if (current == 'apparatus' || current == 'glassware') {
        $(".appa-quan").css("visibility", "visible");
        $(".appa-quan").css("display", "block");
        $(".chem-quan").css("display", "none");
        $(".chem-quan").css("visibility", "hidden");
    }
    else if ((current == 'metal') || (current == 'nonmetal')  ){
        $(".chem-quan").css("visibility", "visible");
         $(".chem-quan").css("display", "block");
          $(".appa-quan").css("display", "none");
          	$(".appa-quan").css("visibility", "hidden");
    }
    $("#error-quan").html("");
    $("#error-amount").html("");

}

function updateCategoryChange() {

     console.log("wtf");
    console.log(this.value);
    var current = $('#update-item-categories').val();
    console.log(current)
    if (current == 'apparatus' || current == 'glassware') {
        $(".appa-quan").css("visibility", "visible");
        $(".appa-quan").css("display", "block");
        $(".chem-quan").css("display", "none");
        $(".chem-quan").css("visibility", "hidden");
    }
    else if ((current == 'metal') || (current == 'nonmetal')  ){
        $(".chem-quan").css("visibility", "visible");
         $(".chem-quan").css("display", "block");
          $(".appa-quan").css("display", "none");
          	$(".appa-quan").css("visibility", "hidden");
    }
    $("#error-quan").html("");
    $("#error-amount").html("");

}
/*
$(document).on("change", "input[type=radio][name='add-item-categories']", function(event){
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
*/

$( "#searchInventory").click(function() {
	searchQueryInventory = $("#searchQueryInventory").val();
	console.log(searchQueryInventory);
	//loadJSONdata()
	loadItems();
});

function deleteItem(){
	var deleteRef = firebase.database().ref(""+lab+"/inventory/"+	filterCat + "/" + updateThisItem);
	deleteRef.remove()
	alert("item deleted")
	$('#update-item-modal').modal('hide');
	loadItems();

}


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
  	
	
    console.log(transact);

	if (transact == "add"){
		category = $("#add-item-categories").val();
		name = $("#item-name").val()
		image = $('#item-image').get(0).files[0];
		amount = $("#item-amount").val()
      	unit = $("#item-unit").val()
      	quantity = $("#item-quantity").val()
      	console.log("Adding item" ,category)
	}else{
		category = $("#update-item-categories").val();
		name = $("#update-name").val()
		amount = $("#update-amount").val()
      	unit = $("#update-unit").val()
      	quantity = $("#update-quantity").val()
      	image = "images/add-item-default.png"
      		//image = $('#item-image').get(0).files[0];
	}
	var chemicalsRef = firebase.database().ref(""+ lab + "/inventory"  +"/" + category);
	var addChemicals = chemicalsRef.push();
    var itemID = category.substring(0, 3) + addChemicals.key;
    if (category == "apparatus" || category == "glassware"){
			newData = {
	          "category" : category,
	          "itemID" : itemID,
	          "image" : image,
	          "name" : name,
	          "quantity" : quantity
	      }
	}else{
			newData = {
	          "category" : category,
	          "itemID" : itemID,
	          "image" : image,
	          "name" : name,
	          "amount" : amount,
	          "unit" : unit
	      }
	}
   	

    if (transact == "add"){ 
    		console.log(newData)	
			//var addChemicals = chemicalsRef.push();
			addChemicals.set(newData);

			console.log("Item added")
			loadItems();
			updateItemHistory(itemID, "Item was created.");
			$('#add-item-modal').modal('hide')
	}else{
		
	console.log(origCat, newCat)

	var updateKey = firebase.database().ref(""+ lab + "/inventory" + "/" + filterCat).push().key;
	origCat = filterCat;
	if (origCat == category){
		var updates = {}
		updates[""+lab+"/inventory/"+	filterCat + "/" + updateThisItem] = newData;
		firebase.database().ref().update(updates);
	}
	else{
		var deleteRef = firebase.database().ref(""+lab+"/inventory/"+	origCat + "/" + updateThisItem);
		deleteRef.remove()
		alert("confirm transfer to category")
		var addRef = firebase.database().ref(""+ lab + "/inventory"  +"/" + category);
	
		var item = addRef.push(newData);
	}

	console.log(updateThisItem);
	
	$('#update-item-modal').find('input').val('');
	loadItems();
	}

	//console.log("you bebeh");
	
	$('#item-summary-modal').modal('hide')
	
	$('#alertModal').modal('show')
	var preview = document.querySelector("#img-previewer");
	preview.src = "images/add-item-default.png";
	if (transact == "add"){
		$('#add-item-modal').find('input').val('');
		$('#add-item-modal').find('span').html('');	
	}else{
		$('#update-item-modal').find('input').val('');
		$('#update-item-modal').find('span').html('');
	}
	
	
});
$(document).on("click", "#modal-edit-summary-btn", function(event){
	console.log("wasss")
	$("#add-item-modal").find("span").html("");
	$("#update-item-modal").find("span").html("");
	validateCheck = false;
});

$("#add-item-modal").on("hidden.bs.modal", function () {
	console.log("CLOSED")
    $("#error-name").html("");
	$("#error-amount").html("");
    $("#error-unit").html("");
    $("#error-quan").html("");
});

$("#update-item-modal").on("hidden.bs.modal", function () {
	console.log("CLOSED")
    $("#update-error-name").html("");
	$("#update-error-amount").html("");
    $("#update-error-unit").html("");
    $("#update-error-quan").html("");
});

$(document).on("click", "#modal-add-btn", function(event){
	console.log("summaryyyyy")
	var name, category, quantity, amount, unit, image;
  	var name = $("#item-name").val()
	var image = $('#item-image').get(0).files[0];
    var category = $("#add-item-categories").val();

    $("#sum-name").html("Item Name: "+ name);
    $("#sum-cat").html("Category: " + category);
    if (category == "apparatus" || category == "glassware"){
    	$("#sum-amount").html("");
    	$("#sum-unit").html("");
    	var quantity = $("#item-quantity").val()
    	var validateCheck = validateItem(name, category, quantity, amount, unit, image);
    	if (validateCheck){
       		$("#sum-quan").html("Quantity: " + quantity + "<br>");
    		console.log(name + quantity + category, image);
    		$('#item-summary-modal').modal('show');
    	}
    	else{
    			console.log("error in validation")
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
    	else{
    			console.log("error in validation")
    	}
    	
    }
});

$(document).on("click", "#modal-update-btn", function(event){
	
	console.log("edit summaryyyyy")
	var name, category, quantity, amount, unit, image;
  	var name = $("#update-name").val()
	var image = null;//$('#update-image').get(0).files[0];
    var category = $("#update-item-categories").val();
    console.log(category)
    $("#sum-name").html("Item Name: "+ name);
    $("#sum-cat").html("Category: " + category);
    if (category == "apparatus" || category == "glassware"){
    	$("#sum-amount").html("");
    	$("#sum-unit").html("");
    	var quantity = $("#update-quantity").val()
    	var validateCheck = validateItemForEdit(name, category, quantity, amount, unit, image);
    	if (validateCheck){
       		$("#sum-quan").html("Quantity: " + quantity + "<br>");
    		console.log(name + quantity + category, image);
    		$('#update-item-modal').modal('hide');
    		$('#item-summary-modal').modal('show');
    	}
    	else{
    			console.log("error in validation")
    	}
    }else {
    	$("#sum-quan").html("");
    	var amount = $("#update-amount").val()
      	var unit = $("#update-unit").val()
    	var validateCheck = validateItemForEdit(name, category, quantity, amount, unit, image);
    	if (validateCheck){
      		$("#sum-amount").html("Amount: " + amount +  "<br>");
    		$("#sum-unit").html("Unit: " +unit);
      		console.log(name + amount + unit + category);
      		$('#update-item-modal').modal('hide');
      		$('#item-summary-modal').modal('show');
    	}
    	else{
    			console.log("error in validation")
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

$(document).on("click", "#update-modal-cancel-btn", function(event){
	console.log("canceled")
	$('#update-item-modal').find('input').val('');
	$('#update-item-modal').find('span').html('');
	var preview = document.querySelector("#img-previewer");
	preview.src = "images/add-item-default.png";
});

function filterTab() {
	if (lab == "chemistry") {		
			var chemistryDataRef = firebase.database().ref(""+ lab + "/inventory");
			chemistryDataRef.once("value").then(function(snapshot) {
				var checks1 = "";
				var checks2 = "";
				checks1 += "<label class='radio-container' id='chooseCat'>";
				checks2 += "<label class='radio-container' id='update-chooseCat'>";
				snapshot.forEach(function(childSnapshot) {
					//checks += "<input type='radio' name='categories' class='cat' value="+childSnapshot.key+" > "+ childSnapshot.key+ "</option>";
					if (childSnapshot.key == 'glassware'){
						checks1 += "<label class='radio-container'>"+ childSnapshot.key +" <input type='radio' name='categories'  class='cat' value='"+ childSnapshot.key +"' checked> <span class='checkmark'></span></label>"
					}else{
					checks1 += "<label class='radio-container'>"+ childSnapshot.key +" <input type='radio' name='categories'  class='cat' value='"+childSnapshot.key+"'> <span class='checkmark'></span></label>"
					}
					checks2 += "<label class='radio-container'>"+ childSnapshot.key +" <input type='radio' name='update-categories'  class='cat' value='"+childSnapshot.key+"' id='"+childSnapshot.key+"''> <span class='checkmark'></span></label>"
					//checks += "<option value="+"'sadasd'"+" > "+ "'sadasd"+ "</option>";
					//checks += "asd"
					//console.log(checks1)
					console.log(childSnapshot.key)
		    	});     	
		    console.log(filterCat)
		    filterCat = "glassware";
			var container = document.getElementById("categories-div");
			container.innerHTML = checks1;
			var container = document.getElementById("update-categories-div");
			container.innerHTML = checks2;
			});

console.log(filterCat)
	}
}
function loadAddItem(lab){
	transact = "add"
	console.log("adding loading filters")
	var cat = ""
	var units = ""
	if (lab == "chemistry") {
			console.log("you here?")
			//cat += " <input type='radio' name='add-item-categories' class='cat' value='metal'>Metal  &emsp; </input> <input type='radio' name='add-item-categories' class='cat' value='nonmetal'>Non-metal  &emsp;</input><input type='radio' name='add-item-categories' class='cat' value='apparatus'>Apparatus </input> "
			var catDataRef = firebase.database().ref(""+ lab + "/inventory");
			catDataRef.once("value").then(function(snapshot) {
				var dropdown = "<select id='add-item-categories' class='add-item-categories'>";
				snapshot.forEach(function(childSnapshot) {
					dropdown += "<option value='"+childSnapshot.key+"' > "+ childSnapshot.key+ "</option>";
				});
				dropdown += "</select>"
				var container = document.getElementById("add-item-categories-div");
				container.innerHTML = dropdown;
		});
			units += "<select class='input-unit' id='item-unit'><option value='mL'> mL</option><option value='L'> L</option><option value='g' >g</option><option value='mg'> mg</option></select>"
			var container2 = document.getElementById("add-item-unit-div");
			container2.innerHTML = units;
			
			setTimeout(function(){
				categoryChange();
					$("#add-item-categories").val(filterCat)
			}, 2000);


	}
	
}



function loadItems(){
	document.getElementById("items-loader").style.display = "block"; 	
   	document.getElementById("items-div").style.display = "none";
	
	console.log("getting items", filterCat, setOrder,searchQueryInventory)
	
	var itemsCard = "";
	//connect to db and get elements
	var chemistryDataRef = firebase.database().ref(""+ lab + "/inventory");
	console.log(lab)
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
		  itemsCard += '<div class="card-div"  > <span class="card item">Item Name: '+ item.name+'</span> <span class="card unit">Amount: '+item.amount+ ' Unit: ' + item.unit +'</span> <span class="card cat">Category: '+ filterCat+'</span> <button class="btn-info btn card-btn view-history-btn" id='+item.itemID+' onclick="viewHistoryFunc(this)"> View history </button> <button class="btn-info btn card-btn" id='+item.itemID+' onclick="updateFunc(this)"> Update </button> </div>';
		});
	}else {
		data.forEach(function(item){
		  itemsCard += '<div class="card-div" > <span class="card item">Item Name: '+ item.name+'</span> <span class="card unit">Quantity: '+item.quantity+'</span> <span class="card cat">Category: '+filterCat+'</span> <button class="btn-info btn card-btn"  id='+item.itemID+' onclick="viewHistoryFunc(this)"> View history </button> <button class="btn-info btn card-btn" id='+item.itemID+' onclick="updateFunc(this)"> Update </button> </div>';
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
	var chemistryDataRef = firebase.database().ref(""+ lab + "/inventory");
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
	if (category == "apparatus" || category == "glassware"){
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

function validateItemForEdit(name, category, quantity, amount, unit, image){
	console.log(category);
	var valid = true;
	/*if (!previewFile('#item-image', '#sum-image')){
		valid = true;
	}*/
	if (name.length == 0 ) {
	  	$("#update-error-name").html("Name cannot be blank. <br>");
	  	valid = false;
	}else{
		$("#update-error-name").html("");
	}
	if (category == "apparatus" || category == "glassware"){
		$("#update-error-cat").html("");
		var intRegex = /^[0-9]+$/;
		var testing = intRegex.test(quantity);

		console.log(testing, quantity);
		if (quantity.length == 0 || quantity <= 0 || testing == false){
		  	valid = false;
		  	$("#update-error-quan").html("Please enter a valid quantity.");
		  	//$(".input-quantity").css("border-color", "red");
		}else{
			$("#update-error-quan").html("");
		}
	}else if (category == undefined){
			$("#update-error-cat").html("Please choose item category.");
	}else{
		$("#update-error-cat").html("");
		if (amount.length == 0 || amount <= 0){
		  	valid = false;
		  	$("#update-error-amount").html("Please enter a valid amount.");
		  	//$(".input-quantity").css("border-color", "red");
		}else{
			$("#update-error-amount").html("");
		}
	}
    return valid;
}

$(document).ready(function(){
    var $regexunit=/^[0-9]+$/;
    $('#item-quantity').on('keypress keydown keyup',function(){
             if (!$(this).val().match($regexunit) || $(this).val() == 0 ) {
              $("#error-quan").html("Please enter a valid quantity.");
             }
           else{
                $("#error-quan").html("");
               }
         });
    var $regexamount = /^\d*\.?\d*$/;
    $('#item-amount').on('keypress keydown keyup',function(){
             if (!$(this).val().match($regexamount) || $(this).val() == 0 ) {
              $("#error-amount").html("Please enter a valid amount.");
             }
           else{
                $("#error-amount").html("");
               }
         });
    $('#item-name').on('keypress keydown keyup',function(){
             if ($(this).val() == 0 ) {
              $("#error-name").html("Name cannot be blank. <br>");
             }
           else{
                $("#error-name").html("");
               }
         });
});

$(document).ready(function(){
    var $regexunit=/^[0-9]+$/;
    $('#update-quantity').on('keypress keydown keyup',function(){
             if (!$(this).val().match($regexunit) || $(this).val() == 0 ) {
              $("#update-error-quan").html("Please enter a valid quantity.");
             }
           else{
                $("#update-error-quan").html("");
               }
         });
    var $regexamount = /^\d*\.?\d*$/;
    $('#update-amount').on('keypress keydown keyup',function(){
             if (!$(this).val().match($regexamount) || $(this).val() == 0 ) {
              $("#update-error-amount").html("Please enter a valid amount.");
             }
           else{
                $("#update-error-amount").html("");
               }
         });
    $('#update-name').on('keypress keydown keyup',function(){
             if ($(this).val() == 0 ) {
              $("#update-error-name").html("Name cannot be blank. <br>");
             }
           else{
                $("#update-error-name").html("");
               }
         });
});


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

$(document).on("change", "input[type=radio][name='update-item-categories']", function(event){
	console.log(this.value);
	newCat = this.value;
	console.log(origCat, newCat)

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
	if (filterCat == "apparatus" || filterCat == "glassware"){
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




//history

//update item history
function updateItemHistory(historyID,action){
	var user = firebase.auth().currentUser;
	var uid = user.uid
	//asume lab = chemistry
	var lab = "chemistry";
	var database = firebase.database().ref(lab);
	console.log("hehehe "+uid)
	//showNotification(action)

	database.child("/history").orderByChild("historyID").equalTo(historyID).once("value").then(function(snapshot){
			
				var data = snapshotToArray(snapshot);
				console.log(data, data.length)
				if (data.length == 0){
						var timestamp = firebase.firestore.Timestamp.fromDate(new Date()).toDate();
						dateParts = (timestamp.toString()).split(" ");
					var action = {
								"user": {
									"userID" : uid,
									"name" : user.name
								},
								"action": action,
								"date": {
									"month": dateParts[1],
									"day": dateParts[2],
									"year": dateParts[3],
									"time": dateParts[4]
								}
						};
						firebase.database().ref(""+lab+"/history").child(historyID).setValue(action);
						console.log(historyID + "---" + action);					
				}else{
				snapshot.forEach(function(childSnapshot) {
						console.log("hehehe hist");
						var updateThisChild = childSnapshot.key;
						console.log(updateThisChild)
						var timestamp = firebase.firestore.Timestamp.fromDate(new Date()).toDate();
						dateParts = (timestamp.toString()).split(" ");

						var additionalAction = {
								"user": {
									"userID" : uid,
									"name" : user.name
								},
								"action": action,
								"date": {
									"month": dateParts[1],
									"day": dateParts[2],
									"year": dateParts[3],
									"time": dateParts[4]
								}
						};			
						firebase.database().ref(""+lab+"/history/"+updateThisChild+"/actions").push(additionalAction);
						return true;
				});
			}
	});
}