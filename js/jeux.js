const API_KEY = "b501480da15a41aba372986f01efe13f";

// récupérer les jeux depuis l'API
async function fetchGames(page = 1) {
  try {
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${API_KEY}&page=${page}`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Erreur lors de la récupération des jeux :", error);
    return [];
  }
}

// créer les étoiles à partir de la note
function createStars(rating) {
  const rounded = Math.round(rating || 0); 
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    stars += i <= rounded ? "★" : "☆";
  }
  return stars;
}

// créer et afficher une carte de jeu
function displayGameCard(game) {
  const container = document.getElementById("games-container");
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
  const genres = document.createElement("p");
  genres.textContent =
    "Genres : " + (game.genres?.map(g => g.name).join(", ") || "N/A");

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

// charger et afficher les jeux
async function main() {
  const games = await fetchGames(1);
  games.forEach(game => displayGameCard(game));
}

document.addEventListener("DOMContentLoaded", main);