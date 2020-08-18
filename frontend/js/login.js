function login(event){
  event.preventDefault();
  const user = {};
  user.email = event.target.email.value;
  user.password = event.target.password.value;

  // const userObject = JSON.stringify(user);
  console.log(user)

  axios.post('http://localhost:3000/api/users/login', user).then((response) => {
      const data = response.data
      console.log(data)
    //  if (response.data.auth === 'Succes') {
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('token', data.token);
        window.location.href = 'index.html';
      //}
  }), (err) => {
          console.log(err)
      }
}

document.getElementById('form').addEventListener('submit', login);