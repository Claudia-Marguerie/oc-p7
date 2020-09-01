//Vérifier si l'utilisateur est connecté, sinon renvoyer l'utilisateur vers la page de login
const headers = {
    headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
    }
}


const user = JSON.parse(localStorage.getItem('user'));
const userId = user.id;
const token = localStorage.getItem('token');


// Crée le bouton 'deconnexion'
document.querySelector('#logout-button').addEventListener('click', () => {
    localStorage.clear('userId');
    localStorage.clear('token');
    
    window.location.href = 'login.html';
})


// Affichage Nom et prénom de l'utilisateur
axios.get('http://localhost:3000/api/users/me', headers).then((res) => {
    displayName(res.data)

}).catch(() => {
    console.log('erreur catch')
    window.location.href = 'login.html'
})


function displayName(userData) {
    document.querySelector('.firstname').textContent = userData.firstname;
    document.querySelector('.lastname').textContent = userData.lastname;
}

const postId = localStorage.getItem('postIdToModify');
const originalContent = null;

// Recupere le contenu du post a modifier (avec l'ID postId) avec la route get 'One'
axios.get('http://localhost:3000/api/posts/' + postId, headers).then((res) => {
    // remplir le formulaire avec les donnees originales du post (venant du serveur)
    document.querySelector('#title').value = res.data.title;
    document.querySelector('#contentPost').textContent = res.data.contentPost;
}).catch(() => {
    console.log('erreur catch')
})


//Envoie data de chaque post
function SendModifiedPost(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append('title', event.target.title.value);
    formData.append('contentPost', event.target.contentPost.value);
    formData.append('attachment', event.target.attachment.files[0]);

    headers.headers['Content-Type'] = 'multipart/form-data'

    axios.put('http://localhost:3000/api/posts/'+ postId, formData, {...headers, 'Content-Type': 'multipart/form-data'})
        .then((res) => { // on envoie au serveur les data du formulaire du post

        window.location.href = 'index.html'; // Redirection vers la page d'accueil
        }).catch(() => {
            console.log('erreur catch')
        })
}

document.getElementById('form').addEventListener('submit', SendModifiedPost);