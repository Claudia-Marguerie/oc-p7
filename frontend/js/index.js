//TODO: Vérifier si l'utilisateur est connecté, sinon renvoyer l'utilisateur vers la page de login


// axios.get('http://localhost:3001/api/status').then((res) => {
//     console.log(res.data)
// })

const userId = localStorage.getItem('userId');
console.log(userId);



//Get the TOP button:
mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
