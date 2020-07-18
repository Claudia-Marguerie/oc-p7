//TODO: Vérifier si l'utilisateur est connecté, sinon renvoyer l'utilisateur vers la page de login


axios.get('http://localhost:3000/api/status').then((res) => {
    console.log(res.data)
})
