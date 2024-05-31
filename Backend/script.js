let works=[];
//Récupération des projets depuis l'API
async function fetchAndGenerateWorks() {
        const worksResponse = await fetch('http://localhost:5678/api/works');
        works = await worksResponse.json(); // Attendre la résolution de la promesse ici
        console.log(works);
        generateWorks(works);
}

//Récupération des différentes catégories depuis l'API
async function fetchAndGenerateCategories() {
    const categoriesResponse = await fetch('http://localhost:5678/api/categories');
    const categories = await categoriesResponse.json(); // Attendre la résolution de la promesse ici
    console.log(categories);
    generateCategories(categories);
}

//fonction permettant la génération des projets
 function generateWorks(works){

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
function generateCategories(categories){

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
        filterButton.classList.add("filter-button")
        filterButton.dataset.id = categories[i].id;
        filterButton.textContent = filter.name;

        // Attache de chaque bouton à la div des categoriesMenu
        categoriesMenu.appendChild(filterButton);
    }

    
};

//Eventlistener pour filtrer les projets en fonction de leur catégories en cliquant sur le bouton correspondant


//nettoyage des projets dans la div gallery pour génération des projets depuis l'API
document.querySelector(".gallery").innerHTML='';

fetchAndGenerateWorks();
fetchAndGenerateCategories();

let filterButton = document.getElementsByClassName(".filter-button")[0];
console.log(filterButton);
filterButton.addEventListener("click", function() {
const filteredProjet = works.filter(function (projet) {
    return projet.categoryId === filterButton.dataset.id;
    });
    console.log(filteredProjet);
document.querySelector(".gallery").innerHTML='';
generateWorks(filteredProjet);
});


