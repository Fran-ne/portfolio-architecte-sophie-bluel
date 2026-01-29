//Fichier JS

console.log("script java marche");

const projets = document.querySelector(".gallery");

//Filtres
const filtersContainer = document.querySelector(".filters");
let allWorks = [];

//Mettre galerie vide + afficher projets
function afficherProjets(listeProjets) {

    //Mettre galerie vide
    projets.innerHTML = "";

    //Boucle projets
    for (let projet of listeProjets) {

        const figure = document.createElement("figure");
        const image = document.createElement("img");
        const caption = document.createElement("figcaption");

        image.src = projet.imageUrl;
        image.alt = projet.title;
        caption.textContent = projet.title;

        figure.appendChild(image);
        figure.appendChild(caption);

        //ajout galerie ?
        projets.appendChild(figure);
    }
}

//Fonction boutons
function creerBoutons(categories) {

    filtersContainer.innerHTML = ""; //vide

    // Boutons
    const bouton = document.createElement("button");
    bouton.textContent = "Tous";
    bouton.classList.add("active");
    filtersContainer.appendChild(bouton);

    //fonction event
    bouton.addEventListener("click", function () {
        document.querySelectorAll(".filters button").forEach(function (bouton) {
            bouton.classList.remove("active"); //enleve classe active(un bouton)
        });

        bouton.classList.add("active");
        afficherProjets(allWorks); //afficher projets
    });

    //Categories Boutons
    for (let categorie of categories) {

        const bouton = document.createElement("button");
        bouton.textContent = categorie.name;
        filtersContainer.appendChild(bouton);

        //event bouton
        bouton.addEventListener("click", function () {
            console.log("btn click :", bouton.textContent);

            document.querySelectorAll(".filters button").forEach(function (bouton) {
                bouton.classList.remove("active");
            });

            bouton.classList.add("active");

            const projetsFiltres = allWorks.filter(function (projet) {
                return projet.categoryId === categorie.id;
            });

            afficherProjets(projetsFiltres);
        });
    }
}

// fetch les projets api
fetch("http://localhost:5678/api/works")
    .then(function (reponse) {
        return reponse.json();
    })
    .then(function (works) {
        allWorks = works;
        afficherProjets(allWorks);
    });

//fetch les categories
fetch("http://localhost:5678/api/categories")
    .then(function (reponse) {
        return reponse.json();
    })
    .then(function (categories) {
        creerBoutons(categories);
    });

    //edit mode script

// recupere le token
const token = localStorage.getItem("token");

// si token existe -> edit mode
if (token) {
  document.body.classList.add("edit-mode");

  // lien login -> logout
  const lienLogin = document.querySelector('nav a[href="./login.html"]');

  if (lienLogin) {
    lienLogin.textContent = "logout";
    lienLogin.href = "#";

    // deconnexion
    lienLogin.addEventListener("click", function (event) {
      event.preventDefault();
      localStorage.removeItem("token");
      window.location.reload(); 
    });
  }
}