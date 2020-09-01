// Vérification de l'authentification de l'utilisateur
const headers = {
    headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
    }
}


const token = localStorage.getItem('token');
const postList = [];
let user = null


// Recupération et affichage nom et prénom de l'utilisateur
// Recupération et affichage des posts
axios.get('http://localhost:3000/api/users/me', headers).then((res) => {
    user = res.data
    localStorage.setItem('user', JSON.stringify(res.data))
    displayName(res.data)
    displayPosts();
}).catch(() => {
    window.location.href = 'login.html'
})


// Crée le bouton 'deconnexion'
document.querySelector('#logout-button').addEventListener('click', () => {
    localStorage.clear('userId'); // on enlève l'userId et le token du local storage
    localStorage.clear('token');
    window.location.href = 'login.html'; //renvoie vers la page du login
})


// Définition function pour l'affichage des nom et prénom de l'utilisateur
function displayName(userData) {
    document.querySelector('.firstname').textContent = userData.firstname;
    document.querySelector('.lastname').textContent = userData.lastname;
}


// Définition function pour l'affichage des posts
function displayPosts() {
    axios.get('http://localhost:3000/api/posts/getAll', headers).then((res) => {
        const postList = res.data; // on stocke la réponse du serveur

        for (let i = 0; i < postList.length; i++) { // Pour chaque post
            let likeImg = "images/like.png" // image du like par défaut (vide)
            let alreadyLiked = postList[i].Likes.find(like => like.UserId === user.id) // on cherche si l'utilisateur a dejà liké le post
            if (alreadyLiked) { // s'il a liké le poste, on utilise l'image verte du like
                likeImg = "images/like-green.png"
            }

            let actionButtons = '';
            if (postList[i].User.id === user.id || user.userAdmin) { // si l'utilisateur est le créateur du post ou s'il est le userAdmin, on active l'affichage des bouttons Modifier/Supression
                actionButtons = '<button id="modifybtn_' + postList[i].id + '" class="btn-user--update">Modifier</button>' +
                    '<button id="deletebtn_' + postList[i].id + '" class="btn-user--delete">Effacer</button>';
            }

            const listPost = document.querySelector('#container_posts');
            const postListItem = document.createElement('div');
            postListItem.innerHTML = // Affichage du post, le tout en HTML
                '<div id="post_' + postList[i].id + '" class="post-item">' +
                '<div class="all-items">' +
                '<div class="top-post">' +
                '<div class="user-data">' +
                '<img src="images/ball_logo.png" alt="Sphère du logo">' +
                '<p>' + postList[i].User.firstname + '</p>' + '<p>' + postList[i].User.lastname + '</p>' +
                '</div>' +
                '<div class="date-time-data">' +
                '<p class="date">' + formatDate(postList[i].updatedAt) + '</p>' + 
                '<p class="time">' + formatTime(postList[i].updatedAt) + '</p>' + 
                '</div>' +
                '</div>' +
                '<div class="post">' +
                '<div class="post-image-texte">' +
                '<img src="http://localhost:3000/images/' + postList[i].attachment + '" alt="">' +
                '<div class="only-text">' +
                '<h2>' + postList[i].title + '</h2>' +
                '<p>' + postList[i].contentPost + '</p>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="bottom-post">' +
                '<div class="like">' +
                '<img id="like_' + postList[i].id + '" src=' + likeImg + ' alt="">' +
                '<p id="like-post_' + postList[i].id + '">' + postList[i].Likes.length + '</p>' +
                '</div>' +
                '<div class="btn-user">' +
                actionButtons + // si l'utilisateur est le créateur du post ou s'il est le userAdmin, cette string contient le code pour l'affichage des bouttons Modifier/Supression
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>'
            listPost.appendChild(postListItem); // ajout de la nouvelle div dans le DOM

            const modifyBtn = document.querySelector('#modifybtn_' + postList[i].id) // vérifie si le bouton Modifier est créé
            const deleteBtn = document.querySelector('#deletebtn_' + postList[i].id) // vérifie si le bouton Supprimer est créé

            if(modifyBtn){ // ajoute l'action liée au bouton modifier s'il existe
                modifyBtn.addEventListener('click', () => {
                    goToModify(postList[i].id)
                })
            }

            if(deleteBtn){ // ajoute l'action liée au bouton supprimer s'il existe
                deleteBtn.addEventListener('click', () => {
                    goToDelete(postList[i].id)
                })
            }

            // ajoute l'action liée au click sur le bouton like
            document.querySelector('#like_' + postList[i].id).addEventListener('click', () => {
                axios.post('http://localhost:3000/api/posts/' + postList[i].id + '/like', user.id, headers).then(({data}) => { // requête au serveur d'actualiser le status like pour ce post
                    postList[i] = data // on recupère les informations du post (dont les informations like)
                    updateLike(postList[i].id, alreadyLiked, postList[i].Likes.length) // appelle l'actualisation de l'affichage du like pour le post
                    alreadyLiked = !alreadyLiked // inverse le status du like
                })
            })
        }
    });
}


// transforme le format de la date et la transforme en string pour l'affichage
function formatDate(unformattedDate) {
    var d = new Date(unformattedDate);
    return d.toLocaleDateString();
}


// transforme le format de l'heure et la transforme en string pour l'affichage
function formatTime(unformattedDate) {
    var d = new Date(unformattedDate);
    return d.toLocaleTimeString();
}


function goToModify(postIdToModify) {
    localStorage.setItem('postIdToModify', postIdToModify); // enregistre l'ID du post a modifier (postIdToModify) dans le local storage
    window.location.href = 'modify_post.html';// renvoie vers la page de modif du post
}


function goToDelete(postIdToDelete) {
    axios.delete('http://localhost:3000/api/posts/' + postIdToDelete, headers).then((res) => { // requête au serveur d'effacer un post
        refreshPosts(); // on re-affiche tous les posts
    }).catch(() => {
        console.log('erreur catch')
    })
}


// Mise à jour du like
function updateLike(postId, alreadyLiked, nbLikes) {
    const imageDiv = document.querySelector('#like_' + postId); // recherche la div qui correspond à l'image like du post
    if (alreadyLiked) { // si l'utilisateur avait liké ce post précédemment
        imageDiv.setAttribute("src", "images/like.png"); // on change l'image du like vide
    } else {
        imageDiv.setAttribute("src", "images/like-green.png"); // sinon, on change l'image du like vert
    }
    document.querySelector('#like-post_' + postId).textContent = nbLikes
}


// Mise à jour de l'affichage de la liste des produits
function refreshPosts() {
    const numberOfDiv = document.getElementById("container_posts").childElementCount; 
    for (let i = 0; i < numberOfDiv; i++) {  // Pour chacune des div qui contiennent les post
        const postToDelete = document.querySelector('#container_posts div'); // On selectione la div qui contient les div des posts
        postToDelete.parentNode.removeChild(postToDelete); // On demande d'effacer la div dans le DOM
    }
    displayPosts(); // on affiche la liste des posts
}


// Affichage du bouton TOP page
mybutton = document.getElementById("myBtn");


// Quand l'utilisateur scrolls au dessous de 20px d'haut de la page, le bouton s'affiche
window.onscroll = function () {
    scrollFunction()
};


function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}


// Quand l'utilisateur click sur le bouton, le scroll envoie au haut de la page
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
