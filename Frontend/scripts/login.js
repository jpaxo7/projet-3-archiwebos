// fonction pour connexion a la page via l'api
function LoginAddEventListener(){
//création de la variable à exploiter
const loginForm = document.querySelector(".login-form");
//add event listener concernant l'envoi des informations de connexion
loginForm.addEventListener("submit", function(event){
    event.preventDefault();
    // création des éléments ayant pour but de recevoir les identifiants de connexion
    let login = {
        email: event.target.querySelector("[name=email]").value,
        password: event.target.querySelector("[name=password]").value,
    };
    // conversion de la charge utile au format json
    const payload = JSON.stringify(login);
        //appel de la donction fetch avec les informations nécéssaires
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: payload
        })
        //vérification de la réponse
        .then((response) => {
            if (response.status==200){
                return response.json();
            } else {
                document.getElementById("error").style.display="block";
                console.log("Erreur dans l’identifiant ou le mot de passe");
            }
        })
        .then(function tokenStorage (data){
            let token = data.token;
            // stockage du token en local storage
            window.localStorage.setItem('token', token);
            console.log("Connexion réussie et token stocké.");
            // Redirection après connexion réussie
            window.location.href = 'index.html'; 
        })
    });
};

LoginAddEventListener();
