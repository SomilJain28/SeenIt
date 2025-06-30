const API_URL = "https://www.omdbapi.com/?apikey=c280668";


const inputSearch = document.getElementById("searchBtn");
const input = document.getElementById("searchInput");

const moviesContainer = document.getElementById("movieResults");

const moviesContainer2 = document.getElementById("favorites");

displayFavorites();



inputSearch.addEventListener("click", function() {
  const name = input.value.trim();
  if (!name) {
    alert("Please enter a movie name.");
    console.log("Please enter a movie name.");
    return;
  }

  fetch(`${API_URL}&s=${encodeURIComponent(name)}`)
   .then((response) =>{
     if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
   })
   .then(data =>{
    console.log(data);

     if (data.Response === "True") {
        displayMovies(data.Search);
     }

     else {
        moviesContainer.innerHTML = `<p>No results found.</p>`;
      }
    
   })
   .catch(error =>{
    console.error('Fetch error:', error);
   })


})

function displayMovies(movies) {

  moviesContainer.innerHTML = "";

  movies.forEach((movie) => {

    const card = document.createElement("div");
    card.className = "movie-card";
    card.id = `movie-${movie.imdbID}`;
    

    card.innerHTML = `
      <img src="${movie.Poster}" alt="${movie.Title}">
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
      <button class="addfav">Add to Favorites</button>
    `;

    const addBtn = card.querySelector(".addfav");
    addBtn.addEventListener("click", () => addToFavorites(movie));


    moviesContainer.appendChild(card);

  });

}


function addToFavorites(movie) {

  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (favorites.some((fav) => fav.imdbID === movie.imdbID)) {
    alert("Already in favorites!");
    return;
  }

  favorites.push(movie);
  localStorage.setItem("favorites", JSON.stringify(favorites));

  
  const movieCard = document.getElementById(`movie-${movie.imdbID}`);
  if (movieCard) {
    movieCard.remove();
  }

  displayFavorites();

}



function displayFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  moviesContainer2.innerHTML = "";

  favorites.forEach((movie) => {
    const card = document.createElement("div");
    card.className = "movie-card";
    card.id = `fav-${movie.imdbID}`;

    card.innerHTML = `
      <img src="${
        movie.Poster !== "N/A"
          ? movie.Poster
          : "https://via.placeholder.com/200x300?text=No+Image"
      }" alt="${movie.Title}">
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
      <button class="remove-fav">Remove</button>
    `;

    const removeBtn = card.querySelector(".remove-fav");
    removeBtn.addEventListener("click", () => removeFromFavorites(movie.imdbID));

    moviesContainer2.appendChild(card);
  });
}


function removeFromFavorites(imdbID) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  
  favorites = favorites.filter((movie) => movie.imdbID !== imdbID);
  localStorage.setItem("favorites", JSON.stringify(favorites));

  
  const favCard = document.getElementById(`fav-${imdbID}`);
  if (favCard) {
    favCard.remove();
  }
}


