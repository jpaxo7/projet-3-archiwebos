let modal = null;

//fonction d'ouverture de la modale
const openModal = function (event) {
    event.preventDefault();
    modal = document.querySelector(event.target.getAttribute('href'));
    modal.style.display = "flex";
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-close-modal').addEventListener('click', closeModal);
    modal.querySelector('.modal-wrapper').addEventListener('click', stopPropagation);
};

//fonction de fermeture de la modale
const closeModal = function (event){
    if (modal === null) return;
    event.preventDefault();
    modal.style.display = "none";
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-close-modal').removeEventListener('click', closeModal);
    modal.querySelector('.modal-wrapper').removeEventListener('click', stopPropagation);
    modal = null;
};

//fonction permettant de fermer la modale en cas de click en dehors de la boite modale
const stopPropagation = function (event){
    event.stopPropagation();
}

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