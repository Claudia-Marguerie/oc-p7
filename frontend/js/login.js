

function login(){
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    for(i=0; i < userObject.length; i++){
        if(email == userObject[i].email && password == userObject[i]).password {
            console.log("Vous êtes connecté!")
            return
        }
    }
    console.log("E-mail ou mot de passe incorrect!")
} 