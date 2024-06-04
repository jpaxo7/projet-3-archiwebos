// récupération du token stocké dans le local storage
let token = window.localStorage.getItem('token');

// fonction pour connexion a la page via l'api
function LoginAddEventListener(){
    //création de la variable à exploiter
    const loginForm = document.querySelector(".login-form");

    //add event listener concernant l'envoi des informations de connexion
    loginForm.addEventListener("submit", async function(event){
        event.preventDefault();

        // création des éléments ayant pour but de recevoir les identifiants de connexion
        let login = {
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=password]").value,
        };

        // conversion de la charge utile au format json
        const payload = JSON.stringify(login);

        try{
            //appel de la donction fetch avec les informations nécéssaires
            const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: payload
            });

            //vérification de la réponse
            if (response.ok) {
                // récupération du token depuis la réponse
                const data = await response.json();
                token = data.token;

                // stockage du token en local storage
                window.localStorage.setItem('token', token);
                console.log("Connexion réussie et token stocké.");
                // Redirection après connexion réussie
                //window.location.href = '../FrontEnd/index.html'; 
            } else {
                console.log("Erreur dans l’identifiant ou le mot de passe");
            }
        } catch (error) {
            console.error("Erreur de connexion :", error);
        }
    });
};

// si absence de token en local storage
if (token === null){
        LoginAddEventListener();
    }else{
        token = JSON.parse(token);
        // Redirection après connexion réussie
        //window.location.href = '../FrontEnd/index.html'; 
};