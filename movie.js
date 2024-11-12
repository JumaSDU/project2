const apiKey = "6ed112acb3c66feca9e9fab8c4fb29ce";
const movieGrid = document.getElementById("movieGrid");
const movieModal = document.getElementById("movieModal");
const movieDetails = document.getElementById("movieDetails");
const closeModal = document.getElementById("closeModal");
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", (e) => searchMovies(e.target.value));

closeModal.onclick = () => (movieModal.style.display = "none");
window.onclick = (e) => {
  if (e.target == movieModal) movieModal.style.display = "none";
};

async function searchMovies(query) {
  if (query.length < 3) return;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`;
  const response = await fetch(url);
  const data = await response.json();
  displayMovies(data.results);
}

function displayMovies(movies) {
  movieGrid.innerHTML = "";
  movies.forEach((movie) => {
    const movieElement = document.createElement("div");
    movieElement.classList.add("movie");
    movieElement.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <p>${movie.release_date}</p>
    `;
    movieElement.onclick = () => showMovieDetails(movie.id);
    movieGrid.appendChild(movieElement);
  });
}

async function showMovieDetails(movieId) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&append_to_response=videos,credits,reviews`;
  const response = await fetch(url);
  const movie = await response.json();

  movieDetails.innerHTML = `
    <h2>${movie.title}</h2>
    <p><strong>Release Date:</strong> ${movie.release_date}</p>
    <p><strong>Rating:</strong> ${movie.vote_average}</p>
    <p>${movie.overview}</p>
    <h3>Cast</h3>
    <ul>${movie.credits.cast.slice(0, 5).map(cast => `<li>${cast.name}</li>`).join('')}</ul>
  `;
  movieModal.style.display = "flex";
}
