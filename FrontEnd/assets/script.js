//Fichier JS

console.log("script java marche");
const projets = document.querySelector(".gallery");

//API appel
fetch('http://localhost:5678/api/works')
    .then(function (reponseserveur) {
        return reponseserveur.json();
    })
    .then(function (data) {
        console.log("projets retour:", data);

        //Mettre galerie vide
        projets.innerHTML = "";

        //Boucle projets
        for (let projet of data) {

            const figure = document.createElement("figure");
            const image = document.createElement("img")
            const caption = document.createElement("figcaption");

            image.src = projet.imageUrl;
            image.alt = projet.title;
            caption.textContent = projet.title;

            figure.appendChild(image);
            figure.appendChild(caption);

            //ajout galerie ?
            projets.appendChild(figure);
        }
    });