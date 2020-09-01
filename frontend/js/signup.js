function signUp(event){
    event.preventDefault();
    const user = {};
    user.lastname = event.target.lastname.value; // on cree le objet du user avec les donnés entrées dans le formulaire
    user.firstname = event.target.firstname.value;
    user.email = event.target.email.value;
    user.password = event.target.password.value;

    axios.post('http://localhost:3000/api/users/signup', user).then((response) => {
        const data = response.data
        localStorage.setItem('user', JSON.stringify(data.user)) // on converti le tableau du user en string pour qu'il soit lisible par javascript. 
        localStorage.setItem('token', data.token);
        document.location.href = 'index.html'; // Redirection vers la page d'accueil
    }), (err) => {
            console.log(err)
        }
}

document.getElementById('form').addEventListener('submit', signUp);