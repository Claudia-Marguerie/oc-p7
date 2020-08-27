// Vérification de l'authentification de l'utilisateur
const headers = {
    headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
    }
}

// Affichage Nom et prénom de l'utilisateur
axios.get('http://localhost:3000/api/users/me', headers).then((res) => {
    displayName(res.data)

}).catch(() => {
    window.location.href = 'login.html'
})


const user = JSON.parse(localStorage.getItem('user'));
const userId = user.id;
const token = localStorage.getItem('token');
const userAdmin = false;
const postList = [];


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


//Affichage des posts
function displayPosts() {
     axios.get('http://localhost:3000/api/posts/getAll', headers).then((res) => {
        // console.log(res)
        const postList = res.data;

        // console.log('postList = ' + postList)

        for (let i = 0; i < postList.length; i++) { //Pour chaque post
            // console.log('postList[i] = ' + postList[i])
            // console.log(postList[i])
            // console.log('postList[i].userId = ' + postList[i].userId)
            // console.log('userId = ' + userId)
            
            if (postList[i].userAlreadyLiked){
                likeImg = "images/like-green.png"
            } else {
                likeImg = "images/like.png"
            }

            if (postList[i].userId == userId) { //Si le créateur du post es le même que l'userID
                const listPost = document.querySelector('#container_posts');
                const postListItem = document.createElement('div');
                postListItem.innerHTML = // Afficher le post (tout le HTML) avec boutons de modif / effacage
                    '<div id="post_' + postList[i].id + '" class="post-item">' +
                    '<div class="all-items">' +
                    '<div class="top-post">' +
                    '<div class="user-data">' +
                    '<img src="images/ball_logo.png" alt="Sphère du logo">' +
                    '<p>' + postList[i].authorFirstName + '</p>' + '<p>' + postList[i].authorLastName + '</p>' +
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
                    '<p id="like-post_' + postList[i].id + '">' + postList[i].likes + '</p>' +
                    '</div>' +
                    '<div class="btn-user">' +
                    '<button id="modifybtn_' + postList[i].id +'" class="btn-user--update">Modifier</button>' +
                    '<button id="deletebtn_' + postList[i].id +'" class="btn-user--delete">Effacer</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
                listPost.appendChild(postListItem);

                document.querySelector('#modifybtn_' + postList[i].id).addEventListener('click', () => {
                    goToModify(postList[i].id)
                })
                document.querySelector('#deletebtn_' + postList[i].id).addEventListener('click', () => {
                    goToDelete(postList[i].id)
                })

            } else { // sinon
                const listPost = document.querySelector('#container_posts');
                const postListItem = document.createElement('div');
                postListItem.innerHTML = // Afficher le post sans boutons de modif / effacage
                    '<div id="post_' + postList[i].id + '" class="post-item">' +
                    '<div class="all-items">' +
                    '<div class="top-post">' +
                    '<div class="user-data">' +
                    '<img src="images/ball_logo.png" alt="Sphère du logo">' +
                    '<p>' + postList[i].authorFirstName + '</p>' + '<p>' + postList[i].authorLastName + '</p>' +
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
                    '<p id="like-post_' + postList[i].id + '">' + postList[i].likes + '</p>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
                listPost.appendChild(postListItem);
            } 
            

            //addEventListener pour le changement de couleur du like
            document.querySelector('#like_' + postList[i].id).addEventListener('click', () => {
                changeImageLike('like_' + postList[i].id)
                userLike(postList[i].id)
            })
        }
    })
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


function goToModify(postIdToModify){
    localStorage.setItem('postIdToModify', postIdToModify); // enregistre l'ID du post a modifier (postIdToModify) dans le local storage
    window.location.href = 'modify_post.html';// renvoie vers la page de modif du post
}


function goToDelete(postIdToDelete){
    axios.delete('http://localhost:3000/api/posts/'+ postIdToDelete, headers).then((res) => {
        console.log('après PUT')
        const data = res.data
        console.log(data)
        // localStorage.setItem("postData", JSON.stringify(data.postData)) // on converti la liste en string pour qu'elle soit lisible par javascript. 
        // localStorage.setItem('token', data.token);
        console.log('post effacé')
        //window.location.href = 'index.html'; // Redirection vers la page d'accueil

        //effacer le post du DOM
        // const numberOfDiv = document.getElementById("container_posts").childElementCount; // indique le numéro de la division à effacer

        // for(let i = 1; i <= numberOfDiv; i++){  // On demande d'effacer la div dans le DOM
        //     const postToDelete = document.querySelector('#container_posts div'); 
        //     postToDelete.parentNode.removeChild(postToDelete); // on supprime la div du produit à effacer
            
        // }
        refreshPosts();

        }).catch(() => {
            console.log('erreur catch')
            // window.location.href = 'login.html'
        })
}


//Changement de couleur au like
function changeImageLike(likeBtnId){
    console.log(likeBtnId);
    var imageDiv = document.getElementById(likeBtnId);
    console.log(imageDiv);
    const imageNameCurrent = imageDiv.getAttribute("src");
  if (imageNameCurrent == "images/like-green.png"){
    imageNameNew = "images/like.png";  
    console.log('yes');
  } else {
   imageNameNew = "images/like-green.png";
   console.log('yes');
   }
   console.log(imageNameNew);
   imageDiv.setAttribute("src", imageNameNew);	   
}


function userLike(postId) {
    console.log('changement du like pour le post no.'+postId)
    console.log(userId)
    axios.post('http://localhost:3000/api/posts/'+postId+'/like', userId, headers).then((res) => {
        console.log(res.data);
        // refreshPosts();
        refreshLikes();
    })
}


function refreshPosts() {
    const numberOfDiv = document.getElementById("container_posts").childElementCount; // indique le nonbre de division à effacer
    console.log('numberOfDiv (refresh) = ' + numberOfDiv);
    for(let i = 0; i < numberOfDiv; i++){  // On demande d'effacer la div dans le DOM
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
        for(let i = 0; i < numberOfDiv; i++){  // On demande d'effacer la div dans le DOM
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


displayPosts();
// refreshPosts();