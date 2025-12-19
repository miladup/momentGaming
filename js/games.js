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

  const img = document.createElement("img");
  img.src = game.background_image || "img/default-game.png";
  img.alt = game.name;

  const title = document.createElement("h3");
  title.textContent = game.name;

  const rating = document.createElement("p");
  rating.textContent = createStars(game.rating);

  const genres = document.createElement("p");
  genres.textContent =
    "Genres : " + (game.genres?.map(g => g.name).join(", ") || "N/A");

  const platforms = document.createElement("p");
  platforms.textContent =
    "Plateformes : " +
    (game.platforms?.map(p => p.platform.name).join(", ") || "N/A");

  card.append(img, title, rating, genres, platforms);
  container.appendChild(card);
}

// charger et afficher les jeux
async function main() {
  const games = await fetchGames(1);
  games.forEach(game => displayGameCard(game));
}

document.addEventListener("DOMContentLoaded", main);