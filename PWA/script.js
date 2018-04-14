

function openDB(){
	var request = indexedDB.open("BaguioEatsDB", 1);
	request.onerror = function(e){
		console.log('di nag open ung db');
	}
	request.onsuccess = function(e){
		console.log('nagopen ung db');
		db = e.target.result;
		// signUp();
	}
	request.onupgradeneeded = function(e){
		console.log('nagupdate');
		db = e.target.result;
		var objectStore = db.createObjectStore("users", {keyPath: "username"});
		objectStore.createIndex("username", "username", {unique:true});
		objectStore.createIndex("email", "email", {unique:true});


		var objectStore = db.createObjectStore("reviews", {keyPath: "username"});
		objectStore.createIndex("rating", "rating", {unique:false});
		objectStore.createIndex("comment", "comment", {unique:false});

	}

}

function signUp(){
	console.log('asdasd');

	var username = document.forms['signUpForm']['username'].value;
	var email = document.forms['signUpForm']['email'].value;
	var passwd = document.forms['signUpForm']['passwd'].value;
	var birth = document.forms['signUpForm']['bday'].value;

	if(username == "" || email == "" || passwd == "" || birth == ""){
		console.log('walang inenter cancel db');
		return;
	}

	if(!validate()){
		console.log('mali email');
		return; //di na magrurun yung mga nasa baba 
	}

	if(!lengthPass(passwd)){
		return;
	}

	var transaction = db.transaction(["users"], "readwrite");

	transaction.oncomplete = function(e){
		console.log('complete transaction');
	}

	transaction.onerror = function(e){
		console.log('huwaw');
		document.getElementById("duplicate").innerHTML = "Username already taken.";
		disableSubmit();
		validate();
		lengthPass();
	}

	var newUser = {
		"username":username,
		"password":passwd,
		"email":email,
		"birthdate":birth
	}

	var objectStore = transaction.objectStore("users");
	var request = objectStore.add(newUser);

	request.onsuccess = function(e){
		console.log(e);
		console.log('added new user' + " " + newUser.username);
		window.location = "signin.html";
	}

}

function signIn(){
	console.log('ad');
	var transaction = db.transaction(["users"]);
	var objectStore = transaction.objectStore("users");

	var username = document.forms['signInForm']['username'].value;
	var passwd = document.forms['signInForm']['passwd'].value;

	var request = objectStore.get(username);

	request.onsuccess = function(e){ //e = laman ng request 
		//check if result nung request is undefined
		//undefined meaning walang username na nahanap sa db
		if(request.result == undefined){ 
			console.log('User not found!');
			document.getElementById("Error").innerHTML = "Username or Password incorrect!";
			//window.location = "signin.html";
		}else{
			console.log(request.result.username); //if di siya undefined print yung username
			if (request.result.password == passwd){ //yung passwd ay correct
				console.log('yay');
				sessionStorage.setItem("user", JSON.stringify({"username": username, "password": passwd}));
				//to check if the user is login 
				window.location = "../index.html"; //punta siya sa home
			}else { //if hindi correct
				console.log('wrong password');
				//window.location = "signin.html"; //reload yung sign html;

				//var errorNode = document.createElement("p");

				document.getElementById("passwordError").innerHTML = "Incorrect password";
			}
		}
	};

	request.onerror = function(e){
		console.log('failed objectStore');
	};
}

function validate(){
    var email = document.forms['signUpForm']['email'].value;
    var emailFilter = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;

    disableSubmit();
    if (!emailFilter.test(email)) {
        document.getElementById("valid").innerHTML = "Please enter a valid email.";
        return false;
    }
    return true;
}

function disableSubmit(){
	document.getElementById("button").disable = true;	
	document.getElementById("submit").disable = true;
}

function lengthPass(passwd){

	disableSubmit();
	if(passwd == '' || passwd.length<8){
		document.getElementById("passwd").innerHTML = 'Password too short';
		return false;
	}	

	if(passwd.length == 8){
		console.log('good pass');
	}else if(passwd.length > 8) {
		console.log('strong');
	}else {
		console.log('bad');
	}

	return true;
}

function addReview(){
	//Alerts and stops the process if no user is logged in 
	if (sessionStorage.getItem("user") === null){
		alert("Not signed in");
		//window.location = "signin.html";
		return;
	}

	console.log('yo');

	var username = JSON.parse(sessionStorage.getItem('user')).username;
	var rating = document.forms['addReviewForm']['rating'].value; 
	var comment = document.forms['addReviewForm']['comment'].value;

	if(rating == "" || comment == ""){
		console.log('walang inenter cancel db');
		return;
		disableSubmit();
	}

	var transaction = db.transaction(["reviews"], "readwrite");

	transaction.oncomplete = function(e){
		console.log('haloo');
	}

	transaction.onerror = function(e){
		console.log('error')
;	}

	var newReview = {
		"username": username,
		"rating": rating,
		"comment":  comment
	}

	var objectStore = transaction.objectStore("reviews");
	var request = objectStore.add(newReview);

	request.onsuccess = function(e){
		console.log(e);
		console.log('added a new review' + " " + newReview.rating);
		//window.location = "signin.html";
	}
}

//runs when index.html loads
function setUpIndex(){
	openDB();
	checkSignedInUser();
}

//checks if a user is signed in and display username if logged in 
function checkSignedInUser(){
	console.log('yoyoyo');

	if(sessionStorage.getItem("user") === null){
		document.getElementById("loggedInUser").innerHTML = "Not Signed In";
	}else {
		document.getElementById("loggedInUser").innerHTML = JSON.parse(sessionStorage.getItem("user")).username;
	}
}


function rating(){
	var rating = document.forms['addReview']['rating'].value;

	if(rating.result == 5){

	}
}




/*
var searchKey = document.forms["search1"]["input"].value;

data.forEach(function(d) {
	if(d.name == searchKey){
		console.log('wow');
		break;
	}
}


/*
document.querySelectorAll("input").addEventListener("change", function(){
	//var change = document.getElementsByName("username");
	//change.value = change.value.toUpperCase();

	var username = document.forms["signUpForm"]["username"].value;
	var email = document.forms["signUpForm"]["email"].value;
	var password = document.forms["signUpForm"]["passwd"].value;
	var bday = document.forms["signUpForm"]["bday"].value;

	var username = document.forms["signInForm"]["username"].value;
	var password = document.forms["signInForm"]["passwd"].value;
});

*/
