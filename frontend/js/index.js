// Vérification de l'authentification de l'utilisateur
const headers = {
    headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
    }
}

const token = localStorage.getItem('token');
const postList = [];
let user = null

// Affichage Nom et prénom de l'utilisateur
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
    localStorage.clear('userId');
    localStorage.clear('token');
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
function displayName(userData) {
    document.querySelector('.firstname').textContent = userData.firstname;
    document.querySelector('.lastname').textContent = userData.lastname;
}


//Affichage des posts
function displayPosts() {
    axios.get('http://localhost:3000/api/posts/getAll', headers).then((res) => {
        const postList = res.data;

        // console.log('postList = ' + postList)

        for (let i = 0; i < postList.length; i++) { //Pour chaque post
            let likeImg = "images/like.png"
            let alreadyLiked = postList[i].Likes.find(like => like.UserId === user.id)
            if (alreadyLiked) {
                likeImg = "images/like-green.png"
            }

            let actionButtons = '';
            if (postList[i].User.id === user.id || user.userAdmin) {
                actionButtons = '<button id="modifybtn_' + postList[i].id + '" class="btn-user--update">Modifier</button>' +
                    '<button id="deletebtn_' + postList[i].id + '" class="btn-user--delete">Effacer</button>';
            }

            //Si le créateur du post es le même que l'userID
            const listPost = document.querySelector('#container_posts');
            const postListItem = document.createElement('div');
            postListItem.innerHTML = // Afficher le post (tout le HTML) avec boutons de modif / effacage
                '<div id="post_' + postList[i].id + '" class="post-item">' +
                '<div class="all-items">' +
                '<div class="top-post">' +
                '<div class="user-data">' +
                '<img src="images/ball_logo.png" alt="Sphère du logo">' +
                '<p>' + postList[i].User.firstname + '</p>' + '<p>' + postList[i].User.lastname + '</p>' +
                '</div>' +
                '<div class="date-time-data">' +
                '<p class="date">' + formatDate(postList[i].updatedAt) + '</p>' + //voir comment afficher la date
                '<p class="time">' + formatTime(postList[i].updatedAt) + '</p>' + // voir comment afficher l'heure
                '</div>' +
                '</div>' +
                '<div class="post">' +
                '<div class="post-image-texte">' +
                // '<img src="' + postList[i].attachment + '" alt="">' +
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
                actionButtons +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>'
            listPost.appendChild(postListItem);

            const modifyBtn = document.querySelector('#modifybtn_' + postList[i].id)
            const deleteBtn = document.querySelector('#deletebtn_' + postList[i].id)

            if(modifyBtn){
                modifyBtn.addEventListener('click', () => {
                    goToModify(postList[i].id)
                })
            }

            if(deleteBtn){
                deleteBtn.addEventListener('click', () => {
                    goToDelete(postList[i].id)
                })
            }


            //addEventListener pour le changement de couleur du like
            document.querySelector('#like_' + postList[i].id).addEventListener('click', () => {
                axios.post('http://localhost:3000/api/posts/' + postList[i].id + '/like', user.id, headers).then(({data}) => {
                    postList[i] = data
                    updateLike(postList[i].id, alreadyLiked, postList[i].Likes.length)
                    alreadyLiked = !alreadyLiked
                })
            })
        }
    });
}


//Retreieve and display post date
function formatDate(unformattedDate) {
    var d = new Date(unformattedDate);
    return d.toLocaleDateString();
}


//Retreieve and display post time
function formatTime(unformattedDate) {
    var d = new Date(unformattedDate);
    return d.toLocaleTimeString();
}


function goToModify(postIdToModify) {
    localStorage.setItem('postIdToModify', postIdToModify); // enregistre l'ID du post a modifier (postIdToModify) dans le local storage
    window.location.href = 'modify_post.html';// renvoie vers la page de modif du post
}


function goToDelete(postIdToDelete) {
    axios.delete('http://localhost:3000/api/posts/' + postIdToDelete, headers).then((res) => {
        refreshPosts();

    }).catch(() => {
        console.log('erreur catch')
        // window.location.href = 'login.html'
    })
}


//Changement de couleur au like
function updateLike(postId, alreadyLiked, nbLikes) {
    const imageDiv = document.querySelector('#like_' + postId);
    if (alreadyLiked) {
        imageDiv.setAttribute("src", "images/like.png");
    } else {
        imageDiv.setAttribute("src", "images/like-green.png");
    }
    document.querySelector('#like-post_' + postId).textContent = nbLikes
}

function refreshPosts() {
    const numberOfDiv = document.getElementById("container_posts").childElementCount; // indique le nonbre de division à effacer
    for (let i = 0; i < numberOfDiv; i++) {  // On demande d'effacer la div dans le DOM
        const postToDelete = document.querySelector('#container_posts div');
        postToDelete.parentNode.removeChild(postToDelete); // on supprime la div du produit à effacer

    }
    displayPosts();
}

function refreshLikes() {
    axios.get('http://localhost:3000/api/posts/getAll', headers).then((res) => {
        const postList = res.data;
        const numberOfDiv = document.getElementById("container_posts").childElementCount; // indique le nonbre de division à effacer
        const postListToUpdate = document.getElementById("container_posts").children;
        console.log('numberOfDiv = ' + numberOfDiv);
        console.log('postListToUpdate.length = ' + postListToUpdate.length);
        for (let i = 0; i < numberOfDiv; i++) {  // On demande d'effacer la div dans le DOM
            // const postToUpdate = document.querySelector('#container_posts div'); 
            console.log('postListToUpdate[' + i + ']');
            console.log(postListToUpdate[i]);
            const divIdToUpdate = postListToUpdate[i].firstChild.getAttribute("id");
            const postIdToUpdate = divIdToUpdate.split("_")[1];
            console.log('i = ' + i + ' ; divIdToUpdate = ' + divIdToUpdate);
            console.log('i = ' + i + ' ; postIdToUpdate = ' + postIdToUpdate);

            const updatedPost = postList.find(post => post.id == postIdToUpdate);
            console.log('updatedPost');
            console.log(updatedPost);

            console.log('updatedPost.likes');
            console.log(updatedPost.likes);
            document.querySelector('#like-post_' + postIdToUpdate).textContent = updatedPost.likes;
            // updatedPost.likes;

            // postList[i].id 
            // document.getElementById("container_posts").childNodes;
            // document.getElementById("myList").firstChild.innerHTML; 
            // postToUpdate.parentNode.removeChild(postToDelete); // on supprime la div du produit à effacer

        }


    })
}

// Affichage du bouton TOP
mybutton = document.getElementById("myBtn");

// Quand l'utilisateur scrolls au dessous de 20px d'haut de la page, le bouton s'afiche
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
// refreshPosts();
