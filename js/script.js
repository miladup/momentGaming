async function callGameAPI() {
  const response = await fetch('https://api.rawg.io/api/games?key=b501480da15a41aba372986f01efe13f&page=2')
  const responseData = await response.json()
  return responseData
}

console.log(await callGameAPI())