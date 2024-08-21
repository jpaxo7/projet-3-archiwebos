let modal = null;
let works=[];
let token = window.localStorage.getItem('token');
import {generateWorks} from "./script.js";

const workUploadForm = document.querySelector(".photo-upload-form");
const output = document.querySelector(".output");

//fonction d'ouverture de la modale
const openModal = function (event) {
    event.preventDefault();
    modal = document.querySelector(".modal");
    modal.style.display = "flex";
    modal.addEventListener('click', function(event) {
        if (!event.target.closest(".modal-wrapper")) {
            closeModal();
        }
    });
    modal.querySelectorAll('.js-close-modal')[0].addEventListener('click', closeModal);
    modal.querySelectorAll('.js-close-modal')[1].addEventListener('click', closeModal);
};

//fonction de fermeture de la modale
const closeModal = function (){
    if (modal === null) return;
    modal.style.display = "none";
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-close-modal').removeEventListener('click', closeModal);
    modal = null;
    if (output && output.textContent.includes("Nouveau projet envoyé !")){
        workUploadForm.reset();
        output.innerHTML = "";
        imagePreview.style.display = 'none';
        imageIcon.style.display = 'flex';
        inputButton.style.display = 'block';
        fileInstruction.style.display = 'flex';
    }
    if (output && output.textContent.includes("Seuls les fichiers .jpg ou .png sont autorisés.")){
        workUploadForm.reset();
        output.innerHTML = "";
        imagePreview.style.display = 'none';
        imageIcon.style.display = 'flex';
        inputButton.style.display = 'block';
        fileInstruction.style.display = 'flex';
    }
    if (output && output.textContent.includes("La taille du fichier ne doit pas dépasser 4 Mo.")){
        workUploadForm.reset();
        output.innerHTML = "";
        imagePreview.style.display = 'none';
        imageIcon.style.display = 'flex';
        inputButton.style.display = 'block';
        fileInstruction.style.display = 'flex';
    }
};

//ouverture de la modale à l'écoute du click
document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal);
});

//configuration des actions effectuées par les touches du clavier quand la modale est ouverte
window.addEventListener("keydown", function(event) {
    if (event.key === "Escape" || event.key === "Esc"){
        closeModal(event);
    };
});


const fetchWorks = await fetch("http://localhost:5678/api/works");
works= await fetchWorks.json();

function generateModalWorks(works = works){
    for (let i = 0; i < works.length; i++) {

        const projet = works[i];
         // Récupération de l'élément du DOM qui accueillera la gallerie
        const divGallery = document.querySelector(".modal-gallery");
         // Création d’une balise dédiée à un projet
         const worksElement = document.createElement("figure");
         worksElement.dataset.id = works[i].id;
         worksElement.classList.add("modal-figure");
         // creation des balises
         const imageElement = document.createElement("img");
         imageElement.src = projet.imageUrl;  

         //attache de la balise à la div
         divGallery.appendChild(worksElement);
         worksElement.appendChild(imageElement);
    }
    document.querySelectorAll(".modal-figure").forEach(figure =>{
        const divIcon = document.createElement("div");
        divIcon.classList.add("delete-icon");
        const iconeElement = document.createElement("i");
        iconeElement.classList.add('fa-solid','fa-trash-can');
        figure.appendChild(divIcon);
        divIcon.appendChild(iconeElement);
    });
};

document.querySelector(".modal-gallery").innerHTML='';
generateModalWorks(works);

const nextModal = function (event){
    event.preventDefault();
    const galleryModal = document.querySelector('.photo-gallery');
    galleryModal.style.display = "none";
    const uploadModal = document.querySelector('.photo-upload');
    uploadModal.style.display = "flex";
};

const addWorks = document.querySelector(".add-works");
addWorks.addEventListener("click", nextModal);

const previousModal = function (event){
    event.preventDefault();
    const galleryModal = document.querySelector('.photo-gallery');
    galleryModal.style.display = "flex";
    const uploadModal = document.querySelector('.photo-upload');
    uploadModal.style.display = "none";
};

const previousArrow = document.querySelector(".previous-modal");
previousArrow.addEventListener('click', previousModal);

const deleteButton = document.querySelectorAll(".delete-icon");
deleteButton.forEach(deleteButton =>{
deleteButton.addEventListener('click', () =>{
    const parentFigure = deleteButton.closest('.modal-figure');
    const workId = parentFigure.dataset.id;
    fetch(`http://localhost:5678/api/works/${workId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            console.log("Le travail a été supprimé avec succès !");
            parentFigure.remove();

            const worksToRemove = document.querySelectorAll(`figure[data-id='${workId}']`);
            worksToRemove.forEach(figure => figure.remove());
    } else {
      console.error("Une erreur s'est produite lors de la suppression du travail.");
        }
    })
    .catch(error => {
        console.error("Une erreur s'est produite lors de la suppression du travail :", error);
      });
})
});

    //preview de l'image a uploader
 const fileInput = document.querySelector('.file-input');
 const imagePreview = document.querySelector('.image-preview');
 const imageIcon = document.querySelector(".fa-image");
 const inputButton = document.querySelector(".button-photo-input");
 const fileInstruction = document.querySelector(".file-instruction");
 fileInput.addEventListener('change', (event) => {
     const file = event.target.files[0]; // Obtenir le premier fichier sélectionné
     if (file) {
         const reader = new FileReader();
         
         // Lorsque le fichier est chargé, mettre à jour l'aperçu de l'image
         reader.onload = () => {
             imagePreview.src = reader.result;
             imagePreview.style.display = 'flex';
             imageIcon.style.display = 'none';
             inputButton.style.display = 'none';
             fileInstruction.style.display = 'none';
         };
         
         reader.readAsDataURL(file); // Lire le fichier comme une URL de données
     }
 });


workUploadForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const file = fileInput.files[0];

    // Vérifier si un fichier est sélectionné
    if (!file) {
        output.innerHTML = "Veuillez sélectionner un fichier.";
        return;
    }

    // Vérifier le type de fichier
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
        output.innerHTML = "Seuls les fichiers .jpg ou .png sont autorisés.";
        return;
    }

    // Vérifier la taille du fichier (en octets)
    const maxSize = 4 * 1024 * 1024; // 4 Mo
    if (file.size > maxSize) {
        output.innerHTML = "La taille du fichier ne doit pas dépasser 4 Mo.";
        return;
    }

    const formData = new FormData(workUploadForm);

    fetch("http://localhost:5678/api/works", {
        method: "POST",
        body: formData,
        headers: {
            'Authorization': `Bearer ${token}`,
          }
    })
    .then(response => {
        if (response.status === 201) {
            output.innerHTML = "Nouveau projet envoyé !";
            return response.json();
        } else {
            output.innerHTML = `Erreur ${response.status} lors de la tentative d'envoi du projet.<br />`;
        }
    })
    .then(data => {
        // Ajouter l'image nouvellement téléchargée à la liste works
        works.push(data);
        document.querySelector(".gallery").innerHTML='';
        document.querySelector(".modal-gallery").innerHTML='';
        generateModalWorks(works);
        generateWorks(works);
    })        
});


const submitButton = document.querySelector(".project-submit");

const checkFormValidity = () => {
    // Vérifie si tous les champs requis sont valides
    const isFormValid = workUploadForm.checkValidity();

    if (isFormValid) {
        submitButton.disabled = false;
        submitButton.style.backgroundColor = "#1D6154";
        submitButton.style.cursor = "pointer";
    } else {
        submitButton.disabled = true;
        submitButton.style.backgroundColor = "#A7A7A7"; 
        submitButton.style.cursor = "not-allowed";
    }
};

// Écoute les événements d'entrée sur tous les champs du formulaire
workUploadForm.addEventListener("input", checkFormValidity);

// Appel initial pour vérifier l'état du formulaire au chargement de la page
checkFormValidity();
