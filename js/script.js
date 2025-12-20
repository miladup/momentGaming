const API_KEY = "b501480da15a41aba372986f01efe13f";
const BASE_URL = "https://api.rawg.io/api";

// API

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

// Interface

function createGameCard(game) {
  const card = document.createElement("div");
  card.className = "game-card";

  // Image
  const img = document.createElement("img");
  img.src = game.background_image || "";
  img.alt = `Image de ${game.name}`;

  // Titre
  const title = document.createElement("h2");
  title.textContent = game.name;

  // Plateformes
  const platforms = document.createElement("p");
  platforms.textContent =
    "Plateformes: " +
    (game.platforms?.map(p => p.platform.name).join(", ") || "Non renseignées");

  // Note
  const rating = document.createElement("p");
  rating.textContent = `Note: ${game.rating ?? "N/A"}`;

  card.append(img, title, platforms, rating);

  return card;
}

// Page d'accueil

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

    const latestContainer = document.getElementById("latest-games");
    latestGames.forEach(game => {
      latestContainer.appendChild(createGameCard(game));
    });

    // Mieux notés
    const topRatedGames = await getTopRatedGames(3);
    const topContainer = document.getElementById("top-rated-games");

    topRatedGames.forEach(game => {
      topContainer.appendChild(createGameCard(game));
    });

  } catch (error) {
    console.error("Erreur lors du chargement de la page :", error);
  }
}

// Initialisation

document.addEventListener("DOMContentLoaded", loadHomePage);
