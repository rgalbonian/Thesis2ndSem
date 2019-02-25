function request(){
	clearInterval(accountabilityloading);
	clearInterval(historyloading);
	//show request_div and breadcrumb at request tab
	document.getElementById("request_div").style.display="block";
	document.getElementById("request").classList.add("active");
	//other tabs: inactive
	document.getElementById("history").classList.remove("active");
	document.getElementById("accountability").classList.remove("active");
	document.getElementById("inventory").classList.remove("active");
	//hide other tab's divs
	document.getElementById("accountability_div").style.display="none";
	document.getElementById("history_div").style.display="none";
	document.getElementById("inventory-div").style.display="none";
	
}


function open_pending_tab(){
	//show request headers and pending div, set pending as active
	document.getElementById("request_header").style.display="block";
	document.getElementById("pending_div").style.display="block";
	document.getElementById("pending_tab").classList.add("active");

	//hide other tabs
	document.getElementById("completed_tab").classList.remove("active");
	document.getElementById("declined_tab").classList.remove("active");
	document.getElementById("processing_tab").classList.remove("active");

	//hide other divs
	document.getElementById("completed_div").style.display="none";
	document.getElementById("processing_div").style.display="none";
	document.getElementById("declined_div").style.display="none";

	getRequests("pending");
}

function open_processing_tab(){
	//set processing as active breadcrumb
	//show div for processing
	document.getElementById("processing_tab").classList.add("active");
	document.getElementById("processing_div").style.display="block";
	
	//hide evrything else
	document.getElementById("pending_tab").classList.remove("active");
	document.getElementById("completed_tab").classList.remove("active");
	document.getElementById("declined_tab").classList.remove("active");
	//hide other divs
	document.getElementById("pending_div").style.display="none";
	document.getElementById("completed_div").style.display="none";
	document.getElementById("declined_div").style.display="none";
	getRequests("others");
}

function open_declined_tab(){
	document.getElementById("pending_tab").classList.remove("active");
	document.getElementById("completed_tab").classList.remove("active");
	document.getElementById("declined_tab").classList.add("active");
	document.getElementById("processing_tab").classList.remove("active");
	document.getElementById("pending_div").style.display="none";
	document.getElementById("completed_div").style.display="none";
	document.getElementById("processing_div").style.display="none";
	document.getElementById("declined_div").style.display="block";
	getRequests("declined");

}

function open_completed_tab(){
	document.getElementById("completed_tab").classList.add("active");
	document.getElementById("pending_tab").classList.remove("active");
	document.getElementById("declined_tab").classList.remove("active");
	document.getElementById("processing_tab").classList.remove("active");
	document.getElementById("completed_div").style.display="block";
	document.getElementById("pending_div").style.display="none";
	document.getElementById("processing_div").style.display="none";
	document.getElementById("declined_div").style.display="none";
	getRequests("complete");
}


function getRequests(status){
	//connect to db and get pending requests based on laboratory
	//assume lab =  chemistry for now
	var lab = "chemistry";
	var database = firebase.database().ref(lab + "/request");
	
	//display requests based on parameter "status"
	database.on('child_added',function(snapshot){
		var data = snapshotToArray(snapshot);
		console.log(data)
		var requestStatus = data[6];
		switch(status){
			case "pending":
				if(requestStatus.toLowerCase() == "pending"){
					var items = data[1];
					var requestId = data[3];
					var requestNeeded = data[4];
					var requestSent = data[5];
					var requestorId = data[7];
					var itemStorage = '';
					for (var i = 0;i<items.length;i++){
						//limit item display to three
						if(i < 3){
							itemStorage += '<br>Item: '+ i+'<br> item id: '+data[1][i]["itemID"]+'<br>amount: '+data[1][i]["amount"]+'<br>quantity: '+data[1][i]["quantity"]+'<br>unit '+ data[1][i]["unit"] +'<br>';
						}
						else{
							break;
						}
					} 

					var container = document.getElementById('pending-items-div-pcd');
					container.innerHTML += '<div class="card-div-pending rounded" id="'+requestId+'" ondblclick="seeMoreRequest(this)"><span class="card status">'+ requestStatus + '</span><span class="card request-number">Request Number: '+requestId+'</span><span class="card request-sent">Request Sent:'+requestSent+'</span><span class="card request-needed">Request Needed:'+requestNeeded+'</span><span class="card request-requestor">Requestor Name:'+requestorId+'</span><span class="card request-items">Items:'+itemStorage+'</span><button type="button" class="btn btn-info btn card-btn" id="declineMain"> Decline </button><button class="btn btn card-btn" id="'+requestId+'" onclick="showConfirmModal(this)" id="reqAdd"> Process </button></div>';
				}
			case "declined":
				if(requestStatus.toLowerCase() == "declined" ){
					var items = data[1];
					var requestId = data[3];
					var requestNeeded = data[4];
					var requestSent = data[5];
					var requestorId = data[7];
					var itemStorage = '';
					for (var i = 0;i<items.length;i++){
						//limit item display to three
						if(i < 3){
							itemStorage += '<br>Item: '+ i+'<br> item id: '+data[1][i]["itemID"]+'<br>amount: '+data[1][i]["amount"]+'<br>quantity: '+data[1][i]["quantity"]+'<br>unit '+ data[1][i]["unit"] +'<br>';
						}
						else{
							break;
						}
					} 
				var container = document.getElementById('declined-items-div-pcd');
					container.innerHTML += '<div class="card-div-pending rounded" id="'+requestId+'" ondblclick="seeMoreRequest(this)"><span class="card status">'+ requestStatus + '</span><span class="card request-number">Request Number: '+requestId+'</span><span class="card request-sent">Request Sent:'+requestSent+'</span><span class="card request-needed">Request Needed:'+requestNeeded+'</span><span class="card request-requestor">Requestor Name:'+requestorId+'</span><span class="card request-items">Items:'+itemStorage+'</span></div>';
				
					//var buttons = '<button class="btn btn card-btn" id="'+requestId+'" onclick="showConfirmModal(this)" id="reqAdd"> Update </button>';
				}
			case "complete":
				if(requestStatus.toLowerCase() == "complete" ){
					var items = data[1];
					var requestId = data[3];
					var requestNeeded = data[4];
					var requestSent = data[5];
					var requestorId = data[7];
					var itemStorage = '';
					for (var i = 0;i<items.length;i++){
						//limit item display to three
						if(i < 3){
							itemStorage += '<br>Item: '+ i+'<br> item id: '+data[1][i]["itemID"]+'<br>amount: '+data[1][i]["amount"]+'<br>quantity: '+data[1][i]["quantity"]+'<br>unit '+ data[1][i]["unit"] +'<br>';
						}
						else{
							break;
						}
					} 
				var container = document.getElementById('completed-items-div-pcd');
					container.innerHTML += '<div class="card-div-pending rounded" id="'+requestId+'" ondblclick="seeMoreRequest(this)"><span class="card status">'+ requestStatus + '</span><span class="card request-number">Request Number: '+requestId+'</span><span class="card request-sent">Request Sent:'+requestSent+'</span><span class="card request-needed">Request Needed:'+requestNeeded+'</span><span class="card request-requestor">Requestor Name:'+requestorId+'</span><span class="card request-items">Items:'+itemStorage+'</span></div>';
				
					//var buttons = '<button class="btn btn card-btn" id="'+requestId+'" onclick="showConfirmModal(this)" id="reqAdd"> Update </button>';
				}
			default:
				//display processing cards
				var items = data[1];
					var requestId = data[3];
					var requestNeeded = data[4];
					var requestSent = data[5];
					var requestorId = data[7];
					var itemStorage = '';
					for (var i = 0;i<items.length;i++){
						//limit item display to three
						if(i < 3){
							itemStorage += '<br>Item: '+ i+'<br> item id: '+data[1][i]["itemID"]+'<br>amount: '+data[1][i]["amount"]+'<br>quantity: '+data[1][i]["quantity"]+'<br>unit '+ data[1][i]["unit"] +'<br>';
						}
						else{
							break;
						}
					} 
				var container = document.getElementById('processing-items-div-pcd');
					container.innerHTML += '<div class="card-div-pending rounded" id="'+requestId+'" ondblclick="seeMoreRequest(this)"><span class="card status">'+ requestStatus + '</span><span class="card request-number">Request Number: '+requestId+'</span><span class="card request-sent">Request Sent:'+requestSent+'</span><span class="card request-needed">Request Needed:'+requestNeeded+'</span><span class="card request-requestor">Requestor Name:'+requestorId+'</span><span class="card request-items">Items:'+itemStorage+'</span></div>';
				
					//var buttons = '<button class="btn btn card-btn" id="'+requestId+'" onclick="showConfirmModal(this)" id="reqAdd"> Update </button>';
				
				


		}
		/*if(requestStatus.toLowerCase() == "pending"){
			var items = data[1];
			var requestId = data[3];
			var requestNeeded = data[4];
			var requestSent = data[5];
			var requestorId = data[7];
			var itemStorage = '';
			for (var i = 0;i<items.length;i++){
				//limit to three
				if(i < 3){
					itemStorage += '<br>Item: '+ i+'<br> item id: '+data[1][i]["itemID"]+'<br>amount: '+data[1][i]["amount"]+'<br>quantity: '+data[1][i]["quantity"]+'<br>unit '+ data[1][i]["unit"] +'<br>';
				}
				else{
					break;
				}

			}
			
		}*/
	});
}



//double clicking to see more of the request
function seeMoreRequest(request){
	var lab = "chemistry";
	var database = firebase.database().ref(lab + "/request");
	
	//display request matching id
	database.on('child_added',function(snapshot){
		var data = snapshotToArray(snapshot);
		var id = data[3];
		if(id == request.id){
			var status = data[6];
			var requestNeeded = data[4];
			var requestSent = data[5];
			var requestorId = data[7];
			var itemStorage = '';
			for (var i = 0;i<data[1].length;i++){
					itemStorage += '<br>Item: '+ i+'<br> item id: '+data[1][i]["itemID"]+'<br>amount: '+data[1][i]["amount"]+'<br>quantity: '+data[1][i]["quantity"]+'<br>unit: '+ data[1][i]["unit"] +'<br>';
			}
			document.getElementById("modal-request-number").innerHTML += '<br> '+ id;
			document.getElementById("modal-status").innerHTML = status;
			document.getElementById("modal-request-sent").innerHTML += requestSent;
			document.getElementById("modal-request-needed").innerHTML += requestNeeded;
			document.getElementById("modal-userid").innerHTML += requestorId;
			document.getElementById("modal-items").innerHTML += itemStorage;
			$('#seeMore').modal('show');
		}
	});
	

}
//show confirm modal
function showConfirmModal(req){
	var requestId = req.id;
	document.getElementById("confirm-text").innerHTML = "Update Status";
	document.getElementById("confirmStatusChange").setAttribute('name', requestId);
	document.getElementById("confirmStatusChange").setAttribute('onclick','changeStatusOfRequest(this)')
	$('#confirmModal').modal('show');
}
//change status of request from pending to processing
function changeStatusOfRequest(req){
	//console.log(req.name + " is now processing.");
	//assuming lab = chemistry
	var lab = "chemistry";
	var database = firebase.database().ref(lab);
	
	database.child("/request").orderByChild("requestID").equalTo(req.name).once("value").then(function(snapshot){
			snapshot.forEach(function(childSnapshot) {
					var updateThisChild = childSnapshot.key;
					
					console.log(childSnapshot.val().requestID);
					var details = childSnapshot.val().details;
					var requestID = childSnapshot.val().requestID;
					var items = childSnapshot.val().items;
					var proxyID = childSnapshot.val().proxyID;
					var requestNeeded = childSnapshot.val().requestNeeded;
					var requestSent = childSnapshot.val().requestSent;
					var userID = childSnapshot.val().userID;
					var newData = {
						"details": details,
						"requestID": requestID,
						"items": items,
						"proxyID": proxyID,
						"requestNeeded": requestNeeded,
						"requestSent": requestSent,
						"userID": userID,
						"status": "preparing"
					};
					//console.log(updateThisChild);
					var updates = {}
					updates[""+lab+"/request/"+ updateThisChild] = newData;
					firebase.database().ref().update(updates);
			});
	})
}

//
$('.dblProcessing').on('dblclick',function () {
	$('#moreProcessing').modal('toggle');
})
//change dropdown value
$(".dropdown-menu a").click(function(){
  
  $("#status:first-child").html($(this).text()+' <span class="caret"></span>');
  
});
$('#cancelConfirm').click(function(){
	$('#updateModal').modal('show');
	$('#cancelConfirm').modal('hide');
});
$('#confirm').click(function(){
	$("#statusUpdate").val("Preparing");
});
$('#declineMain').click(function(){
	$("#statusUpdate").val("Declined").change();
	document.getElementById("releasedContent").style.display="none";
	document.getElementById("declinedContent").style.display="block";
	document.getElementById("defectiveContent").style.display="none";
	document.getElementById("statusUpdate").style.display="none";
	document.getElementById("statusSpan").style.display="none";
	$('#updateModal').modal('show');
})
$('#submitUpdate').click(function() {
	var status = $('#statusUpdate').val();
	switch (status) { 
		case 'Released': 
			if($("#releaseConfirmUpdate").val() === "true"){
				$('#confirmModal').modal('show');
				$('#updateModal').modal('hide');
			}
			break;
		case 'Defective':
			if($("#releaseConfirmDefective").val() === "true"){
				$('#confirmModal').modal('show');
				$('#updateModal').modal('hide');
			}
			break;
		case 'Declined': 
			if($("#updateDeclineComments").val() != ""){
				$('#confirmModal').modal('show');
				$('#updateModal').modal('hide');
			}
			else{
				$("#declineWarning").html("Can't be blank.");
			}
			break;
		default:
			$('#confirmModal').modal('show');
			$('#updateModal').modal('hide');
	}

});

//status of modal
function update_status(){
	var statusUpdate = document.getElementById("statusUpdate");
	document.getElementById("statusUpdate").style.display="block";
	document.getElementById("statusSpan").style.display="block";
	switch(statusUpdate.options[ statusUpdate.selectedIndex ].value){
	 	case "Released":
	 		document.getElementById("releasedContent").style.display="block";
	 		document.getElementById("declinedContent").style.display="none";
	 		document.getElementById("defectiveContent").style.display="none";
	 		break;
	 	case "Defective":
	 		document.getElementById("releasedContent").style.display="none";
	 		document.getElementById("declinedContent").style.display="none";
	 		document.getElementById("defectiveContent").style.display="block";
	 		break;
	 	case "Declined":
	 		document.getElementById("releasedContent").style.display="none";
	 		document.getElementById("declinedContent").style.display="block";
	 		document.getElementById("defectiveContent").style.display="none";
	 		break;
	 	default:
	 		document.getElementById("releasedContent").style.display="none";
	 		document.getElementById("declinedContent").style.display="none";
	 		document.getElementById("defectiveContent").style.display="none";
	}
}

//allow submit??
/*function allowSubmit(){
	var currentStatus = document.getElementById('statusUpdate').value
	if (currentStatus == "Released"){
		if (document.getElementById('radio3').checked ==true){

		}
	}
}*/
window.setTimeout(function () {
    $(".alert-success").fadeTo(500, 0).slideUp(500, function () {
        $(this).remove();
    });
}, 5000);
function notOther(){
	document.getElementById('studentIdWarning').innerHTML = "";
	document.getElementById('releaseConfirmUpdate').value= "true";
}
//check if the other option is correct.
function releasedOtherCheck(){
	document.getElementById('radio3').checked = true;
	var student_id = document.getElementById("student_id").value;
	if (student_id.length == 10 ){
		var splits = student_id.split(/(-)/);
	    if (splits.length == 3){
	     	var year = splits[0];
	      	var id = splits[2];
			var yearpattern = /^20[0-1][0-8]$/;
			var idpattern = /^[0-9]{5}$/;
			var idFound = id.match(idpattern);
			var yearFound = year.match(yearpattern);
			if (!idFound){
				document.getElementById("studentIdWarning").innerHTML = "Invalid unique id.";
				document.getElementById('releaseConfirmUpdate').value = "false";
				//console.log(id);
			}
			else if (!yearFound){
				document.getElementById("studentIdWarning").innerHTML = "Invalid year.";
				document.getElementById('releaseConfirmUpdate').value = "false";
			}
			else{
				document.getElementById("studentIdWarning").innerHTML = "";
				document.getElementById("releaseConfirmUpdate").value = "true";
			}
		}
	}
	else{
		document.getElementById("studentIdWarning").innerHTML = "Something missing. Format: 20XX-XXXX";
		document.getElementById('releaseConfirmUpdate').value = "false";
		//console.log(student_id.length)
	}

}
//adding more items for defective list
function defectiveAddItem(){
	var table = document.getElementById("defectiveTable");
    var totalRowCount = countDefectiveTable();

    var row = table.insertRow(totalRowCount);
    var item = row.insertCell(0);
    var qty = row.insertCell(1);
    var status = row.insertCell(2);
    var del = row.insertCell(3);
    item.innerHTML = '<select class="form-control">  <option>Item 1</option>  <option>Item 2</option>  <option>Item 3</option>  <option>Item 4</option>  <option>Item 5</option></select>';
    qty.innerHTML = '<select class="form-control">  <option>1</option>  <option>2</option>  <option>3</option>  <option>4</option>  <option>5</option></select>';
    status.innerHTML = '<div class="form-check-inline">  <label class="form-check-label">    <input type="radio" class="form-check-input" name="optradio'+totalRowCount+'">Missing  </label></div><div class="form-check-inline">  <label class="form-check-label">    <input type="radio" class="form-check-input" name="optradio'+totalRowCount+'">Defective  </label></div></center>';
    del.innerHTML = '<button id="'+totalRowCount+'" onclick="defectiveDeleteItem(id)" class="btn-light btn">X</button>';

}
function defectiveDeleteItem(row){
	var count = countDefectiveTable();
	console.log("row" + row);

	if (count==2){
		document.getElementById("defectiveTableWarning").innerHTML = "Can't delete all the items.";
	}
	else{
		document.getElementById("defectiveTable").deleteRow(row);
		updateDefectiveTable();
	}
}
function updateDefectiveTable(){
	console.log("table count " + countDefectiveTable());
	var table = document.getElementById("defectiveTable");
    var rowCount = 1;
    var rows = table.getElementsByTagName("tr")
    for (var i = 1; i < rows.length; i++) {
        var btn = rows[i].getElementsByTagName("button")[0]
        btn.id = rowCount;
        rowCount++;
    }
}

function countDefectiveTable(){
	var table = document.getElementById("defectiveTable");
	var totalRowCount = 0;
    var rowCount = 0;
    var rows = table.getElementsByTagName("tr")
    for (var i = 0; i < rows.length; i++) {
        totalRowCount++;
        if (rows[i].getElementsByTagName("td").length > 0) {
            rowCount++;
        }
    }

    document.getElementById("defectiveTableWarning").innerHTML = "";
    return totalRowCount;

}

function quantityLimiter(){

}
//adding a request//
/*
var db = firebase.database();
var reqRef = db.ref("requests");

document.getElementById('reqAdd').addEventListener("click",addRequest);
function addRequest(){
	var req = "This is a request";
	
	var reqData = {
		status: "pending",
		request_sent: "10/24/18 4:00PM",
		request_needed: "10/26/18 1:00PM",
		requestor_name: "Name Isreal",
		items: "Item 1, Item 2, Item 3"};
	reqRef.push(reqData);
	console.log(req);
}*/

