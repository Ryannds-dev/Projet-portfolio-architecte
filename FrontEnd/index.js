// RECUPERATION DES TRAVAUX DE L'ARCHITECTE GRACE A L'API ET INJECTION DANS HTML

const URL_WORKS = "http://localhost:5678/api/works";
const URL_CATEGORIES = "http://localhost:5678/api/categories";
const gallery = document.querySelector(".gallery");

let works = [];
let categories = [];

async function loadWorks() {
  const reponseAPI = await fetch(URL_WORKS);
  console.log("Reponse de l'API pour loadWorks : ", reponseAPI);
  works = await reponseAPI.json();

  works.forEach((work) => {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);

    gallery.appendChild(figure);
  });
  console.log(works);
}

async function loadFilters() {
  const reponseAPI = await fetch(URL_CATEGORIES);
  categories = await reponseAPI.json();

  const lesFiltres = document.querySelector(".les-filtres");
  const buttonTous = document.createElement("button");
  buttonTous.textContent = "Tous";
  buttonTous.className = "un-filtre selected";
  lesFiltres.appendChild(buttonTous);

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.className = "un-filtre";

    lesFiltres.appendChild(button);
  });
  console.log(categories);
}

function updateWorks(works) {
  gallery.innerHTML = "";
  works.forEach((work) => {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);

    gallery.appendChild(figure);
  });
}

async function pageFiltre() {
  await loadWorks();
  await loadFilters();

  const buttons = document.querySelectorAll(".un-filtre");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedCategory = button.textContent;
      let id;
      let filteredWorks;

      buttons.forEach((button) => {
        button.classList.remove("selected");
      });
      button.classList.add("selected");
      if (selectedCategory === "Tous") {
        filteredWorks = works;
      } else {
        categories.forEach((category) => {
          if (selectedCategory === category.name) {
            id = category.id;
          }
        });
        filteredWorks = works.filter((work) => work.categoryId === id);
      }

      updateWorks(filteredWorks);
    });
  });
}

function pageAdmin() {
  // BARRE NOIRE DU MODE ADMIN
  const editorBar = document.createElement("div");
  editorBar.className = "editor-mode-bar";

  const editorBarContainer = document.createElement("div");
  editorBarContainer.className = "editor-mode-bar-container";

  const icon1 = document.createElement("i");
  icon1.className = "fa-regular fa-pen-to-square";

  const modeEdition = document.createElement("p");
  modeEdition.textContent = "Mode édition";

  editorBar.appendChild(editorBarContainer);
  editorBarContainer.appendChild(icon1);
  editorBarContainer.appendChild(modeEdition);
  document.body.prepend(editorBar);
  // BARRE NOIRE DU MODE ADMIN FIN

  // CHANGER LOGIN EN LOGOUT
  const headerLogin = document.querySelector("header nav ul li:nth-child(3)");
  headerLogin.textContent = "logout";

  headerLogin.addEventListener("click", () => {
    localStorage.removeItem("token"); // supprime le token
    location.reload(); // recharge la page
  });
  // CHANGER LOGIN EN LOGOUT FIN

  // BOUTON MODIFIER A COTE DU TITRE "MES PROJETS"
  const mesProjets = document.querySelector("#portfolio h2");
  const portfolio = document.getElementById("portfolio");
  portfolio.removeChild(mesProjets);

  const titleAndModifButton = document.createElement("div");
  titleAndModifButton.className = "title-and-modif-button";

  const modifButton = document.createElement("div");
  modifButton.className = "modif-button";

  const icon2 = document.createElement("i");
  icon2.className = "fa-regular fa-pen-to-square";

  const modifier = document.createElement("p");
  modifier.textContent = "modifier";

  modifButton.appendChild(icon2);
  modifButton.appendChild(modifier);

  titleAndModifButton.appendChild(mesProjets);
  titleAndModifButton.appendChild(modifButton);
  portfolio.prepend(titleAndModifButton);
  // BOUTON MODIFIER A COTE DU TITRE "MES PROJETS" FIN

  // FAIRE DISPARAITRE SECTION DES FILTRES
  const filters = document.querySelector("#portfolio .les-filtres");
  portfolio.removeChild(filters);
  titleAndModifButton.style.marginBottom = "50px";
  // FAIRE DISPARAITRE SECTION DES FILTRES FIN
}

async function deleteWork(id) {
  const token = localStorage.getItem("token");

  const response = await fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      // CAR UNE DES ERREURS C'EST UNAUTHORIZED CE QUI MONTRE QU'IL FAUT PROUVER QU'ON EST ADMIN
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    console.log(`Travail avec l'id ${id} supprimé !`);
  } else {
    console.error("Erreur :", response.status);
  }
}

function modifierGalerieWaiter() {
  //AFFICHER GALLERIE
  const modifier = document.querySelector(".modif-button");
  modifier.addEventListener("click", () => {
    modifierGalerie();
  });
}

function modifierGalerie() {
  const modalContainer = document.createElement("div");
  modalContainer.className = "modal-container";

  const modal = document.createElement("div");
  modal.className = "modal";

  const modalHeader = document.createElement("div");
  modalHeader.className = "modal-header";

  const x = document.createElement("i");
  x.className = "fa-solid fa-xmark";

  modalHeader.appendChild(x);
  modal.appendChild(modalHeader);

  const galeriePhoto = document.createElement("p");
  galeriePhoto.textContent = "Galerie photo";

  modal.appendChild(galeriePhoto);

  const modalGallery = document.createElement("div");
  modalGallery.className = "modal-gallery";

  works.forEach((work) => {
    const figure = document.createElement("figure");
    figure.className = "work";
    //DATASET.ID POUR NE PAS CASSER HTML AVEC DES ID
    figure.dataset.id = work.id;

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const trashDelete = document.createElement("i");
    trashDelete.className = "fa-solid fa-trash";

    figure.appendChild(img);
    figure.appendChild(trashDelete);

    modalGallery.appendChild(figure);
    //AFFICHER GALLERIE FIN
  });

  // FERMETURE FENETRE MODALE
  const modalFooter = document.createElement("div");
  modalFooter.className = "modal-footer";

  const ajouterPhotoButton = document.createElement("input");
  ajouterPhotoButton.type = "submit";
  ajouterPhotoButton.value = "Ajouter une photo";

  modalFooter.appendChild(ajouterPhotoButton);

  modal.appendChild(modalGallery);
  modal.appendChild(modalFooter);
  modalContainer.appendChild(modal);
  document.body.prepend(modalContainer);

  x.addEventListener("click", () => {
    modalContainer.remove();
  });

  modalContainer.addEventListener("click", (e) => {
    if (e.target === modalContainer) {
      modalContainer.remove();
    }
  });

  // FERMETURE FENETRE MODALE FIN

  // SUPPRIMER UNE OEUVRE
  const lesTrashDelete = document.querySelectorAll(".fa-solid.fa-trash");

  lesTrashDelete.forEach((trash) => {
    trash.addEventListener("click", (e) => {
      const figure = e.target.closest("figure.work"); // on remonte au parent figure
      const id = figure.dataset.id;

      deleteWork(id);
      figure.remove();
    });
  });
  // SUPPRIMER UNE OEUVRE FIN

  //SWITCH SUR ONGLET AJOUTER PHOTO
  ajouterPhotoButton.addEventListener("click", () => {
    ajouterPhoto();
  });
}

function ajouterPhoto() {
  const modalContainer = document.querySelector(".modal-container");
  const modal = document.querySelector(".modal");
  const modalHeader = document.querySelector(".modal-header");

  //MODAL HEADER
  const leftArrow = document.createElement("i");
  leftArrow.className = "fa-solid fa-arrow-left";

  modalHeader.prepend(leftArrow);
  modalHeader.style.justifyContent = "space-between";

  modal.querySelector("p").textContent = "Ajout photo";

  //MODAL ADDPHOTO
  const modalGallery = document.querySelector(".modal-gallery");
  modal.removeChild(modalGallery);

  const modalAddPhoto = document.createElement("div");
  modalAddPhoto.className = "modal-addphoto";

  const logoImg = document.createElement("img");
  logoImg.src = "./assets/icons/photo.png";
  logoImg.alt = "photo icon";

  const inputAjouterPhoto = document.createElement("input");
  inputAjouterPhoto.type = "submit";
  inputAjouterPhoto.value = "+ Ajouter photo";

  const criteresImg = document.createElement("p");
  criteresImg.textContent = "jpg, png : 4mo max";

  modalAddPhoto.appendChild(logoImg);
  modalAddPhoto.appendChild(inputAjouterPhoto);
  modalAddPhoto.appendChild(criteresImg);
  modal.appendChild(modalAddPhoto);

  //FORM PHOTO
  const formPhoto = document.createElement("form");
  formPhoto.id = "form-photo";

  const labelTitre = document.createElement("label");
  labelTitre.textContent = "Titre";
  labelTitre.htmlFor = "title";

  const inputTitre = document.createElement("input");
  inputTitre.type = "text";
  inputTitre.name = "title";
  inputTitre.id = "title";

  const labelCategory = document.createElement("label");
  labelCategory.textContent = "Catégorie";
  labelCategory.htmlFor = "category";

  const inputCategoryContainer = document.createElement("div");
  inputCategoryContainer.className = "input-category-container";

  const inputCategory = document.createElement("input");
  inputCategory.type = "text";
  inputCategory.name = "category";
  inputCategory.id = "category";
  inputCategory.readOnly = true;

  const arrowDown = document.createElement("i");
  arrowDown.className = "fa-solid fa-arrow-down";

  inputCategoryContainer.appendChild(inputCategory);
  inputCategoryContainer.appendChild(arrowDown);

  formPhoto.appendChild(labelTitre);
  formPhoto.appendChild(inputTitre);
  formPhoto.appendChild(labelCategory);
  formPhoto.appendChild(inputCategoryContainer);
  modal.appendChild(formPhoto);

  //MODAL FOOTER
  const modalFooter = document.querySelector(".modal-footer");
  const footerInput = modalFooter.querySelector("input");
  footerInput.id = "valider-off";
  footerInput.form = "form-photo";
  footerInput.value = "Valider";
  modal.append(modalFooter);

  //FLECHE POUR REVENIR EN ARRIERE :
  leftArrow.addEventListener("click", () => {
    modalContainer.remove();
    modifierGalerie();
  });
}

// pas besoin d'appeler encore une fois loadWorks et loadFilters parce que les mettre en await dans filter ça implique déjà que ça les lance

async function init() {
  const token = localStorage.getItem("token");
  await pageFiltre();
  if (token) {
    pageAdmin();
    modifierGalerieWaiter();
  }
}

init();
