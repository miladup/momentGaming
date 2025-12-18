async function callGameAPI() {
  const response = await fetch('https://api.rawg.io/api/games?key=b501480da15a41aba372986f01efe13f&page=2')
  const responseData = await response.json()
  return responseData
}

console.log(await callGameAPI())
const API_KEY = "b501480da15a41aba372986f01efe13f";


const params = new URLSearchParams(window.location.search);
const gameId = params.get("id");


fetch(`https://api.rawg.io/api/games/${gameId}?key=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
        displayGame(data);
        displayAutresJeux(data);
    })
    .catch(error => console.error(error));

function displayGame(game) {
    document.getElementById("titre-jeu").textContent = game.name;
    document.getElementById("jeu-image").src = game.background_image;
    document.getElementById("date-jeu").textContent = game.released;

    const genres = [];
    game.genres.forEach(function(g) {
        genres.push(g.name);
    });
    document.getElementById("genre-jeu").textContent = genres.join(", ");

    const plateformes = [];

    game.platforms.forEach(function(p) {
        plateformes.push(p.platform.name);
    });
    document.getElementById("plateformes-jeu").textContent = plateformes.join(", ");

    displayRating(game.rating);
}

function displayRating(rating) {
    const chiffreContainer = document.getElementById("chiffre-note");
    const etoileContainer = document.getElementById("etoile-note");

    chiffreContainer.textContent = `${rating.toFixed(1)} / 5`;

    etoileContainer.innerHTML = "";

    const maxEtoile = 5;
    const roundedRating = Math.round(rating);

    for (let i = 1; i <= maxEtoile; i++) {
        const etoile = document.createElement("span");
        etoile.classList.add("star");

        if (i <= roundedRating) {
            etoile.classList.add("filled");
        }

        etoile.innerHTML = "★";
        etoileContainer.appendChild(etoile);
    }
}

function displayAutresJeux(game) {

    // Sécurité : s’il n’y a pas de genre
    if (!game.genres || game.genres.length === 0) return;

    const genreId = game.genres[0].id;

    fetch(`https://api.rawg.io/api/games?key=${API_KEY}&genres=${genreId}&page_size=4`)
        .then(response => response.json())
        .then(data => {

            const container = document.getElementById("container-autres-jeux");
            container.innerHTML = "";

            let compteur = 0;

            data.results.forEach(jeu => {

                // Ne pas afficher le jeu actuel
                if (jeu.id === game.id) return;

                // Limiter à 3 jeux
                if (compteur >= 3) return;

                const div = document.createElement("div");

                div.innerHTML = `
                    <a href="jeu.html?id=${jeu.id}">
                        <img src="${jeu.background_image}" alt="${jeu.name}">
                        <p>${jeu.name}</p>
                    </a>
                `;

                container.appendChild(div);
                compteur++;
            });
        })
        .catch(error => console.error(error));
}
