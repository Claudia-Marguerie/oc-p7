//Vérifier si l'utilisateur est connecté, sinon renvoyer l'utilisateur vers la page de login
const headers = {
    headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
    }
}


axios.post('http://localhost:3000/api/posts/', headers, post).then((res) => {
    addPost(res.data)

}).catch(() => {
    window.location.href = 'login.html'
})

const userId = localStorage.getItem('userId');
const token = localStorage.getItem('token');


// Affichage Nom et prénom de l'utilisateur
function displayName(userData) {
    document.querySelector('.firstname').textContent = userData.firstname;
    document.querySelector('.lastname').textContent = userData.lastname;
}


function addPost(event) {
    if (localStorage.getItem('token')) {
        event.preventDefault();
        const post = {};
        post.title = event.target.title.value;
        post.contentPost = event.target.contentPost.value;
        post.attachment = event.target.attachment.value;
        console.log(post)
    
        document.location.href = 'index.html'; // Redirection vers la page d'accueil
    }
}

document.getElementById('form').addEventListener('submit', addPost);