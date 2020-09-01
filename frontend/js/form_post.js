//Vérifier si l'utilisateur est connecté, sinon renvoyer l'utilisateur vers la page de login
const headers = {
    headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
    }
}


// Recupération et affichage nom et prénom de l'utilisateur
axios.get('http://localhost:3000/api/users/me', headers).then((res) => {
    displayName(res.data)
}).catch(() => {
    window.location.href = 'login.html'
})


const user = JSON.parse(localStorage.getItem('user'));
const userId = user.id;
const token = localStorage.getItem('token');


// Crée le bouton 'deconnexion'
document.querySelector('#logout-button').addEventListener('click', () => {
    localStorage.clear('userId');
    localStorage.clear('token');
    // envoyer infos au serveur pour informer de la deconnexion de l'utilisateur?
    window.location.href = 'login.html';
})


// Définition function pour l'affichage des nom et prénom de l'utilisateur
function displayName(userData) {
    document.querySelector('.firstname').textContent = userData.firstname;
    document.querySelector('.lastname').textContent = userData.lastname;
}


//Envoie data de chaque post
function addPost(event) {
    event.preventDefault();
    const formData = new FormData();

    formData.append('title', event.target.title.value);
    formData.append('contentPost', event.target.contentPost.value);
    formData.append('attachment', event.target.attachment.files[0]);

    headers.headers['Content-Type'] = 'multipart/form-data'

    axios.post('http://localhost:3000/api/posts/new', formData, {...headers, 'Content-Type': 'multipart/form-data'})
        .then((res) => { // on envoie au serveur les data du formulaire du post

        window.location.href = 'index.html'; // Redirection vers la page d'accueil
        }).catch(() => {
            console.log('erreur catch')
        })
}

document.getElementById('form').addEventListener('submit', addPost); // on défini l'action lié au bouton de validation du formulaire
