let modal = null;
let works=[];
let token = window.localStorage.getItem('token');


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
    modal.querySelector('.js-close-modal').addEventListener('click', closeModal);
    // if ((event.target.matches(".js-close-modal") || !event.target.closest(".modal")) && !event.target.matches(".js-modal")){
    //     closeModal();
    // };
};

//fonction de fermeture de la modale
const closeModal = function (){
    if (modal === null) return;
    modal.style.display = "none";
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-close-modal').removeEventListener('click', closeModal);
    modal = null;
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

function generateWorks(works = works){
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
generateWorks(works);

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
 fileInput.addEventListener('change', (event) => {
     const file = event.target.files[0]; // Obtenir le premier fichier sélectionné
     const imageIcon = document.querySelector(".fa-image");
     const inputButton = document.querySelector(".button-photo-input");
     const fileInstruction = document.querySelector(".file-instruction");
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


const workUploadForm = document.querySelector(".photo-upload-form");

workUploadForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(workUploadForm);
    const output = document.querySelector(".output");

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
});