const apiKey = '5eec79d562704fb59b17e0a0700d21dd';
const searchBar = document.getElementById('search-bar');
const recipesGrid = document.getElementById('recipes-grid');
const recipeModal = document.getElementById('recipe-modal');
const recipeDetails = document.getElementById('recipe-details');
const closeModal = document.querySelector('.close');
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

searchBar.addEventListener('input', searchRecipes);
closeModal.addEventListener('click', () => recipeModal.style.display = 'none');

document.addEventListener('DOMContentLoaded', displayFavorites);

async function searchRecipes() {
  const query = searchBar.value;
  if (!query) return;

  const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${query}`);
  const data = await response.json();
  displayRecipes(data.results);
}

function displayRecipes(recipes) {
  recipesGrid.innerHTML = '';
  recipes.forEach(recipe => {
    const recipeCard = document.createElement('div');
    recipeCard.classList.add('recipe-card');
    recipeCard.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}">
      <h3>${recipe.title}</h3>
      <button class="fav-btn ${favorites.includes(recipe.id) ? 'active' : ''}" onclick="toggleFavorite(${recipe.id})">
        ${favorites.includes(recipe.id) ? 'Remove from Favorites' : 'Add to Favorites'}
      </button>
    `;
    recipeCard.addEventListener('click', (e) => {
      if (!e.target.classList.contains('fav-btn')) openRecipeDetails(recipe.id);
    });
    recipesGrid.appendChild(recipeCard);
  });
}

async function openRecipeDetails(id) {
  const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`);
  const recipe = await response.json();
  recipeDetails.innerHTML = `
    <h2>${recipe.title}</h2>
    <img src="${recipe.image}" alt="${recipe.title}">
    <p>${recipe.summary}</p>
    <h3>Ingredients:</h3>
    <ul>${recipe.extendedIngredients.map(ing => `<li>${ing.original}</li>`).join('')}</ul>
    <h3>Instructions:</h3>
    <p>${recipe.instructions}</p>
    <button class="fav-btn ${favorites.includes(id) ? 'active' : ''}" onclick="toggleFavorite(${id})">
      ${favorites.includes(id) ? 'Remove from Favorites' : 'Add to Favorites'}
    </button>
  `;
  recipeModal.style.display = 'block';
}

function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(favId => favId !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  displayRecipes(favorites.map(favId => ({ id: favId, title: '', image: '' }))); // Placeholder display for favorite ids
}

function displayFavorites() {
  recipesGrid.innerHTML = '';
  favorites.forEach(async (id) => {
    const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`);
    const recipe = await response.json();

    const recipeCard = document.createElement('div');
    recipeCard.classList.add('recipe-card');
    recipeCard.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}">
      <h3>${recipe.title}</h3>
      <button class="fav-btn active" onclick="toggleFavorite(${recipe.id})">Remove from Favorites</button>
    `;
    recipeCard.addEventListener('click', (e) => {
      if (!e.target.classList.contains('fav-btn')) openRecipeDetails(recipe.id);
    });
    recipesGrid.appendChild(recipeCard);
  });
}
