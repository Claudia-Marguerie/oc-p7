//TODO: Vérifier si l'utilisateur est connecté, sinon renvoyer l'utilisateur vers la page de login


// axios.get('http://localhost:3000/api/status').then((res) => {
//     console.log(res.data)
// })

// Vérification de l'authentification de l'utilisateur
const userId = localStorage.getItem('userId');
const token = localStorage.getItem('token');
const userAuth = false;
const userData = {firstname: 'firstname', lastname: 'lastname'};
const postList = [];
console.log(userId);

function checkAuth(){
  userAuth = true;
  // a completer échange avec le serveur
  if (!userAuth){
    window.location.href = 'login.html';
  }
}

// Affichage Nom et prénom de l'utilisateur
function displayName(){
  if (userAuth){
    axios.get('http://localhost:3000/api/users/userData').then((res) => {
      userData = res.data;
      document.querySelector('.firstname').textContent = userData.firstname;
      document.querySelector('.lastname').textContent = userData.lastname;
    })
  }
}


function displayPosts(){
  axios.get('http://localhost:3000/api/posts').then((data) => {
    console.log(res.data)
    postList = res.data;
    for(let i = 0; i < postList.length; i++){ //Pour chaque post
      if (userData === userId) { //Si le créateur du post es le même que l'userID

      }
      
        // AFFICHER LE POST (TOUT LE HTML) AVEC BOUTONS DE MODIF / EFFACAGE
      //SINON
        // AFFICHER LE POST SANS BOUTON DE MODIF
    }
  })
  // const listPosts = document.querySelector('.post');
  // const postsListItem = document.createElement('div class="post-image-texte"');
  // postsListItem.innerHTML = 
  // '<img src="' + post.attachment + '"alt="">'+
  // '<div class="only-text">'+
  //     '<h2>'+post.title+'</h2>'+
  //     '<p>'+post.contentPost+'</p>'
  // listPosts.appendChild(postsListItem);
}


function updateLikes(){
  axios.get('http://localhost:3000/api/posts').then((data) => {
    console.log(res.data)
    document.querySelector('.#like-post').textContent = post.likes;
  })
}



// Affichage du bouton TOP
mybutton = document.getElementById("myBtn");

// Quand l'utilisateur scrolls au dessous de 20px d'haut de la page, le bouton s'afiche
window.onscroll = function() {scrollFunction()};

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