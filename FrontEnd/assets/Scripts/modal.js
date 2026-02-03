// petits raccourcis DOM
const overlay = document.getElementById("modal-overlay");
const boxClose = document.getElementById("modal-close");
const boxBack = document.getElementById("modal-back");

const viewGalerie = document.getElementById("view-galerie");
const viewForm = document.getElementById("view-form");

const miniGallery = document.getElementById("mini-gallery");
const btnGoForm = document.getElementById("btn-go-form");

// bouton modifier
const btnOpenModal = document.querySelector(".js-open-modal");

// same token login.js
function getToken() {
  return localStorage.getItem("token");
}

// --- ui ---
function openModal() {
  overlay.classList.remove("hidden");
  showGalerieView();
  renderMiniGallery();
}

function closeModal() {
  overlay.classList.add("hidden");
}

function showGalerieView() {
  viewGalerie.classList.remove("hidden");
  viewForm.classList.add("hidden");
  boxBack.classList.add("hidden");
}

function showFormView() {
  viewGalerie.classList.add("hidden");
  viewForm.classList.remove("hidden");
  boxBack.classList.remove("hidden");
}

// si token invalide → login
function forceLogout(message) {
  localStorage.removeItem("token");
  alert(message || "Session expirée, merci de vous reconnecter.");
  window.location.href = "login.html";
}

// --- mini galerie modale ---
function renderMiniGallery() {
  miniGallery.innerHTML = "";

  for (let projet of allWorks) {
    const card = document.createElement("div");
    card.classList.add("mini-card");

    const img = document.createElement("img");
    img.src = projet.imageUrl;
    img.alt = projet.title;

    const btnTrash = document.createElement("button");
    btnTrash.classList.add("btn-trash");
    btnTrash.textContent = "🗑";
    btnTrash.type = "button";

    // suppression
    btnTrash.addEventListener("click", function () {
      deleteWork(projet.id);
    });

    card.appendChild(img);
    card.appendChild(btnTrash);
    miniGallery.appendChild(card);
  }
}

// --- api suppression ---
async function deleteWork(idProjet) {
  const token = getToken();
  if (!token) {
    forceLogout("Pas de token, veuillez vous reconnecter.");
    return;
  }

  const confirmDelete = confirm("Tu veux supprimer ce projet ?");
  if (!confirmDelete) return;

  try {
    const response = await fetch(`http://localhost:5678/api/works/${idProjet}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // token invalide ou expire
    if (response.status === 401 || response.status === 403) {
      forceLogout("Votre session n'est plus valide.");
      return;
    }

    if (!response.ok) {
      alert("Suppression impossible (erreur API).");
      return;
    }

    // retirer du tableau local + refresh
    allWorks = allWorks.filter(function (p) {
      return p.id !== idProjet;
    });

    // galerie principale
    afficherProjets(allWorks);

    // galerie dans modale
    renderMiniGallery();

    console.log("suppression OK :", idProjet);
  } catch (error) {
    console.log("Erreur réseau delete :", error);
    alert("Erreur réseau, réessaie.");
  }
}

// Listeners 

// ouvrir
if (btnOpenModal) {
  btnOpenModal.addEventListener("click", function () {
    openModal();
  });
}

// fermer via croix
boxClose.addEventListener("click", function () {
  closeModal();
});

// overlay si clic dehors
overlay.addEventListener("click", function (event) {
  // important : on ferme seulement si on clique le fond, pas la box
  if (event.target === overlay) {
    closeModal();
  }
});

// switch vers form
btnGoForm.addEventListener("click", function () {
  showFormView();
});

// retour vers galerie
boxBack.addEventListener("click", function () {
  showGalerieView();
});