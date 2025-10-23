// RECUPERATION DES TRAVAUX DE L'ARCHITECTE GRACE A L'API ET INJECTION DANS HTML

const URL_WORKS = "http://localhost:5678/api/works";
const URL_CATEGORIES = "http://localhost:5678/api/categories";
const gallery = document.querySelector(".gallery");
const modalGallery = document.querySelector(".modal-gallery");

let works = [];
let categories = [];
let selectedFile;

async function fetchWorks() {
  const responseAPI = await fetch(URL_WORKS);
  works = await responseAPI.json();
}

async function fetchCategories() {
  const responseAPI = await fetch(URL_CATEGORIES);
  categories = await responseAPI.json();
}

function loadWorks(list, mode = "page") {
  if (mode === "page") {
    gallery.innerHTML = "";
  } else if (mode === "modal") {
    modalGallery.innerHTML = "";
  }

  list.forEach((work) => {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    // figure.dataset.id = work.id;

    figure.appendChild(img);

    if (mode === "page") {
      const figcaption = document.createElement("figcaption");
      figcaption.textContent = work.title;
      figure.appendChild(figcaption);
      gallery.appendChild(figure);
    }

    if (mode === "modal") {
      figure.className = "work";
      const trash = document.createElement("i");
      trash.className = "fa-solid fa-trash";
      figure.appendChild(trash);
      modalGallery.appendChild(figure);

      trash.addEventListener("click", () => {
        const id = work.id;
        deleteWork(id);
      });
    }
  });
}

function loadFilters() {
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

function pageFiltre() {
  loadFilters();

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

      loadWorks(filteredWorks);
    });
  });
}

function pageAdmin() {
  // BARRE NOIRE DU MODE ADMIN
  const editorModeBar = document.querySelector(".editor-mode-bar");
  editorModeBar.style.display = "flex";
  // CHANGER LOGIN EN LOGOUT
  const headerLogin = document.querySelector("header nav ul li:nth-child(3)");
  headerLogin.textContent = "logout";

  headerLogin.addEventListener("click", () => {
    localStorage.removeItem("token"); // supprime le token
    location.reload(); // recharge la page
  });

  // BOUTON MODIFIER A COTE DU TITRE "MES PROJETS"

  const titleAndModifButton = document.querySelector(".title-and-modif-button");
  titleAndModifButton.style.display = "flex";

  // FAIRE DISPARAITRE SECTION DES FILTRES ET MES PROJETS DE BASE
  const filters = document.querySelector("#portfolio .les-filtres");
  const mesProjets = document.querySelector("#portfolio .mes-projets");
  filters.style.display = "none";
  mesProjets.style.display = "none";
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

  await fetchWorks();
  loadWorks(works);
  loadWorks(works, "modal");
}

function modifierGalerieWaiter() {
  const modifier = document.querySelector(".modif-button");
  modifier.addEventListener("click", () => {
    modifierGalerie();
  });
}

function modifierGalerie() {
  const modalContainer = document.querySelector(".modal-container");

  const modalDelete = document.querySelector(".modal-delete");
  const modalImport = document.querySelector(".modal-import");

  loadWorks(works, "modal");
  modalContainer.showModal();
  //AFFICHER GALLERIE FIN

  // FERMETURE FENETRE MODALE
  const x = document.querySelector(".fa-solid.fa-xmark");

  x.addEventListener("click", () => {
    modalContainer.close();

    resetFormulaireModale();
  });

  modalContainer.addEventListener("click", (e) => {
    if (e.target === modalContainer) {
      modalContainer.close();

      resetFormulaireModale();
    }
  });

  // FERMETURE FENETRE MODALE FIN

  //SWITCH SUR ONGLET AJOUTER PHOTO
  const ajouterPhotoButton = document.querySelector(".modal-footer input");

  ajouterPhotoButton.addEventListener("click", () => {
    modalDelete.style.display = "none";
    modalImport.style.display = "block";
    ajouterPhoto();
  });
}

function ajouterPhoto() {
  const modalContainer = document.querySelector(".modal-container");

  const modalDelete = document.querySelector(".modal-delete");
  const modalImport = document.querySelector(".modal-import");

  const form = document.querySelector(".form-photo");
  const inputTitre = form.querySelector('input[name="title"]');

  const footerInput = document.querySelector("#valider-off");

  const preview = document.getElementById("preview");
  const groupUserSelect = document.querySelector(".group-user-select");

  //FORM PHOTO

  const selectCategory = document.querySelector("select");

  selectCategory.innerHTML = `
  <option value="" disabled selected>Choisir une catégorie</option>
`;

  // remplir avec les catégories existantes

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    selectCategory.appendChild(option);
  });

  //FLECHE POUR REVENIR EN ARRIERE :
  const leftArrow = document.querySelector(".fa-solid.fa-arrow-left");

  leftArrow.addEventListener("click", () => {
    modalImport.style.display = "none";
    modalDelete.style.display = "block";

    resetFormulaireModale();
  });

  // FERMETURE FENETRE MODALE
  const x = document.querySelector(".fa-solid.fa-xmark.x");

  x.addEventListener("click", () => {
    modalContainer.close();

    resetFormulaireModale();
  });

  //IMPORTER IMG
  // Le vrai input file caché
  const inputAjouterPhoto = document.querySelector(".modal-addphoto input");
  const importFileInput = document.querySelector('input[type="file"]');

  inputAjouterPhoto.onclick = () => {
    importFileInput.click();
  };

  // quand l’utilisateur choisit un fichier
  importFileInput.addEventListener("change", () => {
    const file = importFileInput.files[0]; // récupère le premier fichier choisi

    if (!file) {
      selectedFile = null;
      return;
    }

    // vérifie le type (il faut absolument que ce soit en MIME "image/..." comme file.type)
    const validTypes = ["image/jpeg", "image/png"];
    const isValidType = validTypes.includes(file.type);

    // vérifie la taille
    const isValidSize = file.size <= 4 * 1024 * 1024; // 4 Mo

    // alertes si non respect des conditions
    if (!isValidType) {
      alert("Format non valide (jpg ou png uniquement)");
      selectedFile = null;
      return;
    }

    if (!isValidSize) {
      alert("Fichier trop lourd (max 4 Mo)");
      selectedFile = null;
      return;
    }

    // si tout est bon on garde le fichier
    selectedFile = file;

    // création d'une URL temporaire à partir du fichier
    preview.src = URL.createObjectURL(selectedFile);

    // ajout dans le DOM
    groupUserSelect.style.display = "none";
    preview.style.display = "flex";

    checkForm();
  });

  function checkForm() {
    if (
      inputTitre.value.trim() !== "" &&
      selectCategory.value !== "" &&
      selectedFile
    ) {
      footerInput.id = "valider-on";
    } else {
      footerInput.id = "valider-off";
    }
  }

  inputTitre.addEventListener("input", checkForm);
  selectCategory.addEventListener("change", checkForm);

  // ENVOYER LE WORK
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (footerInput.id !== "valider-on") return;

    const token = localStorage.getItem("token");
    // L'API demande ce type de form pour le body
    const fd = new FormData();
    fd.append("image", selectedFile);
    fd.append("title", inputTitre.value.trim());
    fd.append("category", selectCategory.value);

    const res = await fetch(URL_WORKS, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    if (!res.ok) return;

    //REGLAGES DE FIN
    modalContainer.close();
    await fetchWorks();
    loadWorks(works);
    loadWorks(works, "modal");

    resetFormulaireModale();
  });
}

function resetFormulaireModale() {
  const preview = document.getElementById("preview");
  const groupUserSelect = document.querySelector(".group-user-select");
  const form = document.querySelector(".form-photo");

  const importFileInput = form.querySelector('input[type="file"]');
  const inputTitre = form.querySelector('input[name="title"]');
  const selectCategory = form.querySelector("select");
  const footerInput = document.querySelector("#valider-on");

  preview.style.display = "none";
  groupUserSelect.style.display = "flex";
  groupUserSelect.style.flexDirection = "column";

  inputTitre.value = "";
  importFileInput.value = ""; // parce que dans le cas où c'est le même fichier ça ne recharge pas la preview
  selectCategory.selectedIndex = 0; // Pour réafficher "Choisir une catégorie"

  footerInput.id = "valider-off";
  selectedFile = null;
}

async function init() {
  const token = localStorage.getItem("token");

  await fetchWorks();
  await fetchCategories();
  loadWorks(works);
  if (!token) {
    pageFiltre();
  } else {
    pageAdmin();
    modifierGalerieWaiter();
  }
}

init();
