top_culprits_global = [-1];

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
  updateProgressBar(matrix);
  coolChart(matrix[selected]);
  updateCar(matrix);
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
    ingredient_slider.setAttribute("max", (ingredient.amount>0)? ingredient.amount*2 : 100);
    ingredient_slider.setAttribute("value", ingredient.amount);

    var ingredient_amount_container = document.createElement("div");
    ingredient_amount_container.className = "ingredient-amount-container";

    var ingredient_amount = document.createElement("input");
    ingredient_amount.className = "ingredient-amount";
    ingredient_amount.setAttribute("type", "text");
    ingredient_amount.setAttribute("id", "SearchInput");
    ingredient_amount.value = ingredient.amount+"g";

    ingredient_amount.onkeyup = function() {
      let new_val = parseInt(this.value.substr(0, this.value.length-1), 10);
      if (new_val >= 0) {
        ingredient_slider.setAttribute("max", (new_val > 0)? new_val*2 : 100);
        ingredient_slider.setAttribute("value", new_val);
        ingredient.amount = new_val;
        handleImageChange(selected, matrix);
      }
    }

    ingredient_name_container.appendChild(ingredient_name);
    ingredient_container.appendChild(ingredient_name_container);

    // handle change in ingredient amount via slider
    ingredient_slider.oninput = function() {
      ingredient_amount.value = this.value+"g";
      ingredient.amount = this.value  ;
      handleImageChange(selected, matrix);
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

/*
 * The average perfect meal
 */
function chooseIngredientsPHD() {
  ingredients = [
    { ingredient: "Whole Grains", amount: 232, color: "#000099" },
    { ingredient: "Starchy Vegetables", amount: 50, color: "#006666" },
    { ingredient: "Vegetables", amount: 400, color: "#0099cc" },
    { ingredient: "Fruits", amount: 200, color: "#0033cc" },
    { ingredient: "Dairy", amount: 250, color: "#669999" },
    { ingredient: "Beef", amount: 7, color: "#33cccc" },
    { ingredient: "Pork", amount: 7, color: "#0099ff" },
    { ingredient: "Poultry", amount: 29, color: "#00ffcc" },
    { ingredient: "Eggs", amount: 13, color: "#33ccff" },
    { ingredient: "Fish", amount: 50, color: "#6666ff" },
    { ingredient: "Beans", amount: 50, color: "#00ff99" },
    { ingredient: "Soy", amount: 25, color: "#99ccff" },
    { ingredient: "Peanuts", amount: 28, color: "#cc33ff" },
    { ingredient: "Tree Nuts", amount: 13, color: "#009900" },
    { ingredient: "Palm Oil", amount: 3, color: "#99ff66" },
    { ingredient: "Unsaturated Oil", amount: 50, color: "#ff99cc" },
    { ingredient: "Lard", amount: 2, color: "#cc0099" },
    { ingredient: "Sugar", amount: 16, color: "#ff0066" }
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

/*
 * Handles the progress bar
 */
function updateProgressBar(matrix)
{
  ingredients = [
    { ingredient: "Whole Grains", greenhouseGas: 1},
    { ingredient: "Starchy Vegetables", greenhouseGas: 2},
    { ingredient: "Vegetables", greenhouseGas: 3},
    { ingredient: "Fruits", greenhouseGas: 4},
    { ingredient: "Dairy", greenhouseGas: 5},
    { ingredient: "Beef", greenhouseGas: 150},
    { ingredient: "Pork", greenhouseGas: 7},
    { ingredient: "Poultry", greenhouseGas: 8},
    { ingredient: "Eggs", greenhouseGas: 9},
    { ingredient: "Fish", greenhouseGas: 10},
    { ingredient: "Beans", greenhouseGas: 11},
    { ingredient: "Soy", greenhouseGas: 12},
    { ingredient: "Peanuts", greenhouseGas: 13},
    { ingredient: "Tree Nuts", greenhouseGas: 14},
    { ingredient: "Palm Oil", greenhouseGas: 15},
    { ingredient: "Unsaturated Oil", greenhouseGas: 16},
    { ingredient: "Lard", greenhouseGas: 17},
    { ingredient: "Sugar", greenhouseGas: 18}
  ];
  var totalMealGas = 0;
  var weeklyMaxGas = 1500 * 21;

  for (let i = 0; i < matrix.length; i++)
  {
    var meal = matrix[i];
    for (let j = 0; j < ingredients.length; j++)
    {
      totalMealGas += ingredients[j].greenhouseGas * meal.ingredients[j].amount;
    }
  }

  var percentageGas = Math.floor(totalMealGas/weeklyMaxGas * 100);
  var elem = document.getElementById("myprogressBar");
  var width = percentageGas;

  if (width == 0)
  {
    elem.style.width = width + '%';
    elem.innerHTML = 0 + '%';
  }
  else if (width >= 100) {
    width = 100;
    elem.style.width = width + '%';
    elem.innerHTML = percentageGas + "%";
    elem.style.backgroundColor = "#FF0000";
  }
  else
  {
    width++;
    elem.style.width = width + '%';
    elem.innerHTML = width + '%';
    elem.style.backgroundColor = "#4CAF50";
  }
}

function getKilometer(matrix)
{
  var totalMealKM = 0;

  ingredients = [
    { ingredient: "Whole Grains", carKilometer: 18},
    { ingredient: "Starchy Vegetables", carKilometer: 17},
    { ingredient: "Vegetables", carKilometer: 16},
    { ingredient: "Fruits", carKilometer: 15},
    { ingredient: "Dairy", carKilometer: 14},
    { ingredient: "Beef", carKilometer: 150},
    { ingredient: "Pork", carKilometer: 12},
    { ingredient: "Poultry", carKilometer: 11},
    { ingredient: "Eggs", carKilometer: 10},
    { ingredient: "Fish", carKilometer: 9},
    { ingredient: "Beans", carKilometer: 8},
    { ingredient: "Soy", carKilometer: 7},
    { ingredient: "Peanuts", carKilometer: 6},
    { ingredient: "Tree Nuts", carKilometer: 5},
    { ingredient: "Palm Oil", carKilometer: 4},
    { ingredient: "Unsaturated Oil", carKilometer: 3},
    { ingredient: "Lard", carKilometer: 2},
    { ingredient: "Sugar", carKilometer: 1}
  ];

  for (let i = 0; i < matrix.length; i++)
  {
    var meal = matrix[i];
    for (let j = 0; j < ingredients.length; j++)
    {
      totalMealKM += ingredients[j].carKilometer * meal.ingredients[j].amount;
    }
  }

return totalMealKM;

}

function updateCar(matrix) {
  elem_km_text = document.getElementById("car-container-km-text");
  elem_km_text.innerHTML = getKilometer(matrix)+"km driven by a diesel car";
}

 /*
 * Draw a cool PHD relative chart
 */
function coolChart(some_meal) {
    var mCanvas = document.getElementById("testchart");
    var ctx = mCanvas.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height) // clear canvas
    var theChart = new weirdChart( {
            canvas: mCanvas,
            meal: some_meal,
            phd_ingredients: chooseIngredientsPHD()
        }
    );
    theChart.draw();

}

// parts provided by https://code.tutsplus.com
var weirdChart = function(options) {
    this.options = options;
    this.canvas = options.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.meal = options.meal;
    this.phd_ingredients = options.phd_ingredients;
    top_culprits_global = [];

    this.draw = function() {
        var max_rad_absolute = Math.min(this.canvas.width/2, this.canvas.height/2);
        var max_rad_90 = max_rad_absolute * 0.9; // padding of 10% radius
        var phd_rad = max_rad_90; // radius of the phd circle is base 100% radius
        for(let i = 0; i < this.phd_ingredients.length; i++) {
            let relative_val = this.meal.ingredients[i].amount / this.phd_ingredients[i].amount;
            if (relative_val > 1) {
              top_culprits_global.push(i);
            }
            // scale phd circle and as a result the rest of the graph
            while ((relative_val * phd_rad) > max_rad_90) {
                phd_rad = phd_rad * 0.9; // scale the graph by 0.9 whenever elements too big
            }
        }

        // draw slices
        var start_angle = 0;
        var slice_angle = 2 * Math.PI * (1 / this.phd_ingredients.length);
        for (let i = 0; i < this.phd_ingredients.length; i++) {
            let relative_val = this.meal.ingredients[i].amount / this.phd_ingredients[i].amount;
            drawPieSlice(
                this.ctx,
                this.canvas.width / 2,
                this.canvas.height / 2,
                relative_val * phd_rad,
                start_angle,
                start_angle + slice_angle,
                this.phd_ingredients[i].color
            );
            start_angle += slice_angle;
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

        // top 3 culprits
        var top_3_elements = [] 
        top_3_elements[0] = document.getElementById("culprut-slices-1");
        top_3_elements[1] = document.getElementById("culprut-slices-2");
        top_3_elements[2] = document.getElementById("culprut-slices-3");
        for(let j = 0; j < 3; j++) {
          top_3_elements[j].innerHTML = "";
        }

        if (top_culprits_global.length < 1) {
          top_3_elements[0].innerHTML = "Nice! All ingredients within Planetary Healh Diet limits!"
        }
        else {
          dumb_meal = this.meal;
          dumb_phd = this.phd_ingredients;
          top_culprits_global.sort(function(a, b) {
            let relative_val_a = dumb_meal.ingredients[a].amount / dumb_phd[a].amount;
            let relative_val_b = dumb_meal.ingredients[b].amount / dumb_phd[b].amount;
            return relative_val_b-relative_val_a;
          })
          for(let j = 0; (j < top_culprits_global.length) && (j < 3); j++) {
            top_3_elements[j].innerHTML = this.phd_ingredients[(top_culprits_global[j])].ingredient+" | ";
            let ingred_color = this.phd_ingredients[(top_culprits_global[j])].color;
            top_3_elements[j].style.color = ingred_color;
          }
        }
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
