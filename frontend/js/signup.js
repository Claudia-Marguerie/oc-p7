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
    document.getElementById('form').addEventListener('submit', signUp);
}

const userId = '';

function signUp(event){
    const user = {};
    user.lastname = event.target.lastname.value; // on cree le tableau du user avec les donnés entrées dans le formulaire
    user.firstname = event.target.firstname.value;
    user.email = event.target.email.value;
    user.password = event.target.password.value;

    const userObject = JSON.stringify(user);
    
    axios.post('http://localhost:3001/signup', userObject).then((response) => {
        userId = response.body//.userId
        console.log(userId);
        const { token } = response.body.token;
        localStorage.setItem("userId", JSON.stringify(userId)) // on converti la liste en string pour qu'elle soit lisible par javascript. On écrasse le panier stocké en local avec le panier à 0
        localStorage.setItem('token', token);

        document.location.assign('index.html');
    }), (err) => {
            console.log(err)
        }
}