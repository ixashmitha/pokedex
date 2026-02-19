const typeColors = {
  fire: "bg-red-500/20 text-red-400 border border-red-400",
  water: "bg-blue-500/20 text-blue-400 border border-blue-400",
  grass: "bg-green-500/20 text-green-400 border border-green-400",
  electric: "bg-yellow-400/20 text-yellow-300 border border-yellow-300",
  psychic: "bg-pink-500/20 text-pink-400 border border-pink-400",
  ice: "bg-cyan-400/20 text-cyan-300 border border-cyan-300",
  dragon: "bg-purple-500/20 text-purple-400 border border-purple-400",
  dark: "bg-gray-700/40 text-gray-300 border border-gray-500",
  fairy: "bg-pink-300/20 text-pink-300 border border-pink-300"
};
//pokemon grid
let grid=document.getElementById("pokemongrid");
let loadBtn=document.getElementById("loadmoreBtn");
let offset=0;
const limit=20;
const pokemonCache=[];
async function loadPokemon(url){
    try{
    let response=await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    );
    if(!response.ok){
        throw new Error("failed to fetch pokemon data");
    }
    const data=await response.json();
    for(let card of data.results){
        await getPokemonCard(card.url);
    }
    offset+=limit;
}catch(error){
    alert("Failed to load Pokémon. Please try again.");
}
}
loadPokemon();
//pokemon cardss
async function getPokemonCard(url){
    const response=await fetch(url);
    const data=await response.json();
    pokemonCache.push(data);
    let card=document.createElement('div');
    card.className="pokemon-card bg-gray-900/70 backdrop-blur-md border border-gray-700 rounded-2xl shadow-xl p-4 text-center cursor-pointer hover:scale-105 hover:shadow-2xl transition-all duration-300"
    card.dataset.name=data.name;
    card.dataset.id=data.id;
    const types=data.types
    .map(t=>{const color = typeColors[t.type.name] || "bg-gray-500/20 text-gray-300 border border-gray-300"; //refer to const type colors.
    return `
      <span class="${color} px-3 py-1 rounded text-xs font-semibold 
                   transition duration-300 hover:scale-110 hover:shadow-lg">
        ${t.type.name}
      </span>
    `;
})
    .join(' ');
    card.innerHTML= `
      <img src="${data.sprites.other["official-artwork"].front_default}"
           class="w-28 h-28 mx-auto">
      <h3 class="capitalize font-bold text-lg text-white mt-2">${data.name}</h3>
      <p class="text-gray-400">#${data.id}</p>
      <div class="flex gap-2 justify-center mt-3 capitalize">
        ${types}
      </div>
    `;
    card.onclick=()=> showDetails(data.id);
    grid.appendChild(card);
}

//load more
loadMoreBtn.onclick=loadPokemon;

//pokemon details
async function showDetails(id){
    let response=await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    let card=await response.json();
    const model=document.getElementById('model');
    const content=document.getElementById('modelContent');
    const statsHTML=card.stats.map(s => `
    <div>
      <p class="text-xs capitalize text-gray-300 mb-1">
        ${s.stat.name}
      </p>
      <div class="bg-gray-800 h-3 rounded-full overflow-hidden">
        <div class="h-3 rounded bg-gradient-to-r
                    from-red-500 via-orange-400 to-yellow-400
                    transition-all duration-500"
             style="width:${Math.min(s.base_stat, 100)}%">
        </div>
      </div>
    </div>
  `).join(" ");

  const abilities=card.abilities
  .map(a=> a.ability.name)
  .join(" , ");
  content.innerHTML=`
  <button onclick='closeModel()' class="float-right text-gray-400 hover:text-red-400
             transition duration-300 text-xl">
      ✕
    </button>
  <img src="${card.sprites.other['official-artwork'].front_default}"
         class="w-40 mx-auto drop-shadow-lg">

    <h2 class="text-3xl font-bold capitalize text-center
               text-yellow-400 drop-shadow-lg mt-2">
      ${card.name}
    </h2>

    <p class="text-center text-gray-400 mb-4">#${card.id}</p>

    <div class="space-y-1 text-sm">
      <p><span class="text-gray-400">Height:</span> ${card.height}</p>
      <p><span class="text-gray-400">Weight:</span> ${card.weight}</p>
      <p><span class="text-gray-400">Abilities:</span> ${abilities}</p>
    </div>

    <h3 class="font-semibold text-lg mt-4 text-purple-400">
      Base Stats
    </h3>

    <div class="space-y-3 mt-2">
      ${statsHTML}
    </div>
  `;
  model.classList.remove("hidden");
  model.classList.add("flex");
}

function closeModel() {
  const model = document.getElementById("model");
  model.classList.remove("flex");
  model.classList.add("hidden");
}

//surprise me
document.getElementById("surpriseBtn").onclick=loadRandomPokemon;
async function loadRandomPokemon(){
    grid.innerHTML="";
    const randomIds=new Set();
    while(randomIds.size<10){
    randomIds.add(Math.floor(Math.random()*1025)+1);
    }
    for(const id of randomIds){
         await getPokemonCard(`https://pokeapi.co/api/v2/pokemon/${id}`);
    }
}

//search
document.getElementById('searchBtn').onclick=searchPokemon;
document.getElementById('searchInput').addEventListener("keydown",e=>{
    if(e.key=="Enter")searchPokemon();
});
async function searchPokemon(){
    const value=document.getElementById("searchInput").value.toLowerCase();
    if(!value) return;
    grid.innerHTML="";
    try{
        await getPokemonCard(`https://pokeapi.co/api/v2/pokemon/${value}`);
    }catch {
    grid.innerHTML = `<p class="text-red-600 text-xl">Not found</p>`;
  }
}
//toggle theme
const toggleBtn = document.getElementById("themeToggle");
toggleBtn.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
});
