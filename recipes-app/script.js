const recipeCardsEl = document.querySelector(".recipe-cards");
const favoritesEl = document.querySelector(".favorites");
const modalOverlayEl = document.getElementById("modal-overlay");
const form = document.forms["search-form"];

const API_URL = "https://www.themealdb.com/api/json/v1/1/";
const RANDOM_RECIPE_URL = API_URL + "random.php";
const SEARCH_RECIPE_URL = API_URL + "filter.php?i=";
const RECIPE_DETAILS_URL = API_URL + "lookup.php?i=";

const searchRecipes = async (e) => {
  e.preventDefault();
  recipes = [];
  recipeCardsEl.innerHTML = "";
  const searchTerm = form[0].value;
  let searchRecipes = await fetchRecipe(SEARCH_RECIPE_URL + searchTerm);
  if (searchRecipes.meals) {
    for (let i = 0; i < searchRecipes.meals.length; i++) {
      const { idMeal, strMeal, strMealThumb } = searchRecipes.meals[i];
      let shortTitle = getShortTitle(strMeal);
      recipes.push({ idMeal, strMeal, strMealThumb, shortTitle });
    }
    addRecipesToUI(searchRecipes);
  } else {
    const noRecipes = document.createElement("div");
    noRecipes.classList.add("no-recipes");
    noRecipes.innerHTML =
      "<p>No recipes found for <b>" +
      searchTerm +
      "</b>.</p><p>Please try another ingredient (Ex: bread)</p>";
    recipeCardsEl.appendChild(noRecipes);
  }
};

const fetchRecipe = async (URL) => {
  const response = await fetch(URL);
  const data = await response.json();
  form[0].value = "";
  return data;
};

const getShortTitle = (title) => {
  if (title.length <= 10) {
    return title;
  } else {
    return title.substring(0, 10) + "...";
  }
};

const startRecipeApp = async (RANDOM_RECIPE_URL) => {
  let randomRecipe = await fetchRecipe(RANDOM_RECIPE_URL);
  const { idMeal, strMeal, strMealThumb } = randomRecipe.meals[0];
  let shortTitle = getShortTitle(strMeal);
  recipes.push({ idMeal, strMeal, strMealThumb, shortTitle });
  addRecipesToUI(randomRecipe);
};

const addRecipesToUI = async (recipes) => {
  for (let i = 0; i < recipes.meals.length; i++) {
    let { idMeal, strArea, strMealThumb, strMeal } = recipes.meals[i];
    if (!strArea) {
      let recipeDetail = await fetchRecipe(RECIPE_DETAILS_URL + idMeal);
      strArea = recipeDetail.meals[0].strArea;
    }
    const recipeCardEl = document.createElement("article");
    recipeCardEl.classList.add("recipe-card");
    recipeCardEl.addEventListener("click", () => {
      showRecipeModal(idMeal);
    });
    let heart;

    let recipeExists = favRecipes.filter((recipe) => recipe.idMeal == idMeal);
    if (recipeExists && recipeExists.length > 0) {
      heart = "fas";
    } else {
      heart = "far";
    }
    const recipeCardData = `<strong class="recipe-tag">${strArea}</strong>
      <img
        class="recipe-img"
        src="${strMealThumb}"
        alt="${strMeal}"
      />
      <div class="recipe-desc">
        <h4 class="recipe-title">${strMeal}</h4>
        <i title="Add/Remove favorite" id="${idMeal}-heart" 
        class="${heart} fa-heart heart-icon" 
        onclick="favToggle(event)"
        ></i>
      </div>`;
    recipeCardEl.innerHTML = recipeCardData;
    recipeCardsEl.appendChild(recipeCardEl);
  }
};

const favToggle = (event) => {
  event.stopPropagation();
  const id = event.target.id.replace("-heart", "");
  const element = document.getElementById(id + "-heart");
  favoriteToggle(element, id);
  heartToggle(id);
  toggleNoFavoritesText();
};

const heartToggle = (id) => {
  const element = document.getElementById(id + "-heart");
  element.classList.toggle("far");
  element.classList.toggle("fas");
};

const removeFavRecipe = (event) => {
  event.stopPropagation();
  const id = event.target.id.replace("-favicon", "");
  let recipe = recipes.filter((recipe) => recipe.idMeal == id);
  removeRecipeFromFav(recipe, id);
  toggleNoFavoritesText();
  try {
    heartToggle(id);
  } catch (error) {}
};

const favoriteToggle = (element, id) => {
  if (element.classList.contains("far")) {
    let recipe = recipes.filter((recipe) => recipe.idMeal == id);
    addRecipeToFav(recipe[0]);
    favRecipes.push(recipe[0]);
    setLS();
  } else {
    let recipe = recipes.filter((recipe) => recipe.idMeal == id);
    removeRecipeFromFav(recipe, id);
  }
};

const addRecipeToFav = (favRecipe) => {
  let { idMeal, strMealThumb, strMeal, shortTitle } = favRecipe;
  const favoriteEl = document.createElement("article");
  favoriteEl.classList.add("favorite");
  favoriteEl.addEventListener("click", () => {
    showRecipeModal(idMeal);
  });
  favoriteEl.setAttribute("id", idMeal + "-fav");
  const favoriteData = `
    <i class="fas fa-times times-icon" 
      id="${idMeal}-favicon"
      onclick="removeFavRecipe(event)"
      title="Remove favorite"
      ></i>
    <div class="fav-recipe" title="${strMeal}">
      <img
        class="fav-img"
        src="${strMealThumb}"
        alt="${strMeal}"
      />
      <p class="fav-title">${shortTitle}</p>
    </div>`;
  favoriteEl.innerHTML = favoriteData;
  favoritesEl.appendChild(favoriteEl);
};

const removeRecipeFromFav = (unFavRecipe, id) => {
  const unFavoriteEl = document.getElementById(id + "-fav");
  favoritesEl.removeChild(unFavoriteEl);
  try {
    favRecipes = favRecipes.filter((recipe) => recipe.idMeal != id);
    setLS();
  } catch (error) {}
};

const showRecipeModal = async (id) => {
  let recipeDetail = await fetchRecipe(RECIPE_DETAILS_URL + id);
  recipe = recipeDetail.meals[0];
  let list1 = "";
  let list2 = "";
  for (let i = 0; i < 20; i++) {
    const ingredient = "strIngredient" + i;
    const measure = "strMeasure" + i;
    if (recipe[ingredient] && i < 10) {
      list1 =
        list1 +
        "\n<li>" +
        recipe[ingredient] +
        ": " +
        "<b>" +
        recipe[measure] +
        "</b>";
      ("</li>");
    } else if (recipe[ingredient] && i > 10) {
      list2 =
        list2 +
        "\n<li>" +
        recipe[ingredient] +
        ": " +
        "<b>" +
        recipe[measure] +
        "</b>";
      ("</li>");
    }
  }

  modalOverlayEl.innerHTML = "";
  const modalEl = document.createElement("div");
  modalEl.classList.add("modal");
  const modalData = `
  <header class="modal-header">
      <h2>${recipe.strMeal}</h2>
      <i
        class="fas fa-times modal-times-icon"
        onclick="toggleModal()"
      ></i>
    </header>
    <div class="main-details">
      <div class="img-container">
        <img
          src="${recipe.strMealThumb}"
          alt="${recipe.strMeal}"
        />
      </div>
      <div class="links">
        <h3>${recipe.strArea} | ${recipe.strCategory}</h3>
        <a
          href="${recipe.strSource}"
          target="_blank"
        >
          Visit Source
        </a>
        <a
          href="${recipe.strYoutube}"
          target="_blank"
        >
          Watch Video on Youtube
        </a>
      </div>
    </div>
    <div class="ingredients-header">
      <h3>Ingredients</h3>
      <i
        class="fa fa-angle-down down-icon"
        id="down-icon"
        aria-hidden="true"
        onclick="toggleIngredients()"
        title="Toggle Ingredients"
      ></i>
    </div>
    <div class="ingredients" id="ingredients">
      <section class="list-1">
        <ul>
          ${list1}
        </ul>
      </section>
      <section class="list-2">
        <ul>
          ${list2}
        </ul>
      </section>
    </div>
    <h3>Instructions</h3>
    <article class="instructions">
      <pre>${recipe.strInstructions}</pre>
    </article>
  `;
  modalEl.innerHTML = modalData;
  modalOverlayEl.appendChild(modalEl);
  toggleModal();
};

const toggleModal = () => {
  modalOverlayEl.classList.toggle("hide-modal");
};

const toggleIngredients = () => {
  const ingredientsEL = document.getElementById("ingredients");
  ingredientsEL.classList.toggle("hide-ingredients");
  const downArrowEL = document.getElementById("down-icon");
  downArrowEL.classList.toggle("rotate-icon");
};

const toggleNoFavoritesText = () => {
  if (favRecipes.length == 0) {
    const noFavRecipes = document.createElement("div");
    noFavRecipes.classList.add("no-fav-recipes");
    noFavRecipes.innerHTML = `
      <p>No favorite recipes.</p>
      <p>Add recipes using heart icon</p>`;
    favoritesEl.appendChild(noFavRecipes);
  } else {
    try {
      const noFavRecipes = document.querySelector(".no-fav-recipes");
      favoritesEl.removeChild(noFavRecipes);
    } catch (error) {}
  }
};

function setLS() {
  localStorage.setItem("favRecipes", JSON.stringify(favRecipes));
}

function getLS() {
  return JSON.parse(localStorage.getItem("favRecipes"));
}

form.addEventListener("submit", searchRecipes);

recipeCardsEl.innerHTML = "";
let recipes = [];
let favRecipes = [];
for (let i = 0; i < 5; i++) {
  startRecipeApp(RANDOM_RECIPE_URL);
}

let recipesFromLS = getLS();
if (recipesFromLS && recipesFromLS.length > 0) {
  favRecipes = recipesFromLS;
  for (let i = 0; i < favRecipes.length; i++) {
    addRecipeToFav(favRecipes[i]);
  }
} else {
  toggleNoFavoritesText();
}
