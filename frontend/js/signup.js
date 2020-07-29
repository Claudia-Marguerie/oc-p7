class userObject {
    constructor(first_name, last_name, email, password){
        this.last_name = last_name;
        this.first_name = first_name;
        this.email = email;
        this.password = password;
    }
}

const user = new userObject()

function formValid() { 
    document.getElementById('form').addEventListener('submit', checkAndSubmitData);
}

function checkAndSubmitData(event){
    user.last_name = event.target.last_name.value; // on cree le tableau du user avec les donnés entrées dans le formulaire
    user.first_name = event.target.first_name.value;
    user.email = event.target.email.value;
    user.password = event.target.password.value;
    
    const formOK = formCheck(event); // on stock le résultat de la vérification du formulaire 

    if (formOK){ // Si le formulaire à un bon format 
       
        const orderContentObject = {contact: contact, products: products} // on crée un objet contenant l'objet contact et l'objet product pour envoyer au serveur
        const orderContent = JSON.stringify(orderContentObject); // on le transforme en string

        ajax.post('http://localhost:3000/api/cameras/order',orderContent).then((response) => { // on envoie les données au serveur
            orderId = response.orderId // on stock l'identifiant de la commande donné par le serveur

            orderPrice = 0; // on crée une variable pour recalculer le prix
            let orderedProducts = response.products // on récupère la liste des produits commandées

            for(let i = 0; i < orderedProducts.length; i++){ // boucle pour calculer le prix total de la commande
                orderPrice = orderPrice + orderedProducts[i].price; // on adissione les prix des produits i dans la liste commandée
            }

            let newCartContent = [] // on crée une nouvelle liste vide
            localStorage.setItem("storedCartContent", JSON.stringify(newCartContent)) // on converti la liste en string pour qu'elle soit lisible par javascript. On écrasse le panier stocké en local avec le panier à 0

            document.location.assign('command.html?orderId='+ orderId+ '&orderPrice='+ orderPrice); // on envoie l'id de la commande et le prix total vers la page de confirmation de commande

        }, (err) => {
            console.log(err)
        })
    }
}

function formCheck(event) {
    event.preventDefault()
    const formOK = true;
    const lastName = event.target.last_name;
    const firstName = event.target.first_name;
    const email = event.target.email;
    const password = event.target.password;

    if (lastName.validity.valueMissing == false) ||
        firstName.validity.valueMissing == false) ||
        email.validity.valueMissing == false) ||
        password.validity.valueMissing == false)
        ) {
        event.preventDefault();
        formOK = false;
    } 
    return formOK;
}