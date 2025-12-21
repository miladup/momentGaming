const API_KEY = "b501480da15a41aba372986f01efe13f";
const params = new URLSearchParams(window.location.search);
const gameId = params.get("id");

async function loadGameData() {
    try {
        const response = await fetch(`https://api.rawg.io/api/games/${gameId}?key=${API_KEY}`);
        const data = await response.json();
        displayGame(data);
        displayAutresJeux(data);
    } catch (error) {
        console.error(error);
    }
}

loadGameData();

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
    
    displayStores(game.stores);
    displayRating(game.rating);
}

function displayStores(stores) {
    const storesContainer = document.getElementById("stores-jeu");
    
    if (!stores || stores.length === 0) {
        storesContainer.textContent = "Non disponible";
        return;
    }
    
    storesContainer.innerHTML = "";
    stores.forEach((storeObj, index) => {
        const link = document.createElement("a");
        link.href = `https://${storeObj.store.domain}`;
        link.textContent = storeObj.store.name;
        link.target = "_blank"; 
        link.rel = "noopener noreferrer"; 
        storesContainer.appendChild(link);
        
        if (index < stores.length - 1) {
            storesContainer.appendChild(document.createTextNode(", "));
        }
    });
}

function displayRating(rating) {
    const chiffreContainer = document.getElementById("chiffre-note");
    const etoileContainer = document.getElementById("etoile-note");

    // Si pas de note ou note = 0
    if (!rating || rating === 0) {
        chiffreContainer.textContent = "Pas encore de note";
        etoileContainer.innerHTML = "";
        return;
    }

    // Affichage normal si la note existe
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

async function displayAutresJeux(game) {
    if (!game.genres || game.genres.length === 0) return;
    
    const genreId = game.genres[0].id;
    
    try {
        const response = await fetch(`https://api.rawg.io/api/games?key=${API_KEY}&genres=${genreId}&page_size=4`);
        const data = await response.json();
        
        const container = document.getElementById("container-autres-jeux");
        container.innerHTML = "";
        let compteur = 0;
        
        data.results.forEach(jeu => {
            if (jeu.id === game.id) return;
            if (compteur >= 3) return;
            
            const div = document.createElement("div");
            div.innerHTML = `
                <a href="DetailsJeu.html?id=${jeu.id}">
                    <img src="${jeu.background_image}" alt="${jeu.name}">
                    <p>${jeu.name}</p>
                </a>
            `;
            container.appendChild(div);
            compteur++;
        });
    } catch (error) {
        console.error(error);
    }
}