/**
 * Toggle between display: none and display:block for recipes list
 */
function displayRecipesDropdown() {
  document.getElementById("SearchDropdown").classList.toggle("hidden");
  document
    .getElementById("fas-search-button")
    .classList.toggle("fa-chevron-down");
  document
    .getElementById("fas-search-button")
    .classList.toggle("fa-chevron-up");
}

/* 
* Handles choosing recipes
*/
function handleRecipesChange(id, selected, matrix)
{
    displayRecipesDropdown();
    handleRecipeState(id, selected, matrix);
    handleImageChange(selected, matrix);
}

/* 
* Inputs data into the object for that matrix element
*/
function handleRecipeState(id, selected, matrix)
{
    matrixElement = matrix[selected];
    matrixElement.changeRecipe(id);
    matrixElement.changePicture("./res/phd-image" + id + ".png")
}

/* 
* Changes the image based on recipe selection
*/
function handleImageChange(selected, matrix)
{
    document.getElementById("phd-image").src = matrix[selected].picture;
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
  for (i = 0, n = 0; i < a.length; i++) {
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
class Meal{
    recipe = null; 
    ingredients =null;
    picture = null;

    /* 
    * Default contructor of meal object
    */
    constructor()
    {
        this.recipe = null;
        this.ingredients = null;
        this.picture = "./res/phd-base.png";
    }

    /* 
    * Changes the recipe
    */
    changeRecipe(newRecipe)
    {
        this.recipe = newRecipe;
    }

    /* 
    * Changes the ingredients *TODO*
    */
    changeIngredients()
    {}

    /* 
    * Changes the picture
    */
    changePicture(newPicture)
    {
        this.picture = newPicture;
    }
}

/* 
* Initializes the matrix and shows the default selection
*/
function initializeMatrix(matrix) {
  for (let index = 0; index < 21; index++) {
    matrix[index] = new Meal();
  }

  document.getElementsByClassName("matrix-element")[0].style.backgroundColor = "#ffffff";
  document.getElementById("phd-image").src = matrix[0].picture;
}

/* 
* Changes the selections and shows a visual representaion of it.
*/
function changeElement(toChange, selected, matrix) {
  matrixElements = document.getElementsByClassName("matrix-element");
  matrixElements[selected].style.backgroundColor = matrixElements[toChange].style.backgroundColor;
  matrixElements[toChange].style.backgroundColor = "#ffffff";
  handleImageChange(toChange, matrix)
  return toChange;
}

/* 
* Debug function that prints out selected and the matrix contents
*/
function debug(selected, matrix){
    console.log(selected);

    for (let index = 0; index < matrix.length; index++) {
        console.log("element: " + index);
        console.log(matrix[index].recipe);
        console.log(matrix[index].ingredients);
        console.log(matrix[index].picture);
    }
}