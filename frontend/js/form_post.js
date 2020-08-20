function addPost(event) {
    event.preventDefault();
    const post = {};
    post.title = event.target.title.value;
    post.contentPost = event.target.contentPost.value;
    post.attachment = event.target.attachment.value;
    console.log(post)

    axios.post('http://localhost:3000/api/posts/', post).then((response) => {
        const data = response.data
        document.location.href = 'index.html'; // Redirection vers la page d'accueil
    }), (err) => {
            console.log(err)
        }
}

document.getElementById('form').addEventListener('submit', addPost);