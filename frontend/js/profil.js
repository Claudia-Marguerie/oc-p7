// Vérification de l'authentification de l'utilisateur
const headers = {
    headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
    }
}

const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');


// Affichage Nom et prénom de l'utilisateur
axios.get('http://localhost:3000/api/users/me', headers).then((res) => {
    user = res.data
    localStorage.setItem('user', JSON.stringify(res.data))
    displayName(res.data)
}).catch(() => {
    window.location.href = 'login.html'
})


// Crée le bouton 'deconnexion'
document.querySelector('#logout-button').addEventListener('click', () => {
    localStorage.clear('userId');
    localStorage.clear('token');
    window.location.href = 'login.html';
})


//Crée le bouton "suprimmer mon compte"
document.querySelector('#delete-user-button').addEventListener('click', () => {
    axios.delete('http://localhost:3000/api/users/me', headers).then((res) => {
        localStorage.clear('userId');
        localStorage.clear('token');
        window.location.href = 'signup.html';
    })
})


// Affichage Nom et prénom de l'utilisateur
function displayName(userData) {
    document.querySelector('.firstname').textContent = userData.firstname;
    document.querySelector('.lastname').textContent = userData.lastname;
}


// Recupère le contenu du user à modifier
axios.get('http://localhost:3000/api/users/me', headers).then((res) => {
    
    document.querySelector('#lastname').value = res.data.lastname;
    document.querySelector('#firstname').value = res.data.firstname;
    document.querySelector('#email').value = res.data.email;

}).catch(() => {
    window.location.href = 'login.html'
})


// Envoie data de l'utilisateur modifié
function SendModifiedProfil(event) {
    event.preventDefault();
    const userData = {};
    userData.lastname = event.target.lastname.value;
    userData.firstname = event.target.firstname.value;
    userData.email = event.target.email.value;

    axios.put('http://localhost:3000/api/users/'+ userId, userData, headers).then((res) => {
        console.log('après PUT')
        const data = res.data
        console.log(data)
        // localStorage.setItem("postData", JSON.stringify(data.postData)) // on converti la liste en string pour qu'elle soit lisible par javascript. 
        // localStorage.setItem('token', data.token);
        window.location.href = 'index.html'; // Redirection vers la page d'accueil
        }).catch(() => {
            console.log('erreur catch')
            // window.location.href = 'login.html'
        })

}

document.getElementById('form').addEventListener('submit', SendModifiedProfil);