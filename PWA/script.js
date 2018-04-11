

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

            /*
            var idbSupported = false;
            var db;
             
            document.addEventListener("DOMContentLoaded", function(){
             
                if("indexedDB" in window) {
                    idbSupported = true;
                }
             
                if(idbSupported) {
                    var openRequest = indexedDB.open("test_v2",1);
             
                    openRequest.onupgradeneeded = function(e) {
                        console.log("running onupgradeneeded");
                        var thisDB = e.target.result;
             
                        if(!thisDB.objectStoreNames.contains("firstOS")) {
                            thisDB.createObjectStore("firstOS");
                        }
             
                    }
             
                    openRequest.onsuccess = function(e) {
                        console.log("Success!");
                        db = e.target.result;
                    }
             
                    openRequest.onerror = function(e) {
                        console.log("Error");
                        console.dir(e);
                    }
             
                }
             
            },false);
            */
            