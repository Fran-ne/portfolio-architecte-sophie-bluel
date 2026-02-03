// Api de connexion
const loginApi = "http://localhost:5678/api/users/login";

// JS page login
console.log("login page on");

// Recupere le login
const form = document.getElementById("login-form");
const erreur = document.getElementById("login-error");

// envoi du formulaire
form.addEventListener("submit", connexion);

// fonction soumission du formulaire
async function connexion(event) {
  event.preventDefault(); // stop le rechargement

  // Recuperation des champs email et mot de passe
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // Deelete le message d'erreur
  erreur.textContent = "";

  // Verifications champs
  if (email === "" || password === "") {
    afficherErreur("Merci de remplir le champ email et mot de passe.");
    return;
  }

  // Creation objet utilisateur pour l'api
  const user = { email: email, password: password };

  try {
    // envoi request post à l'api
    const response = await fetch(loginApi, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    // if identifiants faux
    if (!response.ok) {
      afficherErreur("Erreur dans l’identifiant ou le mot de passe");
      return;
    }

    // Recuperation du token de la reponse
    const data = await response.json();

    // Stockage du token (localStorage)
    localStorage.setItem("token", data.token);

    console.log("connexion good, token enregistre");

    // Redirection vers la page d'accueil
    window.location.href = "index.html";
  } catch (error) {
    //autres erreurs
    console.log("network error :", error);
    afficherErreur("Une erreur est survenue, veuillez réessayer plus tard.");
  }
}

// Fonction pour afficher l'erreur
function afficherErreur(message) {
  erreur.textContent = message;
}