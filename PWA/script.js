

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

    if(!validateInput()){
        console.log('huwaw');
        return;
    }
    
    if(!validate()){
        console.log('mali email');
        document.getElementById("valid").innerHTML = "Please enter a valid email.";
        return;
    }

    if(!lengthPass(passwd)){
        console.log('kkk')
        document.getElementById("passwd").innerHTML = 'Password too short. Use at least 8 characters';
        return;
    }   

    var transaction = db.transaction(["users"], "readwrite");

    transaction.oncomplete = function(e){
        console.log('complete transaction');
    }

    transaction.onerror = function(e){
        console.log('huwaw');
        document.getElementById("duplicate").innerHTML = "Username already taken."; 
        disableSignUp();
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

function validateInput(){
    var valid = true;
    var username = document.forms['signUpForm']['username'].value;
    var email = document.forms['signUpForm']['email'].value;
    var passwd = document.forms['signUpForm']['passwd'].value;
    var bday = document.forms['signUpForm']['bday'].value;
      if(username == ""){
          document.getElementById('duplicate').innerHTML = "*Field is empty";
          valid = false;
      }

      if(email == ""){
          document.getElementById('valid').innerHTML = "*Field is empty";
          valid = false;
      }

      if(passwd == ""){
        document.getElementById('passwd').innerHTML = "*Field is    empty";
        valid = false;
      }

      if(bday == ""){
        document.getElementById('bday').innerHTML  = "*Field is empty";
        valid = false;
      }

  return valid;
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
            if(confirm('Username or Password incorrect')){
                window.location.reload();  
            }
            /*
            document.getElementById("Error").innerHTML = "Username or Password incorrect!";
            setTimeout(function(){
                window.location.reload(true);
            }, 2000);*/
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

    disableSignUp();
    if (!emailFilter.test(email)) {
        return false;
    }
    return true;
}

function disableSignUp(){
    document.getElementById("button").disable = true;   
}

function disableReview(){
    document.getElementById("button").disable = true;   
}

function lengthPass(passwd){

    disableSignUp();
    if(passwd == '' || passwd.length<8){
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
        //alert("Not signed in");
        window.location = "signin.html";
        return;
    }

    console.log('yo');

    var username = JSON.parse(sessionStorage.getItem('user')).username;
    var rating = document.forms['addReviewForm']['rating'].value; 
    var comment = document.forms['addReviewForm']['comment'].value;

    if(rating == "" || comment == ""){
        console.log('walang inenter cancel db');
        return;
        disableReview();
    }

    var transaction = db.transaction(["reviews"], "readwrite");

    transaction.oncomplete = function(e){
        console.log('haloo');
    }

    transaction.onerror = function(e){
        console.log('error')
;   }

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
function setupIndex(){
    openDB();
    checkSignedInUser();

    document.getElementById("reviews").style.display = "none";
    document.getElementById("searchBox").addEventListener("input", function(){
       search();
    });
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


var restaurant = [];
function search(){
    document.getElementsByClassName("resultContainer")[0].innerHTML = " ";
    console.log("change");
    restaurant.length = 0;
    var searchKey = document.getElementById("searchBox").value.toLowerCase();
    for(var i = 0; i < list.length; i++){
        if( list[i].Name.toLowerCase().includes( searchKey ) || list[i].Address.toLowerCase().includes( searchKey ) || list[i].Desc.toLowerCase().includes( searchKey )){
            if(restaurant.indexOf(list[i]) === -1){
                restaurant.push(list[i]);
            }
        }
    }

    if(restaurant.length > 0){
        restaurant.forEach(function(e){
            document.getElementsByClassName("resultContainer")[0].innerHTML += `
    <button class="result" onclick="openRestaurantReviews()">
        <a class="resultName" id="resultName">
            ${e.Name}
        </a>
        <a class="resultLocation">
            ${e.Address}
        </a>
    </button>
`           
        })
    }else if(restaurant.length == 0 && document.getElementById("searchBox").value != ""){
        document.getElementsByClassName("resultContainer")[0].innerHTML = 
`
    <button class="result">
        <a class="resultName">
            No results!
        </a>
    </button>
`
    }else{
        document.getElementsByClassName("resultContainer")[0].innerHTML = 
`
    <button class="result">
        <a class="resultName">
            Search Above!
        </a>
    </button>
`
    }
}


function openRestaurantReviews(){
    document.getElementById("content").innerHTML = ""
    var restObject;

    for(var i = 0; i < list.length; i++){
        if( document.getElementById("resultName").innerText == restaurant[i].Name ){
            restObject = restaurant[i];
            break;
        }
    }



    document.getElementById("reviews").style.display = "block";
    document.getElementsByClassName("resultContainer")[0].innerHTML = 
`
    <button class="result">
        <a class="resultName">
            Search Above!
        </a>
    </button>
`;

    document.getElementById("restName").innerText = restObject.Name;
    document.getElementById("restAddress").innerText = restObject.Address;


    // var transaction = db.transaction(["reviews"]);
    // var objectStore = transaction.objectStore("reviews");

    // var request = objectStore.get(restObject.Name);

    // request.onsuccess = function(e){ //e = laman ng request 
    //  if(request.result == undefined){ 
    //      document.getElementById("average").innerHTML = `<h2>0.0</h2>`
    //  }else{
    //      document.getElementById("average").innerHTML = `<h2>${request.result.rating}</h2>`

    //      request.result.forEach(function(e){
    //          document.getElementById("content").innerHTML += `
    // <div class="contentCard">
    //     <h3>${e.username}</h3>
    //     <h4>${e.rating}</h4>
    //     <p id="">${e.comment}</p>
    // </div>
    //      `
    //      })
    //  }
        
    // };
    
}

function rating(){
    var rating = document.forms['addReview']['rating'].value;

    var value = [rating],
        count = 0, 

        sum = value.reduce(function(sum, item, index){
        count += item;
        return sum + item * (index + 1);

    }, 0);

    console.log(sum / count);
}



/*ss

//service worker

self.addEventListener('install', function(e){
    var wee = 'BaguioEats';
    var urlsToCache = [
        'style.css',
        'script.js',
        'css/sign.css',
        'html/about.html',
        'html/signin.html',
        'html/signup.html',
        'images/Baguio-Eats.png',
        'images/Baguio-Eats-Logo.png',
        'images/Kitchenware-Background.png',
        'images/search.png'
    ];

    event.waitUntil(
        caches.open(wee)
        .then(function(cache){
            console.log('Opened cache')
            return cache.addAll(urlsToCache);
        })
    );
})

self.addEventListener('fetch', function(e){
    event.respondWith(
        caches.match(event.request)
        .then(function(response){
            if (response){
                return response;
            }

            var fetchRequest = event.request.clone();

            return fetch(event.request).then(
            function(response) {
                if(!response || response.status !== 200 || response.type! == 'basic'){
                    resturn response;
                }

                var responseToCache = response.clone();

                caches.opne(wee)
                .then(function(cache){
                    cache.put(e.request, responseToCache);
                });
                return response;
                }
            );
        })
    );
});

self.addEventListener('active', function(event){
    var cacheWhitelist= ['BaguioEats','sdada'];

    event.waitUntil(
        caches.keys().then(function(cacheNames){
            return Promise.all(
                cacheNames.map(function(cacheName){
                    if(cacheWhitelist.indexOf(cacheName) === -1){
                        return caches.delete(cacheName);
                    }
                }))
        }))
})

*/