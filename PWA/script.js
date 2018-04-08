
function signUp(){
	var username = document.forms['signUpForm']['username'].value;
	var email = document.forms['signUpForm']['email'].value;
	var passwd = document.forms['signUpForm']['passwd'].value;
	var birth = document.forms['signUpForm']['bday'].value;
	var gender = document.forms['signUpForm']['gender'].value;

	var user = {
		'username':username,
		'email':email,
		'passwd':passwd,
		'birth':birth,
		'gender':gender
	}

	console.log(username);
	console.log(email);
	console.log(passwd);
	console.log(birth);
	console.log(gender);



}

function Redirect(){
	var 
}