/**
 * Toggle between display: none and display:block for recipes list
 */
function toggleRecipesDropdown() {
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
function handleRecipesChange(id, selected, matrix) {
  toggleRecipesDropdown();
  handleRecipeState(id, selected, matrix);
  handleRecipeNameChange(selected, matrix);
  handleIngredientsState(selected, matrix);
  handleImageChange(selected, matrix);
}

/*
 * Inputs data into the object for that matrix element
 */
function handleRecipeState(id, selected, matrix) {
  matrixElement = matrix[selected];
  matrixElement.changeRecipe(id);

  // Replace current recipe picture
  matrixElement.changePicture("./res/phd-image" + id + ".png");
}

/*
 * Replace recipe name on search box placeholder
 */
function handleRecipeNameChange(selected, matrix) {
  matrixElement = matrix[selected];
  if (matrixElement.recipe == null) {
    document
      .getElementById("SearchInput")
      .setAttribute("Placeholder", "Example Recipes...");
    return;
  }
  recipe_name_containers = document.getElementsByClassName("dropdown-recipe");
  document
    .getElementById("SearchInput")
    .setAttribute("Placeholder", matrixElement.recipe_name);
}

/*
 * Changes the image based on recipe selection
 */
function handleImageChange(selected, matrix) {
  document.getElementById("phd-image").src = matrix[selected].picture;
}

/*
 * Changes the ingredients based on recipe selection
 */
function handleIngredientsState(selected, matrix) {
  matrixElement = matrix[selected];
  meal_ingredients = matrixElement.ingredients;

  const root_element = document.getElementById("IngredientsContainer");
  var fragment = document.createDocumentFragment();

  // remove all ingredient containers
  while (root_element.firstChild) {
    root_element.removeChild(root_element.firstChild);
  }

  meal_ingredients.forEach(function(ingredient) {
    var ingredient_container = document.createElement("div");
    ingredient_container.className = "ingredient-container";

    var ingredient_name_container = document.createElement("div");
    ingredient_name_container.className = "ingredient-name-container";

    var ingredient_name = document.createElement("p");
    ingredient_name.className = "ingredient-name";
    ingredient_name.innerHTML = ingredient.ingredient;

    var ingredient_slider_container = document.createElement("div");
    ingredient_slider_container.className = "ingredient-slider-container";

    var ingredient_slider = document.createElement("input");
    ingredient_slider.className = "ingredient-slider";
    ingredient_slider.setAttribute("type", "range");
    ingredient_slider.setAttribute("min", 0);
    ingredient_slider.setAttribute("max", 100);
    ingredient_slider.setAttribute("value", ingredient.amount);

    var ingredient_amount_container = document.createElement("div");
    ingredient_amount_container.className = "ingredient-amount-container";

    var ingredient_amount = document.createElement("p");
    ingredient_amount.className = "ingredient-amount";
    ingredient_amount.innerHTML = ingredient.amount;

    ingredient_name_container.appendChild(ingredient_name);
    ingredient_container.appendChild(ingredient_name_container);

    // handle change in ingredient amount via slider
    ingredient_slider.oninput = function() {
      ingredient_amount.innerHTML = this.value;
      ingredient.amount = this.value;
    };
    ingredient_slider_container.appendChild(ingredient_slider);
    ingredient_container.appendChild(ingredient_slider_container);

    ingredient_amount_container.appendChild(ingredient_amount);
    ingredient_container.appendChild(ingredient_amount_container);

    fragment.appendChild(ingredient_container);
  });

  root_element.appendChild(fragment);
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
class Meal {
  recipe = null;
  recipe_name = null;
  ingredients = null;
  num_ingredients = 0;
  picture = null;

  /*
   * Default contructor of meal object
   */
  constructor() {
    this.recipe = null;
    this.recipe_name = null;
    this.ingredients = [
      { ingredient: "Whole Grains", amount: 0, color: "#000099" },
      { ingredient: "Starchy Vegetables", amount: 0, color: "#006666" },
      { ingredient: "Vegetables", amount: 0, color: "#0099cc" },
      { ingredient: "Fruits", amount: 0, color: "#0033cc" },
      { ingredient: "Dairy", amount: 0, color: "#669999" },
      { ingredient: "Beef", amount: 0, color: "#33cccc" },
      { ingredient: "Pork", amount: 0, color: "#0099ff" },
      { ingredient: "Poultry", amount: 0, color: "#00ffcc" },
      { ingredient: "Eggs", amount: 0, color: "#33ccff" },
      { ingredient: "Fish", amount: 0, color: "#6666ff" },
      { ingredient: "Beans", amount: 0, color: "#00ff99" },
      { ingredient: "Soy", amount: 0, color: "#99ccff" },
      { ingredient: "Peanuts", amount: 0, color: "#cc33ff" },
      { ingredient: "Tree Nuts", amount: 0, color: "#009900" },
      { ingredient: "Palm Oil", amount: 0, color: "#99ff66" },
      { ingredient: "Unsaturated Oil", amount: 0, color: "#ff99cc" },
      { ingredient: "Lard", amount: 0, color: "#cc0099" },
      { ingredient: "Sugar", amount: 0, color: "#ff0066" }
    ];
    this.picture = "./res/phd-base.png";
  }

  /*
   * Changes the recipe
   */
  changeRecipe(newRecipe) {
    switch (newRecipe) {
      case 0:
        this.chooseMeatball();
        break;

      case 1:
        this.choosePlanetaryWok();
        break;

      case 2:
        this.chooseFlyingJacob();
        break;

      case 3:
        this.chooseRootSoup();
        break;
    }
  }

  /**
   * Add an ingredient
   */
  addIngredient(new_ingredient_name, new_ingredient_amount) {
    this.ingredients.push(
      new Ingredient(new_ingredient_name, new_ingredient_amount)
    );
    this.num_ingredients++;
  }

  /**
   * Remove all ingredients
   */
  removeAllIngredients() {
    this.ingredients = [];
    this.num_ingredients = 0;
  }

  /*
   * Changes the picture
   */
  changePicture(newPicture) {
    this.picture = newPicture;
  }

  /*
   * Choose köttbullar
   */
  chooseMeatball() {
    this.recipe = 0;
    this.recipe_name = "Meatballs with mashed potatoes and lingonberry jam";
    this.ingredients = chooseIngredientsMeatball();
  }

  /*
   * Choose planetary health wok
   */
  choosePlanetaryWok() {
    this.recipe = 1;
    this.recipe_name = "The Planetary Health Wok";
    this.ingredients = chooseIngredientsPlanetaryWok();
  }

  /*
   * Choose flying jacob
   */
  chooseFlyingJacob() {
    this.recipe = 2;
    this.recipe_name = "Chicken with bacon and bananas";
    this.ingredients = chooseIngredientsFlyingJacob();
  }

  /*
   * Choose root vegetable soup
   */
  chooseRootSoup() {
    this.recipe = 3;
    this.recipe_name = "Root vegetable soup";
    this.ingredients = chooseIngredientsRootSoup();
  }
}

/*
 * Is köttbullar ingredients amount
 */
function chooseIngredientsMeatball() {
  ingredients = [
    { ingredient: "Whole Grains", amount: 5, color: "#000099" },
    { ingredient: "Starchy Vegetables", amount: 150, color: "#006666" },
    { ingredient: "Vegetables", amount: 13, color: "#0099cc" },
    { ingredient: "Fruits", amount: 50, color: "#0033cc" },
    { ingredient: "Dairy", amount: 105, color: "#669999" },
    { ingredient: "Beef", amount: 62, color: "#33cccc" },
    { ingredient: "Pork", amount: 63, color: "#0099ff" },
    { ingredient: "Poultry", amount: 0, color: "#00ffcc" },
    { ingredient: "Eggs", amount: 16, color: "#33ccff" },
    { ingredient: "Fish", amount: 0, color: "#6666ff" },
    { ingredient: "Beans", amount: 0, color: "#00ff99" },
    { ingredient: "Soy", amount: 0, color: "#99ccff" },
    { ingredient: "Peanuts", amount: 0, color: "#cc33ff" },
    { ingredient: "Tree Nuts", amount: 0, color: "#009900" },
    { ingredient: "Palm Oil", amount: 0, color: "#99ff66" },
    { ingredient: "Unsaturated Oil", amount: 0, color: "#ff99cc" },
    { ingredient: "Lard", amount: 0, color: "#cc0099" },
    { ingredient: "Sugar", amount: 26, color: "#ff0066" }
  ];

  return ingredients;
}

/*
 * Is planetary health wok ingredients amount
 */
function chooseIngredientsPlanetaryWok() {
  ingredients = [
    { ingredient: "Whole Grains", amount: 175, color: "#000099" },
    { ingredient: "Starchy Vegetables", amount: 25, color: "#006666" },
    { ingredient: "Vegetables", amount: 126, color: "#0099cc" },
    { ingredient: "Fruits", amount: 0, color: "#0033cc" },
    { ingredient: "Dairy", amount: 98, color: "#669999" },
    { ingredient: "Beef", amount: 0, color: "#33cccc" },
    { ingredient: "Pork", amount: 0, color: "#0099ff" },
    { ingredient: "Poultry", amount: 0, color: "#00ffcc" },
    { ingredient: "Eggs", amount: 0, color: "#33ccff" },
    { ingredient: "Fish", amount: 0, color: "#6666ff" },
    { ingredient: "Beans", amount: 0, color: "#00ff99" },
    { ingredient: "Soy", amount: 88, color: "#99ccff" },
    { ingredient: "Peanuts", amount: 6, color: "#cc33ff" },
    { ingredient: "Tree Nuts", amount: 0, color: "#009900" },
    { ingredient: "Palm Oil", amount: 0, color: "#99ff66" },
    { ingredient: "Unsaturated Oil", amount: 0, color: "#ff99cc" },
    { ingredient: "Lard", amount: 0, color: "#cc0099" },
    { ingredient: "Sugar", amount: 1, color: "#ff0066" }
  ];

  return ingredients;
}

/*
 * Is flying jacob ingredients amount
 */
function chooseIngredientsFlyingJacob() {
  ingredients = [
    { ingredient: "Whole Grains", amount: 60, color: "#000099" },
    { ingredient: "Starchy Vegetables", amount: 0, color: "#006666" },
    { ingredient: "Vegetables", amount: 15, color: "#0099cc" },
    { ingredient: "Fruits", amount: 30, color: "#0033cc" },
    { ingredient: "Dairy", amount: 100, color: "#669999" },
    { ingredient: "Beef", amount: 0, color: "#33cccc" },
    { ingredient: "Pork", amount: 35, color: "#0099ff" },
    { ingredient: "Poultry", amount: 125, color: "#00ffcc" },
    { ingredient: "Eggs", amount: 0, color: "#33ccff" },
    { ingredient: "Fish", amount: 0, color: "#6666ff" },
    { ingredient: "Beans", amount: 0, color: "#00ff99" },
    { ingredient: "Soy", amount: 0, color: "#99ccff" },
    { ingredient: "Peanuts", amount: 15, color: "#cc33ff" },
    { ingredient: "Tree Nuts", amount: 0, color: "#009900" },
    { ingredient: "Palm Oil", amount: 0, color: "#99ff66" },
    { ingredient: "Unsaturated Oil", amount: 2, color: "#ff99cc" },
    { ingredient: "Lard", amount: 0, color: "#cc0099" },
    { ingredient: "Sugar", amount: 0, color: "#ff0066" }
  ];

  return ingredients;
}

/*
 * Is root vegetable soup ingredients amount
 */
function chooseIngredientsRootSoup() {
  ingredients = [
    { ingredient: "Whole Grains", amount: 0, color: "#000099" },
    { ingredient: "Starchy Vegetables", amount: 75, color: "#006666" },
    { ingredient: "Vegetables", amount: 150, color: "#0099cc" },
    { ingredient: "Fruits", amount: 0, color: "#0033cc" },
    { ingredient: "Dairy", amount: 100, color: "#669999" },
    { ingredient: "Beef", amount: 0, color: "#33cccc" },
    { ingredient: "Pork", amount: 0, color: "#0099ff" },
    { ingredient: "Poultry", amount: 0, color: "#00ffcc" },
    { ingredient: "Eggs", amount: 0, color: "#33ccff" },
    { ingredient: "Fish", amount: 0, color: "#6666ff" },
    { ingredient: "Beans", amount: 0, color: "#00ff99" },
    { ingredient: "Soy", amount: 0, color: "#99ccff" },
    { ingredient: "Peanuts", amount: 0, color: "#cc33ff" },
    { ingredient: "Tree Nuts", amount: 0, color: "#009900" },
    { ingredient: "Palm Oil", amount: 0, color: "#99ff66" },
    { ingredient: "Unsaturated Oil", amount: 15, color: "#ff99cc" },
    { ingredient: "Lard", amount: 0, color: "#cc0099" },
    { ingredient: "Sugar", amount: 0, color: "#ff0066" }
  ];

  return ingredients;
}

/**
 * Ingredient class holds information on name and amount (maybe food deitary class?)
 */
class Ingredient {
  name = null;
  amount = 0;

  constructor(ingredient_name, ingredient_amount) {
    this.name = ingredient_name;
    this.amount = ingredient_amount;
  }

  changeAmount(ingredient_amount) {
    this.amount = ingredient_amount;
  }
}

/*
 * Initializes the matrix and shows the default selection
 */
function initializeMatrix(matrix) {
  for (let index = 0; index < 21; index++) {
    matrix[index] = new Meal();

    // Init 1-5 random ingredients
    /*
        let num_ing = Math.ceil((Math.random()*5));
        while(num_ing-- > 0) {
          matrix[index].addIngredient((index+1)+":"+num_ing, Math.ceil(Math.random()*100) % 100);
        }
        */
  }

  document.getElementsByClassName("matrix-element")[0].style.backgroundColor =
    "#ffffff";
  document.getElementById("phd-image").src = matrix[0].picture;

  handleIngredientsState(selected, matrix);
}

/*
 * Changes the selections and shows a visual representaion of it.
 */
function changeElement(toChange, selected, matrix) {
  if (toChange == selected) {
    return toChange;
  }
  matrixElements = document.getElementsByClassName("matrix-element");
  matrixElements[selected].style.backgroundColor =
    matrixElements[toChange].style.backgroundColor;
  matrixElements[toChange].style.backgroundColor = "#ffffff";
  handleRecipeNameChange(toChange, matrix);
  handleIngredientsState(toChange, matrix);
  handleIngredientsState(toChange, matrix);
  handleImageChange(toChange, matrix);
  return toChange;
}

/*
 * Debug function that prints out selected and the matrix contents
 */
function debug(selected, matrix) {
  console.log(selected);

  for (let index = 0; index < matrix.length; index++) {
    console.log("element: " + index);
    console.log(matrix[index].recipe);
    console.log(matrix[index].recipe_name);
    for (let y = 0; y < matrix[index].ingredient.length; y++) {
      console.log(matrix[index].ingredient.ingredient);
    }
    console.log(matrix[index].picture);
  }
}

/**
 * Draw a cool PHD relative chart
 */
function coolChart() {
    var mCanvas = document.getElementById("testchart");

    var ctx = mCanvas.getContext("2d");
    var theChart = new weirdChart( {
            canvas: mCanvas,
            meal: sampleMeal,
            phd: samplePHD,
            colors: [
                "#1ce23e","#b16e23", "#47d9ff","#937e88","#7c2da3", 
                "#32323e","#f16533", "537d9ff","#427e88","#ade42e",
                "#116e33", "#2797ff","#637648",
            ]
        }
    );
    theChart.draw();
    
}

var samplePHD = {
    "Meat0": 10,
    "Dairy0": 20,
    "Fiber0": 15,
    "Fruits0": 60,
    "Kebab0": 25,
    "Meat1": 20,
    "Dairy1": 30,
    "Fiber1": 25,
    "Fruits1": 20,
    "Kebab1": 15,
    "Meat2": 14,
    "Dairy2": 10,
    "Fiber2": 25,
    "Fruits2": 30,
    "Kebab2": 15,
    "Meat3": 12,
    "Dairy3": 32,
    "Fiber3": 10
}

var sampleMeal = {
    "Meat0": 20,
    "Dairy0": 20,
    "Fiber0": 25,
    "Fruits0": 30,
    "Kebab0": 25,
    "Meat1": 40,
    "Dairy1": 5,
    "Fiber1": 25,
    "Fruits1": 2,
    "Kebab1": 15,
    "Meat2": 5,
    "Dairy2": 15,
    "Fiber2": 25,
    "Fruits2": 14,
    "Kebab2": 12,
    "Meat3": 0,
    "Dairy3": 3,
    "Fiber3": 10
};

// parts provided by https://code.tutsplus.com
var weirdChart = function(options) {
    this.options = options;
    this.canvas = options.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.colors = options.colors;

    this.draw = function() {
        var color_index = 0;
        var num_val = 0;
        var max_rad_absolute = Math.min(this.canvas.width/2, this.canvas.height/2);
        var max_rad_90 = max_rad_absolute * 0.9; // padding of 10% radius
        var phd_rad = max_rad_90; // radius of the phd circle is base 100% radius
        for (var categ in this.options.meal) {
            num_val++;
            let relative_val = this.options.meal[categ] / this.options.phd[categ];
            // scale phd circle and as a result the rest of the graph
            while ((relative_val * phd_rad) > max_rad_90) {
                phd_rad = phd_rad * 0.9; // scale the graph by 0.9 whenever elements too big
            }
        }
        // draw slices
        var start_angle = 0;
        var slice_angle = 2 * Math.PI * (1 / num_val);
        for (var categ in this.options.meal) {
            let relative_val = this.options.meal[categ] / this.options.phd[categ];
            drawPieSlice(
                this.ctx,
                this.canvas.width / 2,
                this.canvas.height / 2,
                relative_val * phd_rad,
                start_angle,
                start_angle + slice_angle,
                this.colors[color_index]
            );
            start_angle += slice_angle;
            color_index++;
        }

        // draw phd circle
        drawArc(
            this.ctx,
            this.canvas.width/2,
            this.canvas.height/2,
            phd_rad,
            start_angle,
            2 * Math.PI * phd_rad,
            "#47c3d3",
            true
        )
 
    }
}

function drawPieSlice(ctx, centerX, centerY, radius, startAngle, endAngle, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(centerX,centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();
}

function drawLine(ctx, startX, startY, endX, endY){
    ctx.beginPath();
    ctx.moveTo(startX,startY);
    ctx.lineTo(endX,endY);
    ctx.stroke();
}

function drawArc(ctx, centerX, centerY, radius, startAngle, endAngle, color, dashed){
    ctx.strokeStyle = color;
    if (dashed) ctx.setLineDash([5, 3]); /*dashes are 5px and spaces are 3px*/
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.stroke();
}