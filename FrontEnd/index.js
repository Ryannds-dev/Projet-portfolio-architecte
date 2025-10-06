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

// pas besoin d'appeler encore une fois loadWorks et loadFilters parce que les mettre en await dans filter ça implique déjà que ça les lance
filter();
