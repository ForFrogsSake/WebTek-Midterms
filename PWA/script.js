

/*
function signUp(){
                validate();
                var username = document.forms['signUpForm']['username'].value;
                var email = document.forms['signUpForm']['email'].value;
                var passwd = document.forms['signUpForm']['passwd'].value;
                var birth = document.forms['signUpForm']['bday'].value;

                var user = {
                    'username':username,
                    'email':email,
                    'passwd':passwd,
                    'birth':birth,
                }

                let userArray = [];

                //localStorage.setItem('users', userArray);
                var array = JSON.parse(localStorage.getItem('users'));
                userArray = [array];
                userArray.push(users)

                
                localStorage.setItem('users', JSON.stringify(userArray));
                console.log(JSON.stringify(userArray));
                console.log(array);
            }

            /*
                practice

                let users = [];

                if (users){
                    users = JSON.parse(localstorage/indexeddb.getItem('user'));
                }
                else{
                    users = localStorage/indexeddb.setItem('user', JSON.stringify(users));
                }

                var usersObject = ;

            */
            /*
            function validate(){
                var email = document.forms['signUpForm']['email'].value;
                var emailFilter = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;

                if (!emailFilter.test(email)) {
                    alert('Please enter a valid e-mail address.');
                    return false;
                }

                return true;

            }
            
            /*
            function signIn(){
                var email = document.forms['signInForm']['email'].value;
                var passwd = document.forms['signInForm']['passwd'].value;

                var users = {
                    'email':email,
                    'passwd':passwd,

                }

                localStorage.setItem('users', JSON.stringify(users));
                //console.log(email);
                //console.log(passwd);
            }

			*/
//constant called userData 
const UsersDB = "users";

var db;

//created a global variable called idbSupported and 
	//used it as a flag to check if the browser can use IndexedDB  
var idbSupported = false;
//Check if IndexedDB is supported in window.
//Used a DOMContentLoaded event to wait for the page to load.        
document.addEventListener("DOMContentLoaded", function(){
	if("indexedDB" in window) {
   		idbSupported = true;
    }
            
    if(idbSupported) {
    	//the '1' in the open method is the version of the db which determines the database schema
        //the result for the open function is an instance of an IDBDatabase 
        var request = indexedDB.open("UsersDB",1);
        
        //success event triggers the onsuccess() function whose type property is set to "success"     
    	request.onsuccess = function(e) {
            console.log("Success!");
                db = e.target.result;
        }
		
		//handle errors 
        //event error triggers the onerror() function whose type property is set to "error"     
        request.onerror = function(e) {
            console.log("Error");
            console.dir(e);
        }
       
        //onupgradeneeded event is triggered when creating a new database or increasing the version number of an existing database. 
        request.onupgradeneeded = function(e){
        	console.log("Running upgrade");
        	var thisDb = e.target.result;

        	//Create a userStore to hold information about our users. 
        	//username as a keyPath, guaranteed to be unique
        	var userStore = thisDb.createUserStore("users", {keyPath: "username"});

        	//create another user store called 'names'
        		//autoincrement flag is set as true
        	var usrStore = this.Db.createUserStore("names", {autoincrement: true});

        	//Create an index to search users by name. There are moments where we could encounter same name
        		//so we cannot use a unique index. 
        	userStore.createIndex = ("name", "name", {unique: false});

        	//Create an index to search users by email. Make sure that no users have the same email
        		//Use the unique index 
        	userStore.createIndex = ("email", "email", {unique: true});

        	//Use the transaction.oncomplete to make sure the userStore creation is finished before adding data. 
        		//oncomplete event handler of IDBTransaction interface handles the complete event,
        			//it is fired when the transaction successfully completes.
        	userStore.transaction.oncomplete = function(e){
        		//Store values on the newly created userStore
        			//readwrite mode means you can change the data in your database. 
        		var userDataStore = thisDb.transaction("users", "readwrite").userStore("users");
        		userData.forEach(function(user) {
        			userDataStore.add(user);
        		});
         	} 

      	}            
    }            
},false);








           
	            