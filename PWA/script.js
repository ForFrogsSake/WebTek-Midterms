

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

var db;


var idbSupported = false; 
//created a global variable called idbSupported and 
	//used it as a flag to check if the browser can use IndexedDB          
document.addEventListener("DOMContentLoaded", function(){
	if("indexedDB" in window) {
   		idbSupported = true;
    }
//Check if IndexedDB is supported in window.
//Used a DOMContentLoaded event to wait for the page to load. 
             
    if(idbSupported) {
        var request = indexedDB.open("usersdb",1);
        //the '1' in the open method is the version of the db which determines the database schema
        //the result for the open function is an instance of an IDBDatabase 
           
    	request.onsuccess = function(e) {
            console.log("Success!");
                db = e.target.result;
        }

        //success event triggers the onsuccess() function whose type property is set to "success"
             
        request.onerror = function(e) {
            console.log("Error");
            console.dir(e);
        }

        //event error triggers the onerror() function whose type property is set to "error" 

        request.onupgradeneeded = function(e){
        	console.log("Running upgrade");
        	var thisDb = e.target.result;
        }

        //
             
    }

    var userStore = db.createUserStore("name", {keyPath: "myName"});

    const userData = [];

    const dbName = "NAME";

    var request = indexedDB.open("userdb", 2);

             
},false);



           
	            