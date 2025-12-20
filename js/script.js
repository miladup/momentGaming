const API_KEY = "b501480da15a41aba372986f01efe13f";
const BASE_URL = "https://api.rawg.io/api";

// Recuperation API

async function getLatestGames(limit = 3) {
  const res = await fetch(
    `${BASE_URL}/games?key=${API_KEY}&ordering=-released&page_size=${limit}`
  );
  const data = await res.json();
  return data.results;
}

async function getTopRatedGames(limit = 3) {
  const res = await fetch(
    `${BASE_URL}/games?key=${API_KEY}&ordering=-rating&page_size=${limit}`
  );
  const data = await res.json();
  return data.results;
}

// Fonction Carte de jeu

function displayGameCard(game, containerId, showgenre = true) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const card = document.createElement("div");
  card.classList.add("game-card");

  // Image du jeu
  const img = document.createElement("img");
  img.src = game.background_image || "img/default-game.png";
  img.alt = game.name;

  // Titre du jeu
  const title = document.createElement("h3");
  title.textContent = game.name;

  // Étoiles
  const etoileContainer = document.createElement("div");
  etoileContainer.classList.add("etoile-note");
  const maxEtoile = 5;
  const roundedRating = Math.round(game.rating || 0);

  for (let i = 1; i <= maxEtoile; i++) {
    const etoile = document.createElement("span");
    etoile.classList.add("star");
    if (i <= roundedRating) etoile.classList.add("filled");
    etoile.innerHTML = "★";
    etoileContainer.appendChild(etoile);
  }

  // Genres
let genres = '';
  if (showgenre == true) {
    genres = document.createElement("p");
    genres.textContent =
      "Genres : " + (game.genres?.map(g => g.name).join(", ") || "N/A");
  }

  // Plateformes
  const platforms = document.createElement("p");
  platforms.textContent =
    "Plateformes : " +
    (game.platforms?.map(p => p.platform.name).join(", ") || "N/A");

  // Ajout à la carte
  card.append(img, title, etoileContainer, genres, platforms);
  
  // Rendre toute la carte cliquable
  card.style.cursor = "pointer";
  card.addEventListener("click", () => {
    window.location.href = `DetailsJeu.html?id=${game.id}`;
  });

  container.appendChild(card);
}

// Chargement page d'accueil

async function loadHomePage() {
  try {
    // Dernières sorties
    const latestGames = await getLatestGames(3);

    // Image principale
    if (latestGames[0]) {
      const mainImageDiv = document.getElementById("maingame");
      // Changer le background-image de la div
      mainImageDiv.style.backgroundImage = `url(${latestGames[0].background_image})`;
    }

    const containerId = "latest-games";
    latestGames.forEach(game => displayGameCard(game, containerId, false)
    );

    // Mieux notés
    const topRatedGames = await getTopRatedGames(3);
    const topContainerId = "top-rated-games";

    topRatedGames.forEach(game => displayGameCard(game, topContainerId, false));

  } catch (error) {
    console.error("Erreur lors du chargement de la page :", error);
  }
}

// Initialisation

document.addEventListener("DOMContentLoaded", loadHomePage);
