

// var thisDb;

// var request = window.indexedDB.open("UserDatabase");

// request.onsuccess = function(e) {
//     console.log("Success!");
//         thisDb = request.result;
// };
 
 
// request.onupgradeneeded = function(e){
// 	console.log(e.target);
// 	thisDb = e.target.result;

// 	var userStore = thisDb.createObjectStore("users", {keyPath: "username"});

// 	//Define what data items the userStore will contain 
// 	userStore.createIndex = ("name", "name", {unique: false}); //a name can be duplicated therefore we will not unique index 
// 	userStore.createIndex = ("email", "email", {unique: true}); //every user should have a unique email 
// 	userStore.createIndex = ("passwd", "passwd", {unique: false});
// 	userStore.createIndex = ("bday", "bday", {unique: false});
	
// 	//newUser();

// 	};

// function newUser(){
// 	var newUsers = [{name: "kyla", email: "kyla@email.com", passwd: "123", bday: 09/09/09}];
// 	var userTransaction = thisDb.transaction("[users]", "readwrite");

// 	userTransaction.oncomplete = function(e){
// 		console.log('Transaction complete');
// 		thisDb = userTransaction.result;
// 	};

// 	userTransaction.onerror = function(e){
// 		console.log('Error');

// 	};

// 	var userDataStore = userTransaction.userStore("users");

// 	var store = userStore.add(newUsers[0]);

// 	store.onsuccess = function(e){
// 		console.log('Success');
// 	};
// };

openDB()
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

		// objectStore.transaction.oncomplete = function(e){
		// 	var userDataStore = db.transaction("users", "readwrite").objectStore("users");
		// 	newData.forEach(function(user){
		// 		userDataStore.add(user);
		// 	})
		// }
	}

}

function signUp(){
	console.log('asdasd');
	var transaction = db.transaction(["users"], "readwrite");

	transaction.oncomplete = function(e){
		console.log('complete transaction');
	}

	transaction.onerror = function(e){
		console.log('error transaction, baka may duplicate');
	}

	var username = document.forms['signUpForm']['username'].value;
	var email = document.forms['signUpForm']['email'].value;
	var passwd = document.forms['signUpForm']['passwd'].value;
	var birth = document.forms['signUpForm']['bday'].value;

	var newUser = {
		"username":username,
		"password":passwd,
		"email":email,
		"birthdate":birth
	}

	var objectStore = transaction.objectStore("users");
	var request = objectStore.add(newUser);
	request.onsuccess = function(e){
		console.log('added new user' + newUser.username);
	}
}

function signIn(){
	console.log('ad');
	var transaction = db.transaction(["users"]);
	var objectStore = transaction.objectStore("users");
	var request = objectStore.get("")
}
