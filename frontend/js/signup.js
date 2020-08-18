class userObject {
    constructor(firstname, lastname, email, password){
        this.lastName = lastname;
        this.firstName = firstname;
        this.email = email;
        this.password = password;
    }
}

const user = new userObject()

function formValid() { 
    
}

const userId = '';

function signUp(event){
    event.preventDefault();
    const user = {};
    user.lastname = event.target.lastname.value; // on cree le tableau du user avec les donnés entrées dans le formulaire
    user.firstname = event.target.firstname.value;
    user.email = event.target.email.value;
    user.password = event.target.password.value;

    const userObject = JSON.stringify(user);
    console.log(userObject)

    axios.post('http://localhost:3000/api/users/signup', user).then((response) => {
        const data = response.data
        localStorage.setItem("user", JSON.stringify(data.user)) // on converti la liste en string pour qu'elle soit lisible par javascript. On écrasse le panier stocké en local avec le panier à 0
        localStorage.setItem('token', data.token);
        document.location.href = 'index.html'; // Redirection vers la page d'accueil
    }), (err) => {
            console.log(err)
        }
}

document.getElementById('form').addEventListener('submit', signUp);