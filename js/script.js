const API_KEY = "b501480da15a41aba372986f01efe13f";
const BASE_URL = "https://api.rawg.io/api";

async function getLatestGames() {
	const res = await fetch(
	`${BASE_URL}/games?key=${API_KEY}&ordering=released&page_size=5`
	);
	const data = await res.json();
	return data.results;
}

async function getTopRatedGames() {
	const res = await fetch(
	`${BASE_URL}/games?key=${API_KEY}&ordering=released&page_size=5`
	);
	const data = await res.json();
	return data.results;
}

async function getLatestGameScreenShot() {
	const latestGames = await getLatestGames();
	const lastGameId = latestGames[0].id;
	
	const res = await fetch(
	`${BASE_URL}/games?key=${API_KEY}&ordering=released&page_size=5`
	);
	const data = await res.json();
	return data.short_screenshots[0]?.image;
}