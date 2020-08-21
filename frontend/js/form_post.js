//Vérifier si l'utilisateur est connecté, sinon renvoyer l'utilisateur vers la page de login
const headers = {
    headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
    }
}

axios.get('http://localhost:3000/api/users/me', headers).then((res) => {
    displayName(res.data)

}).catch(() => {
    window.location.href = 'login.html'
})


// Affichage Nom et prénom de l'utilisateur
function displayName(userData) {
    document.querySelector('.firstname').textContent = userData.firstname;
    document.querySelector('.lastname').textContent = userData.lastname;
}


function addPost(event) {
    event.preventDefault();
    const post = {};
    post.title = event.target.title.value;
    post.contentPost = event.target.contentPost.value;
    post.attachment = event.target.attachment.value;
    console.log(post)
    const postString = JSON.stringify(post);
    console.log(postString)
    console.log(headers)

    axios.post('http://localhost:3000/api/posts/new', postString).then((res) => {
        document.location.href = 'index.html'; // Redirection vers la page d'accueil
        }).catch(() => {
            console.log('erreur catch')
            // window.location.href = 'login.html'
        })
}

document.getElementById('form').addEventListener('submit', addPost);