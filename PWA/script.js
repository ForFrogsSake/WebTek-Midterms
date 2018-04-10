
function myFunction(){
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

	console.log(username);
	console.log(email);
	console.log(passwd);
	console.log(birth);
}

function signIn(){
	var email = document.forms['signInForm']['email'].value;
	var passwd = document.forms['signInForm']['passwd'].value;


	console.log(email);
	console.log(passwd);
}


function reDirect(){

}