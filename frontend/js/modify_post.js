//Vérifier si l'utilisateur est connecté, sinon renvoyer l'utilisateur vers la page de login
const headers = {
    headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
    }
}


const user = JSON.parse(localStorage.getItem('user'));
const userId = user.id;
const token = localStorage.getItem('token');
// const userAuth = false;
// const postList = [];


// Crée le bouton 'deconnexion'
document.querySelector('#logout-button').addEventListener('click', () => {
    localStorage.clear('userId');
    localStorage.clear('token');
    // envoyer infos au serveur pour informer de la deconnexion de l'utilisateur?
    window.location.href = 'login.html';
})


//Crée le bouton "suprimmer mon compte"
// document.querySelector('#delete-user-button').addEventListener('click', () => {
//     axios.delete('http://localhost:3000/api/users/me', headers).then((res) => {
//         localStorage.clear('userId');
//         localStorage.clear('token');
//         window.location.href = 'signup.html';
//     })
// })


// Affichage Nom et prénom de l'utilisateur
axios.get('http://localhost:3000/api/users/me', headers).then((res) => {
    displayName(res.data)

}).catch(() => {
    window.location.href = 'login.html'
})


// Crée le bouton 'deconnexion'
document.querySelector('#logout-button').addEventListener('click', () => {
    localStorage.clear('userId');
    localStorage.clear('token');
    // envoyer infos au serveur pour informer de la deconnexion de l'utilisateur?
    window.location.href = 'login.html';
})


function displayName(userData) {
    document.querySelector('.firstname').textContent = userData.firstname;
    document.querySelector('.lastname').textContent = userData.lastname;
}

const postId = localStorage.getItem('postIdToModify');
const originalContent = null;

// Recupere le contenu du post a modifier (avec l'ID postId) avec la route get 'One'
axios.get('http://localhost:3000/api/posts/' + postId, headers).then((res) => {
    // displayName(res.data)
    // console.log('reponse route post')
    // console.log(res)
    // remplir le formulaire avec les donnees originales du post (venant du serveur)
    document.querySelector('#title').value = res.data.title;
    // console.log(res.data.title)
    document.querySelector('#contentPost').textContent = res.data.contentPost;

}).catch(() => {
    console.log('erreur catch')
    window.location.href = 'login.html'
})


//Envoie data de chaque post
function SendModifiedPost(event) {
    event.preventDefault();
    const postData = {};
    postData.title = event.target.title.value;
    postData.contentPost = event.target.contentPost.value;
    postData.attachment = event.target.attachment.value;
    // console.log(postData)
    // const postString = JSON.stringify(postData);
    // console.log(postString)
    // console.log(headers)
    console.log('avant le axios PUT')
    axios.put('http://localhost:3000/api/posts/'+ postId, postData, headers).then((res) => {
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

document.getElementById('form').addEventListener('submit', SendModifiedPost);