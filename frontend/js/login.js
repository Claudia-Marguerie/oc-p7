const logIn = document.querySelector('form');

logIn.addEventListener('submit', function (e) {
  e.preventDefault()
  const email = e.target.email.value;
  const password = e.target.password.value;

  axios.post('http://localhost:3000/login', { email, password }).then((resp) => {
    if (resp.data.status === 'OK') {
      localStorage.setItem('token', resp.data.token);
      window.location.href = 'index.html';
    }
  }, (err) => {
    alert("Votre compte n'existe pas, merci de vous inscrire d'abord");
    window.location.href = 'signup.html'
  });
});