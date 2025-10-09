// RECUPERATION DES TRAVAUX DE L'ARCHITECTE GRACE A L'API ET INJECTION DANS HTML

const URL_WORKS = "http://localhost:5678/api/works";
const URL_CATEGORIES = "http://localhost:5678/api/categories";
const gallery = document.querySelector(".gallery");

let works = [];
let categories = [];

async function loadWorks() {
  const reponseAPI = await fetch(URL_WORKS);
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
  gallery.innerHTML = ""; // 🔹 vider avant de réafficher
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

async function filter() {
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

// pas besoin d'appeler encore une fois loadWorks et loadFilters parce que les mettre en await dans filter ça implique déjà que ça les lance

async function init() {
  const token = localStorage.getItem("token");
  await filter();
  if (token) {
    pageAdmin();
  }
}

init();
