function login(event){
  event.preventDefault();
  const user = {}; // on cree le tableau du user avec les donnés entrées dans le formulaire
  user.email = event.target.email.value;
  user.password = event.target.password.value;

  axios.post('http://localhost:3000/api/users/login', user).then((response) => {
      const data = response.data
     if (response.data.auth === 'Succes') { // on vérifie l'authentification de l'utilisateur
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        window.location.href = 'index.html'; // Redirection vers la page d'accueil
        }
  }), (err) => {
          console.log(err)
      }
}

document.getElementById('form').addEventListener('submit', login);
