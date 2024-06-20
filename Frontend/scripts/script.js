let works=[];
let categories = [];
// récupération du token stocké dans le local storage
let token = window.localStorage.getItem('token');

const login = document.querySelector("nav .login");
const logout = document.querySelector("nav .logout");

const fetchCategories = await fetch("http://localhost:5678/api/categories");
categories= await fetchCategories.json();

const fetchWorks = await fetch("http://localhost:5678/api/works");
works= await fetchWorks.json();



//eventlistner au click balise logout pour effacer token
function logoutAddEventListener(){
    const topModalCss = document.querySelector(".top-modal-css");
    const cssModal = document.querySelector(".css-modal");
    if(token){
        login.style.display="none";
        logout.style.display="block";
        topModalCss.style.display="flex";
        cssModal.style.display="block";
        logout.addEventListener("click", function(){
            window.localStorage.removeItem('token');
            window.location.href = 'index.html';
        });
    }
}

logoutAddEventListener();

//Récupération des projets depuis l'API

// //Récupération des différentes catégories depuis l'API


//fonction permettant la génération des projets
 function generateWorks(works = works){
    for (let i = 0; i < works.length; i++) {

        const projet = works[i];
         // Récupération de l'élément du DOM qui accueillera la gallerie
        const divGallery = document.querySelector(".gallery");
         // Création d’une balise dédiée à un projet
         const worksElement = document.createElement("figure");
         worksElement.dataset.id = works[i].id;
         // creation des balises
         const imageElement = document.createElement("img");
         imageElement.src = projet.imageUrl;  
         const titreElement = document.createElement("figcaption");
         titreElement.innerText = projet.title;

         //attache de la balise à la div
         divGallery.appendChild(worksElement);
         worksElement.appendChild(imageElement);
         worksElement.appendChild(titreElement);
    }

}

//Fonction permettant la génération des boutons du menu catégories avec les catégories présentes dans l'API
function generateCategories(){

        // //création de la balise menu de catégories
        const categoriesMenu = document.createElement("div");
        categoriesMenu.classList.add('categories-menu');

        // // Récupération des éléments du DOM pour mise en place dans le fichier HTML
        const sectionPortfolio = document.querySelector("#portfolio");
        const divGallery = document.querySelector(".gallery");
        sectionPortfolio.insertBefore(categoriesMenu, divGallery);

        categories.unshift({id:4, name:"Tous"})

        //Boucle permettant la récupération dynamique des boutons et de leur nom
    for (let i = 0; i < categories.length; i++) {

        const filter = categories[i];

        //création des boutons
        const filterButton = document.createElement("button");
        filterButton.classList.add("filter-button");
        filterButton.dataset.id = categories[i].id;
        filterButton.textContent = filter.name;

        // Attache de chaque bouton à la div des categoriesMenu
        categoriesMenu.appendChild(filterButton);
    }
};


//Eventlistener pour filtrer les projets en fonction de leur catégories en cliquant sur le bouton correspondant


//nettoyage des projets dans la div gallery pour génération des projets depuis l'API
document.querySelector(".gallery").innerHTML='';
generateWorks(works);
generateCategories();

let filterButtons = document.querySelectorAll(".filter-button");
for (let i = 0; i<4; i++){
    filterButtons[i].addEventListener("click", function() {
        if (i === 0) {
            document.querySelector(".gallery").innerHTML = '';
            generateWorks(works); // Afficher tous les projets
        } else {
            const filteredProjet = works.filter(function (projet) {
                console.log(projet.categoryId);
                console.log(filterButtons[i].dataset.id);
                return projet.categoryId === parseInt(filterButtons[i].dataset.id);
                });
            document.querySelector(".gallery").innerHTML='';
            console.log(filteredProjet);
            generateWorks(filteredProjet);
        }
    });
};


