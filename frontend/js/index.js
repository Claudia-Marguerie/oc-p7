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
    axios.get('http://localhost:3000/api/users/' + userData).then((res) => {
      userData = res.data;
      document.querySelector('.firstname').textContent = userData.firstname;
      document.querySelector('.lastname').textContent = userData.lastname;
    })
  }
}


    // title: DataTypes.STRING,
    // contentPost: DataTypes.STRING,
    // attachment: DataTypes.STRING,
    // likes: DataTypes.INTEGER,
    // authorId: DataTypes.STRING,
    // authorFirstName: DataTypes.STRING,
    // authorLastName: DataTypes.STRING,
    // creationDateTime: DataTypes.NUMBER,


function displayPosts(){
  axios.get('http://localhost:3000/api/posts').then((data) => {
    console.log(res.data)
    postList = res.data;
    for(let i = 0; i < postList.length; i++){ //Pour chaque post
      if (postList[i].author === userId) { //Si le créateur du post es le même que l'userID
        const listPost = document.querySelector('#container_posts'); 
        const postListItem = document.createElement('div');
        postListItem.innerHTML = // Afficher le post (tout le HTML) avec boutons de modif / effacage
        '<div class="post-item">'+
          '<div class="all-items">'+
            '<div class="top-post">'+
                '<div class="user-data">'+
                    '<img src="images/ball_logo.png" alt="Sphère du logo">'+
                    '<p>'+postList[i].authorFirstName+'</p>'+'<p>'+postList[i].authorLastName+'</p>'+
                '</div>'+
                '<div class="date-time-data">'+
                    '<p class="date">'+postList[i].creationDateTime+'</p>'+ //voir comment afficher la date
                    '<p class="time">12:00</p>'+ // voir comment afficher l'heure
                '</div>'+
            '</div>'+
            '<div class="post">'+
                '<div class="post-image-texte">'+
                    '<img src="'+postList[i].attachment+'" alt="">'+
                    '<div class="only-text">'+
                        '<h2>'+postList[i].title+'</h2>'+
                        '<p>'+postList[i].contentPost+'</p>'+
                    '</div>'+
                '</div>'+
            '</div>'+
            '<div class="bottom-post">'+
                '<div class="like">'+
                    '<a href=""><img src="images/like.png" alt=""></a>'+
                    '<p id="like-post">'+postList[i].likes+'</p>'+
                '</div>'+
                '<div class="btn-user">'+
                    '<button class="btn-user--update">Modifier</button>'+
                    '<button class="btn-user--delete">Effacer</button>'+
                '</div>'+
            '</div>'+
        '</div>'+
      '</div>'
      listPost.appendChild(postListItem);
      } else { // sinon
        const listPost = document.querySelector('#container_posts'); 
        const postListItem = document.createElement('div');
        postListItem.innerHTML = // Afficher le post sans boutons de modif / effacage 
        '<div class="post-item">'+
          '<div class="all-items">'+
            '<div class="top-post">'+
                '<div class="user-data">'+
                    '<img src="images/ball_logo.png" alt="Sphère du logo">'+
                    '<p>'+postList[i].authorFirstName+'</p>'+'<p>'+postList[i].authorLastName+'</p>'+
                '</div>'+
                '<div class="date-time-data">'+
                    '<p class="date">'+postList[i].creationDateTime+'</p>'+ //voir comment afficher la date
                    '<p class="time">12:00</p>'+ // voir comment afficher l'heure
                '</div>'+
            '</div>'+
            '<div class="post">'+
                '<div class="post-image-texte">'+
                    '<img src="'+postList[i].attachment+'" alt="">'+
                    '<div class="only-text">'+
                        '<h2>'+postList[i].title+'</h2>'+
                        '<p>'+postList[i].contentPost+'</p>'+
                    '</div>'+
                '</div>'+
            '</div>'+
            '<div class="bottom-post">'+
                '<div class="like">'+
                    '<a href=""><img src="images/like.png" alt=""></a>'+
                    '<p id="like-post">'+postList[i].likes+'</p>'+
                '</div>'+
            '</div>'+
        '</div>'+
      '</div>'
      listPost.appendChild(postListItem);
      }
    }
  })
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