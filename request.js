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
	// 0 : defective if there is, then +1 to others
	// 0 : details
	// 1 : history
	// 2 : items
	// 3 : proxyID
	// 4 : request ID
	// 5 : request needed
	// 6 : request sent
	// 7 : status
	// 8 : user id
	//display requests based on parameter "status"
	switch(status){
		case "others": document.getElementById("processing-items-div-pcd").innerHTML = ""; break;
		case "declined": document.getElementById("declined-items-div-pcd").innerHTML = ""; break;
		case "pending": document.getElementById("pending-items-div-pcd").innerHTML = ""; break;
		case "complete": document.getElementById("completed-items-div-pcd").innerHTML = ""; break;  
	}
	database.on('child_added',function(snapshot){
		var data = snapshotToArray(snapshot);
		var count = 0
		//console.log(data)
		if (data.length == 9){
			count = 1
		}
		var requestStatus = data[count+6];
		//alert(requestStatus)
		console.log("STATUS:"+ status.toLowerCase() + data)
		var items = data[count+1];
		var requestId = data[count+3];
		var requestNeeded = data[count+4];
		var requestSent = data[count+5];
		var requestorId = data[count+7];
		var itemStorage = '';
		console.log(data[count+1].length + " items length")
		switch(status.toLowerCase()){
			case "pending":
				if(requestStatus.toLowerCase() == "pending"){
					console.log('opening pending tab')
					itemStorage = '<tr><th></th><th width="20%"></th><th width="70%"></th></tr>'
					for (var i = 0;i<items.length;i++){
						//limit item display to three
						if(i < 3){
							var itemID = data[count+1][i]["itemID"].split("-")[0];
							if(itemID == "gla"){
								
								itemStorage += '<tr><td align="right">'+data[count+1][i]["quantity"] +'</td><td>pc/s</td><td>'+data[count+1][i]["name"]+'</td></tr>';
								//itemStorage += '<br>Item: '+ i+'<br> item id: '+data[count+1][i]["name"]+'<br>quantity: '+data[count+1][i]["quantity"]+'<br>';
							}else{
								itemStorage += '<tr><td align="right">'+data[count+1][i]["amount"] +'</td><td>'+data[count+1][i]["unit"]+'</td><td>'+data[count+1][i]["name"]+'</td></tr>';
								//itemStorage += '<br>Item: '+ i+'<br> item id: '+data[count+1][i]["name"]+'<br>amount: '+data[count+1][i]["amount"]+'<br>unit '+ data[count+1][i]["unit"] +'<br>';
							}
						} 
						else{
							break;
						}
					} 

					var container = document.getElementById('pending-items-div-pcd');
					container.innerHTML += '<div class="card-div-pending rounded" id="'+requestId+'" ondblclick="seeMoreRequest(this)"><span class="card status">'+ requestStatus + '</span><span class="card request-number">Request Number: '+requestId+'</span><span class="card request-sent">Request Sent: '+formatTimestamp(requestSent)+'</span><span class="card request-needed">Request Needed: 	'+formatTimestamp(requestNeeded)+'</span><span class="card request-requestor">Requestor Name: '+requestorId+'</span><span class="card request-items">Items:<br><table width="50%">'+itemStorage+'</table></span><button type="button" class="btn btn-info btn card-btn" id="'+requestId+'" value="declined" onclick="showUpdateModal(this)"> Decline </button><button class="btn btn card-btn" name="'+requestId+'" value="processing" onclick="showConfirmModal(name,value)"> Process </button></div>';
				}
				break;
			case "declined":
				console.log('opening declined tab')
				if(requestStatus.toLowerCase() == "declined" ){
					itemStorage = '<tr><th></th><th width="20%"></th><th width="70%"></th></tr>'
					for (var i = 0;i<items.length;i++){
						//limit item display to three
						if(i < 3){
							var itemID = data[count+1][i]["itemID"].split("-")[0];
							if(itemID == "gla"){
								
								itemStorage += '<tr><td align="right">'+data[count+1][i]["quantity"] +'</td><td>pc/s</td><td>'+data[count+1][i]["name"]+'</td></tr>';
								//itemStorage += '<br>Item: '+ i+'<br> item id: '+data[count+1][i]["name"]+'<br>quantity: '+data[count+1][i]["quantity"]+'<br>';
							}else{
								itemStorage += '<tr><td align="right">'+data[count+1][i]["amount"] +'</td><td>'+data[count+1][i]["unit"]+'</td><td>'+data[count+1][i]["name"]+'</td></tr>';
								//itemStorage += '<br>Item: '+ i+'<br> item id: '+data[count+1][i]["name"]+'<br>amount: '+data[count+1][i]["amount"]+'<br>unit '+ data[count+1][i]["unit"] +'<br>';
							}
						} 
						else{
							break;
						}
					} 
				var container = document.getElementById('declined-items-div-pcd');
					container.innerHTML += '<div class="card-div-pending rounded" id="'+requestId+'" ondblclick="seeMoreRequest(this)"><span class="card status">'+ requestStatus + '</span><span class="card request-number">Request Number: '+requestId+'</span><span class="card request-sent">Request Sent: '+formatTimestamp(requestSent)+'</span><span class="card request-needed">Request Needed: 	'+formatTimestamp(requestNeeded)+'</span><span class="card request-requestor">Requestor Name: '+requestorId+'</span><span class="card request-items">Items:<br><table width="50%">'+itemStorage+'</table></span></div>';
				
					//var buttons = '<button class="btn btn card-btn" id="'+requestId+'" onclick="showConfirmModal(this)" id="reqAdd"> Update </button>';
				}
				break;
			case "complete":
				console.log('opening complete tab')
				if(requestStatus.toLowerCase() == "complete" ){
					itemStorage = '<tr><th></th><th width="20%"></th><th width="70%"></th></tr>'
					for (var i = 0;i<items.length;i++){
						//limit item display to three
						if(i < 3){
							var itemID = data[count+1][i]["itemID"].split("-")[0];
							if(itemID == "gla"){
								
								itemStorage += '<tr><td align="right">'+data[count+1][i]["quantity"] +'</td><td>pc/s</td><td>'+data[count+1][i]["name"]+'</td></tr>';
								//itemStorage += '<br>Item: '+ i+'<br> item id: '+data[count+1][i]["name"]+'<br>quantity: '+data[count+1][i]["quantity"]+'<br>';
							}else{
								itemStorage += '<tr><td align="right">'+data[count+1][i]["amount"] +'</td><td>'+data[count+1][i]["unit"]+'</td><td>'+data[count+1][i]["name"]+'</td></tr>';
								//itemStorage += '<br>Item: '+ i+'<br> item id: '+data[count+1][i]["name"]+'<br>amount: '+data[count+1][i]["amount"]+'<br>unit '+ data[count+1][i]["unit"] +'<br>';
							}
						} 
						else{
							break;
						}
					} 
				var container = document.getElementById('completed-items-div-pcd');
					container.innerHTML += '<div class="card-div-pending rounded" id="'+requestId+'" ondblclick="seeMoreRequest(this)"><span class="card status">'+ requestStatus + '</span><span class="card request-number">Request Number: '+requestId+'</span><span class="card request-sent">Request Sent: '+formatTimestamp(requestSent)+'</span><span class="card request-needed">Request Needed: 	'+formatTimestamp(requestNeeded)+'</span><span class="card request-requestor">Requestor Name: '+requestorId+'</span><span class="card request-items">Items:<br><table width="50%">'+itemStorage+'</table></span></div>';
				
					//var buttons = '<button class="btn btn card-btn" id="'+requestId+'" onclick="showConfirmModal(this)" id="reqAdd"> Update </button>';
				}
				break;
			default:
				console.log('opening processing tab')
				if((requestStatus != 'declined') && (requestStatus != 'complete') && (requestStatus != 'pending')){
					//display processing cards
					itemStorage = '<tr><th></th><th width="20%"></th><th width="70%"></th></tr>'
					for (var i = 0;i<items.length;i++){
						//limit item display to three
						if(i < 3){
							var itemID = data[count+1][i]["itemID"].split("-")[0];
							if(itemID == "gla"){
								itemStorage += '<tr><td align="right">'+data[count+1][i]["quantity"] +'</td><td>pc/s</td><td>'+data[count+1][i]["name"]+'</td></tr>';
								//itemStorage += '<br>Item: '+ i+'<br> item id: '+data[count+1][i]["name"]+'<br>quantity: '+data[count+1][i]["quantity"]+'<br>';
							}else{
								itemStorage += '<tr><td align="right">'+data[count+1][i]["amount"] +'</td><td>'+data[count+1][i]["unit"]+'</td><td>'+data[count+1][i]["name"]+'</td></tr>';
								//itemStorage += '<br>Item: '+ i+'<br> item id: '+data[count+1][i]["name"]+'<br>amount: '+data[count+1][i]["amount"]+'<br>unit '+ data[count+1][i]["unit"] +'<br>';
							}
							
						} 
						else{
							break;
						}
					} 
					var container = document.getElementById('processing-items-div-pcd');
						container.innerHTML += '<div class="card-div-pending rounded" id="'+requestId+'" ondblclick="seeMoreRequest(this)"><span class="card status">'+ requestStatus + '</span><span class="card request-number">Request Number: '+requestId+'</span><span class="card request-sent">Request Sent: '+formatTimestamp(requestSent)+'</span><span class="card request-needed">Request Needed: 	'+formatTimestamp(requestNeeded)+'</span><span class="card request-requestor">Requestor Name: '+requestorId+'</span><span class="card request-items">Items:<br><table width="50%">'+itemStorage+'</table></span><button class="btn btn card-btn" id="'+requestId+'" value="'+data[count+6]+'" onclick="showUpdateModal(this)"> Update </button></div>';
				}
		}
		
	});
}



//double clicking to see more of the request
function seeMoreRequest(card){
	var lab = "chemistry";
	var database = firebase.database().ref(lab + "/request");
	
	//clear previous see more
	document.getElementById("seeMoreRequestModalTitle").innerHTML = "Request #"+card.id;
	document.getElementById("modal-request-number").innerHTML ="Request Number: "+card.id;
	document.getElementById("modal-request-sent").innerHTML = "Request Sent:  " ;
	document.getElementById("modal-request-needed").innerHTML = "Request Needed:  " ;
	document.getElementById("modal-userid").innerHTML = "Requestor Name:  ";
	document.getElementById("modal-items").innerHTML = "Items: ";
	// 0 : defective +1 on others
	// 0 : details
	// 1 : history
	// 2 : items
	// 3 : proxyID
	// 4 : request ID
	// 5 : request needed
	// 6 : request sent
	// 7 : status
	// 8 : user id
	//display request matching id
	var database = firebase.database().ref(lab);
	database.child("/request").orderByChild("requestID").equalTo(card.id).once("value").then(function(snapshot){
			snapshot.forEach(function(childSnapshot) {
				var data = snapshotToArray(childSnapshot);
				count = 0
				if (data.length == 9){
					count = 1;
				}
				document.getElementById("modal-status").innerHTML = data[count+6];
				document.getElementById("modal-request-sent").innerHTML += data[count+5];
				document.getElementById("modal-request-needed").innerHTML += data[count+4];
				document.getElementById("modal-userid").innerHTML += data[count+7];


				var itemStorage = '<br><tr><th></th><th width="20%"></th><th width="70%"></th></tr>'
					for (var i = 0;i<data[count+1].length;i++){
						var itemID = data[count+1][i]["itemID"].split("-")[0];
						if(itemID == "gla"){
							itemStorage += '<tr><td align="right">'+data[count+1][i]["quantity"] +'</td><td>pc/s</td><td>'+data[count+1][i]["name"]+'</td></tr>';
							//itemStorage += '<br>Item: '+ i+'<br> item id: '+data[count+1][i]["name"]+'<br>quantity: '+data[count+1][i]["quantity"]+'<br>';
						}else{
							itemStorage += '<tr><td align="right">'+data[count+1][i]["amount"] +'</td><td>'+data[count+1][i]["unit"]+'</td><td>'+data[count+1][i]["name"]+'</td></tr>';
							//itemStorage += '<br>Item: '+ i+'<br> item id: '+data[count+1][i]["name"]+'<br>amount: '+data[count+1][i]["amount"]+'<br>unit '+ data[count+1][i]["unit"] +'<br>';
						}	
					} 
				
				document.getElementById("modal-items").innerHTML += '<center><table width=80%>'+ itemStorage + '</table></center>';

			});
	});
	//sent = document.getElementById("modal-request-sent").innerHTML
	//console.log("sent "+sent)
	//document.getElementById("modal-request-sent").innerHTML = "Request Sent:  " + formatTimestamp(sent);
	/*document.getElementById("modal-request-needed").innerHTML = "Request Needed: 	 " + formatTimestamp(document.getElementById("modal-request-needed").innerHTML);;
*/
	$('#seeMore').modal('show');
	
	

}

//format dates
function getFormattedDateNow() {
    var date = new Date();
    var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    return str;
}
function getDayofWeek(date){
	var date = new Date(date).getDay();
	return isNaN(date) ? null : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date];
}
function getMonth(date){
	return ['January','February','March','April','May','June','July','August','September','October','November','December'][date-1];
}
function formatTimestamp(timestamp){
	console.log(timestamp)
	var res = timestamp.split(" ");
	var date = res[0];
	var time = res[1];

	var date = date.split("-")

	//var dayOfWeek = new Date(date).getDay();    
  	var day = getDayofWeek(date);

  	var month = getMonth(parseInt(date[1]));

  	var time = time.split(":");
  	if(parseInt(time[0])>=13){
  		time[0] = parseInt(time[0])-12;
  		time[2] = 'PM';
  	}
  	else if(parseInt(time[0])==0){
  		time[0] = 12;
  		time[2] = 'AM';
  	}else{
  		time[2] = 'AM'
  	}

  	console.log(day + ", " + month + " " + date[2] + " " + time[0]+":"+time[1]+" "+time[2])
  	return day + ", " + month + " " + date[2] + " " + time[0]+":"+time[1]+" "+time[2];
}
//show confirm modal
function showConfirmModal(requestId, text){
	console.log("confirm modal triggered")
	//var requestId = req.name;
	//var text = req.value;
	if (text != ""){
		console.log('text val not null')
		if (text == "Defective"){
			document.getElementById("confirm-text").innerHTML = "Update Defective Items";
		}
		else{
			document.getElementById("confirm-text").innerHTML = "Update Status to "+ text;	
		}
		document.getElementById("confirmStatusChange").setAttribute('name', requestId);
		document.getElementById("confirmStatusChange").setAttribute('value', text.toLowerCase());
		document.getElementById("confirmStatusChange").setAttribute('onclick','changeStatusOfRequest(this)')
		$('#confirmModal').modal('show');
	}
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
					
					var details = childSnapshot.val().details;
					var requestID = childSnapshot.val().requestID;
					var items = childSnapshot.val().items;
					var proxyID = childSnapshot.val().proxyID;
					var requestNeeded = childSnapshot.val().requestNeeded;
					var requestSent = childSnapshot.val().requestSent;
					var userID = childSnapshot.val().userID;
					var status = childSnapshot.val().status;
					var status = "";
					var new_proxy = "";
					//get currently logged in user
					var staffID = 1;
					console.log("STATS" +req.value)
					if (req.value.toLowerCase() == "declined"){
						var details = $("#updateDeclineComments").val()
						//var newHistory = history + " " + getFormattedDateNow() + " // Request updated to Declined by " + staffID + ",";
						//console.log(newHistory)
						status = "declined";
						
						console.log('udpated to declined');
						document.getElementById(requestID).hidden = true;
					}
					else if (req.value.toLowerCase() == "ready"){
						console.log('udpated to ready')
						if((status == "declined") || (status == "pending")){
							document.getElementById(requestID).hidden = true;
						}else{
							document.getElementById(requestID).hidden = true;
							document.getElementById(requestID).getElementsByClassName('status').innerHTML= "ready";
							document.getElementById(requestID).hidden = false;
						}
						status = "ready";
					}
					else if (req.value.toLowerCase() == "complete" || req.value.toLowerCase() == "completed"){
						console.log('udpated to complete');
						document.getElementById(requestID).hidden = true;
						status = "complete";
						
					}
					else if (req.value.toLowerCase() == "released"){
						if(document.getElementById('radio3').checked == true){
							proxyID = document.getElementById("student_id").value
						}else if(document.getElementById('radio1').checked == true){
							proxyID = userID
						}
						console.log('updated to released')
						if((status == "declined") || (status == "pending")){
							document.getElementById(requestID).hidden = true;
						}else{
							document.getElementById(requestID).getElementsByClassName('status').innerHTML = "released";
						}
						status = "released"
					}
					else if (req.value.toLowerCase() == "defective"){
						console.log('defective validated')
						status = "defective";
						defectiveData = retrieveDefectiveData();
						defective = defectiveData[0];
						action = defectiveData[1];
					}
					else{
						status = "preparing"
					}
					if(status == "defective"){
						firebase.database().ref(""+lab+"/request/"+updateThisChild+"/status").set(status);
						firebase.database().ref(""+lab+"/request/"+updateThisChild+"/defective").set(defective);
						
						possibly_new_details = document.getElementById("defective-comments").value
						if(possibly_new_details != details){
							firebase.database().ref(""+lab+"/request/"+updateThisChild+"/details").set(possibly_new_details);
							updateRequestHistory(requestID,"Updated defective and missing list to: "+ action + "<br>Comments updated to: "+possibly_new_details);

						}else{							
							updateRequestHistory(requestID,"Updated defective and missing list to: "+ action);
					
						}
							
					}else{
							var newData = {
							"details": details,
							"requestID": requestID,
							"items": items,
							"proxyID": proxyID,
							"requestNeeded": requestNeeded,
							"requestSent": requestSent,
							"userID": userID,
							"status": status
						};
						var updates = {}
						updates[""+lab+"/request/"+ updateThisChild] = newData;
						firebase.database().ref().update(updates);
						updateRequestHistory(requestID,"Updated request status from "+childSnapshot.val().status+" to "+ status);
					
						}
					changeStatusDisplay(requestID,status)
					//console.log(updateThisChild);
					
			});
	})
}
//update request history
function updateRequestHistory(historyID,action){
	var user = firebase.auth().currentUser;
	var uid = user.uid
	//asume lab = chemistry
	var lab = "chemistry";
	var database = firebase.database().ref(lab);
	console.log("hehehe "+ historyID + " asdsad action: "+action)

	database.child("/history").orderByChild("historyID").equalTo(historyID).once("value").then(function(snapshot){
			snapshot.forEach(function(childSnapshot) {
					console.log("hehehe hist");
					var updateThisChild = childSnapshot.key;

					var timestamp = firebase.firestore.Timestamp.fromDate(new Date()).toDate();
					dateParts = (timestamp.toString()).split(" ");

					var additionalAction = {
							"user": uid,
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
	});



}

//change status
function changeStatusDisplay(requestID,status){
	//var card = document.getElementById(requestID).children
	var myList = document.getElementById(requestID);
	var myListItems = myList.getElementsByTagName('span');
	var cardButton = myList.getElementsByTagName('button');
	console.log(requestID)
	cardButton[0].value = status
	myListItems[0].innerHTML = status;
	 

}
//show update modal
function showUpdateModal(requestId){
	status = requestId.value
	console.log("showupdatemodal status value: "+ status);
	document.getElementById("defectiveTitle").style.display="none";
	switch(status){
		case 'declined':
			document.getElementById("statusUpdate").selectedIndex = "5";			
			document.getElementById("releasedContent").style.display="none";
			document.getElementById("declinedContent").style.display="block";
			document.getElementById("defectiveContent").style.display="none";
			break;
		case 'ready':
			document.getElementById("statusUpdate").selectedIndex = "1";
			document.getElementById("releasedContent").style.display="none";
			document.getElementById("declinedContent").style.display="none";
			document.getElementById("defectiveContent").style.display="none";
			break;
		case 'released':
			document.getElementById("statusUpdate").selectedIndex = "2";
			//hasAuthorized(requestId.id)
			document.getElementById("releasedContent").style.display="block";
			document.getElementById("declinedContent").style.display="none";
			document.getElementById("defectiveContent").style.display="none";
			break;
		case 'defective':
			document.getElementById("statusUpdate").selectedIndex = "3";
			document.getElementById("releasedContent").style.display="none";
			document.getElementById("declinedContent").style.display="none";
			document.getElementById("defectiveContent").style.display="block";
			document.getElementById("moreitemsbtn").value = requestId.id;
			document.getElementById("defective-comments").value = "";
			defectiveGetItems(requestId.id)
			break;
		case 'completed':
		case 'complete':
			document.getElementById("statusUpdate").selectedIndex = "4";
			document.getElementById("releasedContent").style.display="none";
			document.getElementById("declinedContent").style.display="none";
			document.getElementById("defectiveContent").style.display="none";
			break;
		default:
			document.getElementById("statusUpdate").selectedIndex = "0";		
			document.getElementById("releasedContent").style.display="none";
			document.getElementById("declinedContent").style.display="none";
			document.getElementById("defectiveContent").style.display="none";
			break;
	}

	//change confirm name to request id
	console.log("show req.id")
	console.log(requestId.id)
	document.getElementById("statusUpdate").setAttribute('name', requestId.id);
	document.getElementById("submitUpdate").setAttribute('name', requestId.id);
	$('#updateModal').modal('show');
}

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


function submitUpdate(req){
	var status = document.getElementById("statusUpdate").selectedIndex;
	var id = req.name;
	document.getElementById("defectiveTitle").style.display="none";
	switch(status){
		case 0:
			console.log('preparing');
			document.getElementById("submitUpdate").setAttribute('value','Preparing');
			showConfirmModal(id,'Preparing');
			$('#updateModal').modal('hide');
			break;
		case 1:
			console.log('ready');
			document.getElementById("submitUpdate").setAttribute('value','Ready');
			showConfirmModal(id,'Ready');
			$('#updateModal').modal('hide');			
			break;
		case 2:
			console.log('released');
			//insert released checker here//
			if(document.getElementById("releaseConfirmUpdate").value === "true"){
				console.log(id);
				document.getElementById("submitUpdate").setAttribute('value','Released');
				showConfirmModal(id,'Released');
				$('#updateModal').modal('hide');
			}
			break;
		case 3:
			console.log('defective');
			//insert defective checker here//
			switch(validateDefective()){
				case "items": document.getElementById("defectiveTableWarning").innerHTML = "Choose an item."; break;
				case "qty" : document.getElementById("defectiveTableWarning").innerHTML = "Invalid quantity number."; break;
				case "status": document.getElementById("defectiveTableWarning").innerHTML = "Check type of item status (missing or defective)"; break;
				default: document.getElementById("submitUpdate").setAttribute('value','Defective');
					showConfirmModal(id,'Defective');
					$('#updateModal').modal('hide');
			}
			
			break;
		case 4:
			console.log('ok');
			//insert complete checker here in case of defects//
			document.getElementById("submitUpdate").setAttribute('value','Complete');
			showConfirmModal(id,'Complete');
			$('#updateModal').modal('hide');
			break;
		case 5:
			console.log('declined');
			if($("#updateDeclineComments").val() != ""){
				console.log(id);
				document.getElementById("submitUpdate").setAttribute('value','Declined');
				showConfirmModal(id,'Declined');
				$('#updateModal').modal('hide');
				$("#declineWarning").html("");
			}
			else{
				$("#declineWarning").html("Can't be blank.");
			}
			break;

	}
}
$('#submitsUpdate').click(function() {
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
				showConfirmModal()
				//$('#confirmModal').modal('show');
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
function update_status(request){
	var requestId = request.name
	console.log('update status req id: '+requestId)
	var statusUpdate = document.getElementById("statusUpdate");
	document.getElementById("statusUpdate").style.display="block";
	document.getElementById("statusSpan").style.display="block";
	document.getElementById("defectiveTitle").style.display="none";
	document.getElementById("submitUpdate").disabled = false;
	switch(statusUpdate.options[ statusUpdate.selectedIndex ].value){
	 	case "Released":
	 		hasAuthorized(requestId);
	 		document.getElementById("releasedContent").style.display="block";
	 		document.getElementById("declinedContent").style.display="none";
	 		document.getElementById("defectiveContent").style.display="none";
	 		break;
	 	case "Defective":
	 		document.getElementById("releasedContent").style.display="none";
	 		document.getElementById("declinedContent").style.display="none";
	 		document.getElementById("defectiveContent").style.display="block";
	 		console.log("defective id " + requestId)
			document.getElementById("moreitemsbtn").value = requestId;
			defectiveGetItems(requestId)
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

function hasAuthorized(requestId){
	//checks if request has set anyone to claim other than requestor
	//assuming lab = chemistry
	var lab = "chemistry";
	var database = firebase.database().ref(lab);
	console.log('checking autho + req' + requestId)
	database.child("/request").orderByChild("requestID").equalTo(requestId).once("value").then(function(snapshot){
			snapshot.forEach(function(childSnapshot) {
					var updateThisChild = childSnapshot.key;
					
					console.log('checking if has authorized others');
					var proxyID = childSnapshot.val().proxyID;
					console.log("proxy: "+ proxyID);
					if (proxyID == "null"){
						document.getElementById('radio2').hidden = true;
					}else{
						document.getElementById('radio2').hidden = false;
					}
			});
	})

}
function notOther(chosen){
	document.getElementById('studentIdWarning').innerHTML = "";
	document.getElementById('student_id').name = chosen;
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
//get glassware name
//RESOLVE THIS!!!!!
function getItemName(itemID){
	//assuming lab = chemistry
	var lab = "chemistry";
	switch(itemID.split("-")[0]){
		case "gla": category = "/glassware"; break;
		case "org": category = "/organic"; return "ORG"; break;
		case "acid": category = "/acid"; return "ACID"; break;
		default: return "UNDEFINED";
	}
	console.log("AAAA????")
	var name = []
	var database = firebase.database().ref(lab);
	database.child("/glassware").orderByChild("id").equalTo(itemID).once("value").then(function(snapshot){
			snapshot.forEach(function(childSnapshot) {
					var data = snapshotToArray(childSnapshot);
					console.log("glassware: "+ data[3])
					return data[3];
			});
	});
}
//get glassware items in request
function defectiveGetItems(requestID){
	//assuming lab = chemistry
	var lab = "chemistry";
	var items;
	var list = [];
	//clear any defective table
	var df = countDefectiveTable();
	//alert(df)
	if (df > 1){
		for(i = df-1; i>=1;i--){
			document.getElementById("defectiveTable").deleteRow(i);
		}
	}
	document.getElementById("defective-comments").value = ""
	var database = firebase.database().ref(lab);
	console.log('getting glassware items in request id: ' + requestID);
	database.child("/request").orderByChild("requestID").equalTo(requestID).once("value").then(function(snapshot){
			snapshot.forEach(function(childSnapshot) {
					var data = snapshotToArray(childSnapshot);
					items = data[0]
					
					console.log("asd")
					if(data.length == 9){
						document.getElementById("defective-comments").value = data[1]
						var table = document.getElementById("defectiveTable");
					    var max = document.getElementById("maxItems")
					    max.innerHTML = ""

					    for(i=0;i<=data[2].length-1;i++){
					    	if (data[2][i]["itemID"].split('-')[0] ==  "gla"){
					    		max.innerHTML += data[2][i]["name"]+":"+data[2][i]["quantity"]+",";
					    		//data[0][i]["name"]+":"+data[0][i]["max"]+",";
					    		
					    	}
					    }
					    for (i=0;i<=data[0].length-1;i++){
					    	//max.innerHTML += data[0][i]["name"]+":"+data[0][i]["max"]+",";
					    	for(j=0;j<=data[0][i]["items"].length-1;j++){
					    		var totalRowCount = countDefectiveTable();
							    var row = table.insertRow(totalRowCount);
							    var item = row.insertCell(0);
					    		var qty = row.insertCell(1);
							    var status = row.insertCell(2);
					    		var del = row.insertCell(3);	
					    		console.log(data[0][i]["items"][0]["quantity"] + " "+requestID)
					    		var options = ""
					    		for(k = 0; k<data[2].length;k++){
					    			if(data[0][i]["id"] != data[2][k]['itemID'] && data[2][k]['itemID'].split("-")[0] == "gla"){
					    				options+= '<option>'+data[2][k]['name']+'</option>';
					    			}
					    		}
					    		item.innerHTML += '<select id="defectiveitems'+totalRowCount+'" onchange="updateItem(id)" class="form-control" style="overflow:hidden"><option>'+data[0][i]["name"]+'</option>'+options+'</selected>';
					    		qty.innerHTML += '<select id="defectivequantities'+totalRowCount+'" onclick="updateQty(id)" class="form-control" style="overflow:hidden"><option>'+data[0][i]["items"][j]["quantity"]+'</option></selected>';
					    		if (data[0][i]["items"][j]["status"] == "missing"){
					    			status.innerHTML = '<div class="custom-controls-stacked"><label class="custom-control custom-radio"><input id="missing'+totalRowCount+'" name="radio-stacked'+totalRowCount+'" type="radio" class="custom-control-input" checked><span class="custom-control-indicator"></span><span class="custom-control-description" >Missing</span></label><label class="custom-control custom-radio"><input id="defective'+totalRowCount+'" name="radio-stacked'+totalRowCount+'" type="radio" class="custom-control-input"><span class="custom-control-indicator"></span><span class="custom-control-description">Defective</span></label></div>'
					    			//'<form name="defectivestatus"><div class="form-check-inline custom-controls-stacked"><label class="form-check-label"><input type="radio" class="form-check-input" name="optradio'+totalRowCount+'" checked>Missing</label></div><div class="form-check-inline"><label class="form-check-label"><input type="radio" class="form-check-input" name="optradio'+totalRowCount+'">Defective</label></div></form></center>';
					    		    
					    		}else{
					    			status.innerHTML = '<div class="custom-controls-stacked"><label class="custom-control custom-radio"><input id="missing'+totalRowCount+'" name="radio-stacked'+totalRowCount+'" type="radio" class="custom-control-input" ><span class="custom-control-indicator"></span><span class="custom-control-description" >Missing</span></label><label class="custom-control custom-radio"><input id="defective'+totalRowCount+'" name="radio-stacked'+totalRowCount+'" type="radio" class="custom-control-input" checked><span class="custom-control-indicator"></span><span class="custom-control-description">Defective</span></label></div>'
					    			//status.innerHTML = '<div class="form-check-inline custom-controls-stacked"><label class="form-check-label"><input type="radio" class="form-check-input" name="optradio'+totalRowCount+' ">Missing</label></div><div class="form-check-inline"><label class="form-check-label"><input type="radio" class="form-check-input" name="optradio'+totalRowCount+'" checked>Defective</label></div></center>';
					    		}
   								del.innerHTML = '<button id="'+totalRowCount+'" onclick="defectiveDeleteItem(id)" class="btn-light btn"><i class="fa fa-trash"></i></button>';
					    		updateDefectiveTable();
					    	}
					    }
					    document.getElementById("moreItemStatus").innerHTML ='<button tabindex="0" class="btn btn-info" data-toggle="popover" data-trigger="focus" title="Available Items:" data-content="'+max.innerHTML+'"><i style="font-size:25px;" class="fas fa-info-circle"></i></button>'
					    $('[data-toggle="popover"]').popover({placement: "bottom"});   
						$('.popover-dismiss').popover({
	  						trigger: 'focus'
						});
					    //='<button type="button" class="btn btn-secondary" data-container="body" data-toggle="popover" data-placement="bottom" data-content="aa">'+max.innerHTML+'</button>'
					    list = ["1"]
					}

					else{
						var table = document.getElementById("defectiveTable");
					    var max = document.getElementById("maxItems")
					    max.innerHTML = ""

					    for(i=0;i<=data[1].length-1;i++){
					    	if (data[1][i]["itemID"].split('-')[0] ==  "gla"){
					    		max.innerHTML += data[1][i]["name"]+":"+data[1][i]["quantity"]+",";
					    		//data[0][i]["name"]+":"+data[0][i]["max"]+",";
					    		
					    	}
					    }
					    if (max.innerHTML == ""){
					    	console.log("empty, no glassware")
							list="";
					    }else{
					    	document.getElementById("moreItemStatus").innerHTML ='<button tabindex="0" class="btn btn-info" data-toggle="popover" data-trigger="focus" title="Available Items:" data-content="'+max.innerHTML+'"><i style="font-size:25px;" class="fas fa-info-circle"></i></button>'
						    $('[data-toggle="popover"]').popover({placement: "bottom"});   
							$('.popover-dismiss').popover({
		  						trigger: 'focus'
							});
						    console.log("no defective");
							defectiveAddItem(requestID);
							list=['1']
					    }
					    
						
						/*for (var i = 0;i<items.length;i++){
							var temp = items[i]["itemID"].split("-")
							if(temp[0] == 'gla'){
								console.log("added")
								list +={
									"name": getSpecificGlassware(items[i]["itemID"]),
									"id": items[i]["itemID"],
									"quantity": items[i]["quantity"]
								}
							}else{
								console.log('item not added bcs not glassware');
							}
						}*/
					}
						
					console.log('YELLING')
					defectiveSorter(list)
					//getDefectiveofRequest(requestID)
		});
	});
}

function dropGlasswares(){
	console.log("dropping glasswares...");


}

function getSpecificGlassware(itemID){
	//assuming lab == chem
	var lab = "chemistry";
	var database = firebase.database().ref(lab);
	database.child("/glassware").orderByChild("id").equalTo(itemID).once("value").then(function(snapshot){
			snapshot.forEach(function(childSnapshot) {
					var data = snapshotToArray(childSnapshot);
					return data[count+3]
			});
	});
}

//limits what should be added
function defectiveSorter(items){
	//everything in items are only glassware
	//defectiveGetItems(requestID);
	
	if (items == ""){
		console.log('empty')
		document.getElementById("defectiveContent").style.display = 'none';
		document.getElementById("defectiveTitle").style.display = 'block';
		document.getElementById("submitUpdate").disabled = true;
	}else{
		console.log('not empty')
		document.getElementById("defectiveTitle").style.display = 'none';
		document.getElementById("submitUpdate").disabled = false;
	}
}

//get defective/missing items of a request
function getDefectiveofRequest(requestID){
	console.log(requestID)
	alert("getDefectiveofRequest")
	//assuming lab = chem
	var lab = "chemistry";
	var database = firebase.database().ref(lab);
	database.child("/request").orderByChild("requestID").equalTo(requestID).once("value").then(function(snapshot){
			snapshot.forEach(function(childSnapshot) {
					var data = snapshotToArray(childSnapshot);
					if (data.length == 9){
						console.log("returning data, " + data[0])
						var table = document.getElementById("defectiveTable");
					    

					    for (i=0;i<data["defective"].length;i++){
					    	for(j=0;j<data["defective"][i]["items"].length;j++){
					    		var totalRowCount = countDefectiveTable();
							    var row = table.insertRow(totalRowCount);
							    var item = row.insertCell(0);
					    		var qty = row.insertCell(1);
							    var status = row.insertCell(2);
					    		var del = row.insertCell(3);	

					    		item.innerHTML = '<select id="defectiveitems" class="form-control" style="overflow:hidden">'+data["defective"][i]["id"]+'</selected>';
					    		qty.innerHTML = '<select id="defectiveqty" class="form-control" style="overflow:hidden">'+data["defective"][i]["items"][j]["quantity"]+'</selected>';
					    		if (data["defective"][i]["items"][j]["quantity"] == "missing"){
					    			status.innerHTML = '<div class="form-check-inline">  <label class="form-check-label">    <input type="radio" class="form-check-input" name="optradio'+totalRowCount+' selected">Missing  </label></div><div class="form-check-inline">  <label class="form-check-label">    <input type="radio" class="form-check-input" name="optradio'+totalRowCount+'">Defective  </label></div></center>';
					    		}else{

					    			status.innerHTML = '<div class="form-check-inline">  <label class="form-check-label">    <input type="radio" class="form-check-input" name="optradio'+totalRowCount+'">Missing  </label></div><div class="form-check-inline">  <label class="form-check-label">    <input type="radio" class="form-check-input" name="optradio'+totalRowCount+'" selected>Defective  </label></div></center>';
					    		}
   								del.innerHTML = '<button id="'+totalRowCount+'" onclick="defectiveDeleteItem(id)" class="btn-light btn">X</button>';
					    		updateDefectiveTable();
					    	}
					    }
						return data[0]
					}else{
						return null
					}
			});
	});
}

//adding more items for defective list
function defectiveAddItem(requestID){
    //alert("ADDING ITEM" + requestID.value)
    //check if all the items are maxed out
    //if they are maxed out, remove/disable add button

	var table = document.getElementById("defectiveTable");
    var totalRowCount = countDefectiveTable();
    var row = table.insertRow(totalRowCount);
    var item = row.insertCell(0);
    var qty = row.insertCell(1);
    var status = row.insertCell(2);
    var del = row.insertCell(3);
	

	//assuming lab = chemistry
	var lab = "chemistry";
	var database = firebase.database().ref(lab);
	//console.log('getting glassware items in request id: ' + requestID)
	database.child("/request").orderByChild("requestID").equalTo(requestID).once("value").then(function(snapshot){
			snapshot.forEach(function(childSnapshot) {
			var data = snapshotToArray(childSnapshot);
			var i = 1;
			var options = ""
			if(data.length == 9){
				i = 2;
			}
			for(k = 0; k<data[i].length;k++){
			    if(data[i][k]['itemID'].split("-")[0] == "gla"){
			    	options+= '<option>'+data[i][k]['name']+'</option>';
			    }
			}
			item.innerHTML += '<select id="defectiveitems'+totalRowCount+'" onchange="updateItem(id)" class="form-control" style="overflow:hidden"><option value="0" selected>Choose Item</option>'+options+'</selected>';
			qty.innerHTML += '<select id="defectivequantities'+totalRowCount+'" onclick="updateQty(id)" class="form-control" style="overflow:hidden"><option value="0" selected>0</option></selected>';
			status.innerHTML = '<div class="custom-controls-stacked"><label class="custom-control custom-radio"><input id="missing'+totalRowCount+'" name="radio-stacked'+totalRowCount+'" type="radio" class="custom-control-input"><span class="custom-control-indicator"></span><span class="custom-control-description" >Missing</span></label><label class="custom-control custom-radio"><input id="defective'+totalRowCount+'" name="radio-stacked'+totalRowCount+'" type="radio" class="custom-control-input"><span class="custom-control-indicator"></span><span class="custom-control-description">Defective</span></label></div>'
			del.innerHTML = '<button id="'+totalRowCount+'" onclick="defectiveDeleteItem(id)" class="btn-light btn"><i class="fa fa-trash"></i></button>';
			updateDefectiveTable();
				
		});
	});
    
    /*qty.innerHTML = '<select id="defectivequantities'+totalRowCount+'" onclick="updateQty(id)" class="form-control">  <option>0</option></select>';
    status.innerHTML = '<div class="form-check-inline">  <label class="form-check-label">    <input type="radio" class="form-check-input" name="optradio'+totalRowCount+'">Missing  </label></div><div class="form-check-inline">  <label class="form-check-label">    <input type="radio" class="form-check-input" name="optradio'+totalRowCount+'">Defective  </label></div></center>';
    del.innerHTML = '<button id="'+totalRowCount+'" onclick="defectiveDeleteItem(id)" class="btn-light btn">X</button>';
	*/
}

function updateItem(rowID){
	id = rowID.split("s")[1]
	console.log(id)

	if(document.getElementById(rowID).options[0].value ==  "0"){
		document.getElementById(rowID).remove(0);
	}

	//when changing the dropdown choice for the item
	//set qty to 0 and missing/defective to unchecked
	qty = document.getElementById("defectivequantities"+id)
	qty.innerHTML = "";
	qty.options[0] = new Option("0","0");
	qty.value = "0";

	missing = document.getElementById("missing"+id);
	defective = document.getElementById("defective"+id);
	missing.checked = false
	defective.checked = false

	//update all qty for rows with the same item
	item = document.getElementById("defectiveitems"+rowID);
	selected = item.options[ item.selectedIndex ].value

	for(i = 1; i<= countDefectiveTable()+1; i++){
		choice = document.getElementById("defectiveitems"+i);
		if(choice.options[choice.selectedIndex].value == selected){
			console.log("update item row#:"+i)
			updateQty("defectiveitems"+i)
		}
	}
}

function retrieveDefectiveData(){
	var totalRowCount = countDefectiveTable();
	var defectiveitems = {};
	var final = []
	
	for (row = 1; row<=totalRowCount-1;row++){
		console.log(row+"hn k")
		//check if default
		count = 1;
		item = document.getElementById("defectiveitems"+row);
		if(!(item.options[ item.selectedIndex ].value in defectiveitems) ){
			defectiveitems[item.options[ item.selectedIndex ].value] = [{"quantity": 0,"status":"missing"},{"quantity": 0,"status":"defective"}];
		}
		//else{
			//find the match, check if missing or defective
			qty = document.getElementById("defectivequantities"+row);
			qtyValue = parseInt(qty.options[ qty.selectedIndex ].value)
			if(document.getElementById("missing"+row).checked == true){
				//add to missing
				count = 0;
			oldValue = defectiveitems[item.options[ item.selectedIndex ].value][count]["quantity"] ;
			console.log("old value = "+oldValue);
			newval = qtyValue + parseInt(oldValue); 
			defectiveitems[item.options[ item.selectedIndex ].value][count] = {"quantity":newval,"status":"missing"}
			}else{

			oldValue = defectiveitems[item.options[ item.selectedIndex ].value][count]["quantity"] ;
			console.log("old value = "+oldValue);
			newval = qtyValue + parseInt(oldValue); 
			defectiveitems[item.options[ item.selectedIndex ].value][count] = {"quantity":newval,"status":"defective"}
		//	}

		}
	}
	var list = ""
	for (var item in defectiveitems){
		if(defectiveitems[item][0]["quantity"] == 0){
			defectiveitems[item].splice(0,1)
		}else if (defectiveitems[item][1]["quantity"] == 0){
			defectiveitems[item].pop();
		}
		final.push({"name":item, "id": "gla-"+item, "items": defectiveitems[item]})
		for (var i =0; i<defectiveitems[item].length;i++){
			list += "Item Name: "+ item + ", Item Status: " + defectiveitems[item][i]["status"] + ", Quantity: " + defectiveitems[item][i]["quantity"] + " </br>" ;
		}

	}
	console.log(list)
	return [final, list]

}
function validateDefective(){
	//check each row
	//return false if:
			// no checked status
			// has choose default
	var totalRowCount = countDefectiveTable();
	for (row = 1; row<=totalRowCount-1;row++){
		//check if default
		item = document.getElementById("defectiveitems"+row);
		if(item.options[ item.selectedIndex ].value == "0"){
			return "items";
		}
		//check if there is a qty == 0
		qty = document.getElementById("defectivequantities"+row);
		if(qty.options[ qty.selectedIndex ].value == "0"){
			return "qty";
		}
		//check status
		if(document.getElementById("missing"+row).checked == false && document.getElementById("defective"+row).checked == false){
			return "status";
		}
	}
	return true;
}
function isMaxed(){
	num = document.getElementById("maxItems").innerHTML;
	max = num.split(",");
	for(i = 0;i<max.length-1;i++){
		console.log(max[i])
	}
	totalRowCount = countDefectiveTable();
	count = 0;

	//for each id in maxItems, check if maxed
	for(item = 0; item<max.length-1; item++){
		id = max[item].split(":")[0];
		limit = max[item].split(":")[1];
		//console.log("id "+id+ " limit: "+limit);
		//check all the qty rows if equal to id
		itemCount = 0;
		for(row = 1; row<=totalRowCount-1; row++){
			//console.log("defectiveitems"+row)
			chosenItem = document.getElementById("defectiveitems"+row);
			if (chosenItem.options[ chosenItem.selectedIndex ].value != null){
				selected = chosenItem.options[ chosenItem.selectedIndex ].value
			}
			if(selected == id){
				//console.log(selected + " eq to  " + id)
				qty = document.getElementById("defectivequantities"+row);
				itemCount += parseInt(qty.options[ qty.selectedIndex ].value)
			}
		}
		//console.log("itemCount for "+id+ " is "+ itemCount);
		if(itemCount==limit){
			count+=1;
		}
	}
	//console.log("count: " +count+ " max length: "+ max.length)
	if(count == max.length-1){
		return true;
	}
	return false;
}

function updateQty(rowID){
	num = document.getElementById("maxItems").innerHTML;
	
	max = num.split(",");

	if(isMaxed()){
		console.log("DISABLE ADD MORE");
		document.getElementById("moreitemsbtn").disabled = true;
	}else{
		document.getElementById("moreitemsbtn").disabled = false;
		console.log("not yet maxed all")
	}
	id = rowID.split("s")[1]
	itemMax = 0
	quantity = document.getElementById("defectivequantities"+id);
	items = document.getElementById("defectiveitems"+id);

	selected = items.options[ items.selectedIndex ].value
	console.log(selected)
	totalRowCount = countDefectiveTable();
	console.log(totalRowCount)
	count = 0
	for(i = 1; i<totalRowCount;i++){
		temp = document.getElementById("defectiveitems"+i);
		console.log("i"+i)
		tempselected = temp.options[temp.selectedIndex].value
		console.log(tempselected)
		if(selected == tempselected){
			qty = document.getElementById("defectivequantities"+i);
			count += parseInt(qty.options[qty.selectedIndex ].value)
			console.log("Count = " + count);
		}
	}
	for (i = 0; i<max.length;i++){
		temp = max[i].split(":")
		if(selected == temp[0]){
			itemMax = parseInt(temp[1])
			console.log("MAX = "+temp[1]);
			break
		}
	}
		
	rem = itemMax - count;
	selectedQuantity = parseInt(quantity.options[ quantity.selectedIndex ].value)
	console.log(rem+selectedQuantity)
	quantity.innerHTML=""
		
	if (rem+selectedQuantity == 0){
		quantity.options[quantity.options.length] = new Option(0, 0);
	}else{
		for(i = 1;i<=rem+selectedQuantity;i++){
			console.log("inside for looPL" + i)
			quantity.options[quantity.options.length] = new Option(i, i);
			if(selectedQuantity == i){
				quantity.value = i
			}
		}
	}
	if(isNaN(selected)){
		selected = 0;
	}
	

}
function defectiveDeleteItem(row){
	var count = countDefectiveTable();
	console.log("row" + row);

	if (count==2){
		document.getElementById('itemsheader').style.display = "none";
		document.getElementById("defectiveTableWarning").innerHTML = "Can't delete all the items.";
	}
	else{
		document.getElementById("defectiveTable").deleteRow(row);
		//update all qty
		updateDefectiveTable();
		for(i = 1; i<= count+1; i++){
			updateQty("defectiveitems"+i)
		}
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
        var item = rows[i].getElementsByTagName("select")[0]
        item.id = "defectiveitems"+rowCount;
        var qty = rows[i].getElementsByTagName("select")[1]
        qty.id = "defectivequantities"+rowCount;
        var missing = rows[i].getElementsByClassName("custom-control-input")[0];
        missing.id = "missing"+rowCount;
        missing.name = "radio-stacked"+rowCount;
        var defective = rows[i].getElementsByClassName("custom-control-input")[1];
        defective.id = "defective"+rowCount;
        defective.name = "radio-stacked"+rowCount;			    			
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

