/**
 * Toggle between display: none and display:block for recipes list
 */
function displayRecipesDropdown() {
  document.getElementById("SearchDropdown").classList.toggle("hidden");
  document.getElementById("fas-search-button").classList.toggle("fa-chevron-down");
  document.getElementById("fas-search-button").classList.toggle("fa-chevron-up");
}

/**
 * Filter shown recipes based on search query
 */
function filterRecipes() {
  var input, filter, a, i, n;
  div = document.getElementById("SearchDropdown");
  a = div.getElementsByTagName("a");
  input = document.getElementById("SearchInput");
  filter = input.value.toUpperCase();
  for (let i = 0, n = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
      n++;
    } else {
      a[i].style.display = "none";
    }
  }
  var t = document.getElementById("null");
  n > 0 && i > 0 ? (t.style.display = "none") : (t.style.display = "block");
}

/* 
* Object that handles the variables of the meals of the days
*/
var meal = {
  // Add more when thought of
  recipe: null,
  ingredients: null,
  picture: null
};

/* 
* Initializes the matrix and shows the default selection
*/
function initializeMatrix(matrix, selected) {
  for (let index = 0; index < 21; index++) {
    matrix[index] = meal;
  }

  document.getElementsByClassName("matrix-element")[0].style.backgroundColor = "#ffffff";
}

/* 
* Changes the selections and shows a visual representaion of it.
*/
function changeElement(toChange, selected) {
  matrixElements = document.getElementsByClassName("matrix-element");
  matrixElements[selected].style.backgroundColor = matrixElements[toChange].style.backgroundColor;
  matrixElements[toChange].style.backgroundColor = "#ffffff";
  return toChange;
}

/* 
* Init ingredients' amounts and sliders
*/
function initializeIngredients() {
    var ingredient_sliders = document.getElementsByClassName("ingredient-slider");
    var ingredient_slider_values = document.getElementsByClassName("ingredient-amount-container");

    for (let i = 0; i < ingredient_sliders.length; i++) {
        ingredient_slider_values[i].innerHTML = ingredient_sliders[i].value = Math.round(Math.random()*100);
        // Update amounts on slider change
        ingredient_sliders[i].oninput = function() {
            ingredient_slider_values[i].innerHTML = this.value;
        } 
    }
}

/**
 * Update meal on relevant changes
 */
function updateMeal() {
    // work in progress
    console.log(this);
    return null;
}