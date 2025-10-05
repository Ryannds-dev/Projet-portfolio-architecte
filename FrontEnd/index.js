// RECUPERATION DES TRAVAUX DE L'ARCHITECTE GRACE A L'API ET INJECTION DANS HTML

const URL_WORKS = "http://localhost:5678/api/works";
const gallery = document.querySelector(".gallery");

async function loadWorks() {
  const reponseAPI = await fetch(URL_WORKS);
  const works = await reponseAPI.json();
  console.log(works);

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
loadWorks();
