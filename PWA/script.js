

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

    var inputs = validateInput();
    var validEmail = validate();
    var validPass = lengthPass(passwd);

    if (!inputs || !validEmail || !validPass){
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
    var bday = document.forms['signUpForm']['bday'].value;

      if(username == ""){
          document.getElementById('duplicate').innerHTML = "*Field is empty";
          valid = false;
      } 

      if(bday == ""){
        document.getElementById('bday').innerHTML  = "*Field is empty";
        valid = false;
      }

  return valid;
}

function setupSignUp(){
    openDB();

    document.getElementById("1").addEventListener("click", function(){
        document.getElementById("duplicate").innerHTML = "";
    });

    document.getElementById("2").addEventListener("click", function(){
        document.getElementById("valid").innerHTML = "";
    });

    document.getElementById("3").addEventListener("click", function(){
        document.getElementById("passwd").innerHTML = "";
    });

    document.getElementById("4").addEventListener("click", function(){
        document.getElementById("bday").innerHTML = "";
    });
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
            document.getElementById('Error').innerHTML = "Username or Password incorrect!";
        }else{
            console.log(request.result.username); //if di siya undefined print yung username
            if (request.result.password == passwd){ //yung passwd ay correct
                console.log('yay');
                sessionStorage.setItem("user", JSON.stringify({"username": username, "password": passwd}));
                //to check if the user is login 
                window.location = "home.html"; //punta siya sa home
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

function setupSignIn(){
    openDB();

    document.getElementById("1").addEventListener("click", function(){
        document.getElementById("Error").innerHTML = "";
    });

    document.getElementById("2").addEventListener("click", function(){
        document.getElementById("passwordError").innerHTML = "";
    });
}

function validate(){
    var email = document.forms['signUpForm']['email'].value;
    var emailFilter = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;

    disableSignUp();
    if(email == ""){
        document.getElementById('valid').innerHTML = "*Field is empty";
        return;
    }
    if (!emailFilter.test(email)) {
        document.getElementById("valid").innerHTML = "Please enter a valid email.";
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

    var passwd = document.forms['signUpForm']['passwd'].value;

    if(passwd == ""){
        document.getElementById('passwd').innerHTML = "*Field is    empty";
       return;
    }

    disableSignUp();
    if(passwd == '' || passwd.length<8){
        document.getElementById("passwd").innerHTML = "Password too short. Use at least 8 characters";
        return;
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

function logout(){
    sessionStorage.removeItem("user");
}

function setupHome(){
    openDB();
    displayRestaurant();

    document.getElementById("searchBox").addEventListener("input", function(){
       search();
    });

    document.getElementById("1").addEventListener("click", function(){
        document.getElementById("rate").innerHTML = "";
    });

    document.getElementById("2").addEventListener("click", function(){
        document.getElementById("wow").innerHTML = "";
    });
}

function addReview(){
    console.log('yo');

    var username = JSON.parse(sessionStorage.getItem('user')).username;
    var rating = document.forms['addReviewForm']['rating'].value; 
    var comment = document.forms['addReviewForm']['comment'].value;

    var validRating = rating();
    var validComment = review();

    if(!validRating == "" || !validComment == ""){
        return;
    }

    var transaction = db.transaction(["reviews"], "readwrite");

    transaction.oncomplete = function(e){
        console.log('haloo');
    }

    transaction.onerror = function(e){
        console.log('error')
        disableReview();
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
    }
}

function review(){
    var review = document.forms['addReviewForm']['comment'].value;

    if(review == ""){
        document.getElementById("wow").innerHTML = "Please put a comment here";
        return;
    }
}

function rating(){
    var rating = document.forms['addReview']['rating'].value;

    if (rating == "" || rating > 5 ){
        document.getElementById("rate").innerHTML = "Please have a rate";
        return;
    }
    return valid;  

    if(rating == 5){
        console.log('good pass');
    }else if(rating < 5) {
        console.log('strong');
    }else {
        console.log('bad');
    }

    var computeAverage = [rating];

    var sum = 0;
    for(var i = 0; i < computeAverage.length; i++){
        sum += parseInt(computeAverage[i]);
    }

    return avg = sum/computeAverage.length;

    document.getElementById('average').innerText = avg;
}

//runs when index.html loads
function setupIndex(){
    openDB();
    displayRestaurant();

    document.getElementById("searchBox").addEventListener("input", function(){
       search();
    });
}

function displayRestaurant(){
    list.forEach(function(restaurant){
        document.getElementsByClassName('resultContainer')[0].innerHTML +=
        `
            <button data-restaurant="${restaurant.Name}" class="result" onclick="openRestaurantReviews(this)">
                    <a class="resultName">
                        ${restaurant.Name}
                    </a>
                    <a class="resultName">
                        ${restaurant.Location}
                    </a>
            </button>
        `
    });
}

function openRestaurantReviews(element){
    var restName = element.dataset.restaurant;
    var restAddress; 
    console.log(element.dataset.restaurant);

    for(var i = 0; i < list.length; i++){
        if(restName == list[i].Name){
            restAddress = list[i].Location;
            break;
        }
    }

    document.getElementById("restName").innerText = restName;
    document.getElementById("restAddress").innerText = restAddress;
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