var historyloading;
var accountabilityloading;
var laboratory;
firebase.auth().onAuthStateChanged(function(user) {
  document.getElementById("loader").style.display="block";
  if (user) {
    var user = firebase.auth().currentUser;
	//var name, email, photoUrl, uid, emailVerified;
	  	document.getElementById("loader").style.display="none";
	  	document.getElementById("login").style.display = "none";

	if (user != null) {
		var email = user.email;

	  	document.getElementById("cont").style.display="block";
	  	document.getElementById("loader").style.display="none";
		document.getElementById("tabmenu").style.display = "block";
		request()
		open_pending_tab()
		var uid = user.uid
		console.log(uid)
		
		//clearInterval(loadingforever);
		var usersRef = firebase.database().ref("0/users/" + uid);
		var userId = firebase.auth().currentUser.uid;
		firebase.database().ref('0/users/' + userId).once('value').then(function(snapshot) {
		  	var lab = (snapshot.val() && snapshot.val().laboratory) || 'Anonymous';
  			console.log(lab)
  			laboratory = lab;
  			filterTab()
  			//loadItems(lab, "desc")
			});
		


	}
  } else {
	  	document.getElementById("loader").style.display="none";
	  	document.getElementById("login").style.display = "block";
	  	document.getElementById("tabmenu").style.display = "none";
	  	document.getElementById("cont").style.display="none";
  }
});

function login(){
	var userEmail = document.getElementById("username").value;
	var userPass = document.getElementById("pwd").value;


	firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;

	  switch(error.code){
	  	case "auth/invalid-email":
	  		document.getElementById("errormsg").innerHTML = "The email is badly formatted. Sample email format: name@website.com";
	 		break;
	 	case "auth/user-not-found":
	 		document.getElementById("errormsg").innerHTML = "There is no corresponding user to that email.";
	 		break;
	 	case "auth/wrong-password":
	 		document.getElementById("errormsg").innerHTML = "Invalid password.";
	 		break;
	 	default:
	 		document.getElementById("errormsg").innerHTML = error.code;
	  }
      
  	  
	});
}


function logout(){
	firebase.auth().signOut().then(function() {
  // Sign-out successful.
	
}).catch(function(error) {
  // An error happened.
});
}



