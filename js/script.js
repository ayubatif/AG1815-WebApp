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

    // Remove all ingredients then add them again because we dont store recipes
    matrixElement.removeAllIngredients();
    if (matrixElement.num_ingredients < 1) {
        for (let i = 0; i < id + 1; i++) {
            matrixElement.addIngredient("Recipe" + id + ":" + i, ((3 * (id + 3) + 5 * (id + 1) * (i + 2)) % 100));
        }
    }

    // Replace current recipe picture
    matrixElement.changePicture("./res/phd-image" + id + ".png");
    coolChart();
}

/* 
* Replace recipe name on search box placeholder
*/
function handleRecipeNameChange(selected, matrix) {
    matrixElement = matrix[selected];
    console.log(matrixElement.recipe);
    if (matrixElement.recipe == null) { 
        document.getElementById("SearchInput").setAttribute("Placeholder", "Example Recipes...");
        return;
     }
    recipe_name_containers = document.getElementsByClassName("dropdown-recipe");
    document.getElementById("SearchInput").setAttribute("Placeholder", recipe_name_containers[matrixElement.recipe].innerHTML);
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

    const root_element = document.getElementById('IngredientsContainer');
    var fragment = document.createDocumentFragment();

    // remove all ingredient containers
    while (root_element.firstChild) {
        root_element.removeChild(root_element.firstChild);
    }

    meal_ingredients.forEach(function (ingredient) {
        var ingredient_container = document.createElement("div");
        ingredient_container.className = "ingredient-container";

        var ingredient_name_container = document.createElement("div");
        ingredient_name_container.className = "ingredient-name-container";

        var ingredient_name = document.createElement("p");
        ingredient_name.className = "ingredient-name";
        ingredient_name.innerHTML = ingredient.name;

        var ingredient_slider_container = document.createElement("div");
        ingredient_slider_container.className = "ingredient-slider-container";

        var ingredient_slider = document.createElement("input");
        ingredient_slider.className = "ingredient-slider";
        ingredient_slider.setAttribute("type", "range");
        ingredient_slider.setAttribute("min", 1);
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
        ingredient_slider.oninput = function () {
            ingredient_amount.innerHTML = this.value;
            ingredient.changeAmount(this.value);
        }
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
    ingredients = null;
    num_ingredients = 0;
    picture = null;

    /* 
    * Default contructor of meal object
    */
    constructor() {
        this.recipe = null;
        this.ingredients = [];
        this.picture = "./res/phd-base.png";
    }

    /* 
    * Changes the recipe
    */
    changeRecipe(newRecipe) {
        this.recipe = newRecipe;
    }

    /**
     * Add an ingredient
     */
    addIngredient(new_ingredient_name, new_ingredient_amount) {
        this.ingredients.push(new Ingredient(new_ingredient_name, new_ingredient_amount));
        this.num_ingredients++;
    }

    /**
     * Remove an ingredient TODO
     */
    removeIngredient() { }

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

    document.getElementsByClassName("matrix-element")[0].style.backgroundColor = "#ffffff";
    document.getElementById("phd-image").src = matrix[0].picture;
}

/* 
* Changes the selections and shows a visual representaion of it.
*/
function changeElement(toChange, selected, matrix) {
    if (toChange == selected) { 
        return toChange;
    }
    matrixElements = document.getElementsByClassName("matrix-element");
    matrixElements[selected].style.backgroundColor = matrixElements[toChange].style.backgroundColor;
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
        console.log(matrix[index].ingredients);
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
            colors: ["#fde23e","#f16e23", "#57d9ff","#937e88","#f23da3"]
        }
    );
    theChart.draw();
    
}

var samplePHD = {
    "Meat": 10,
    "Dairy": 20,
    "Fiber": 15,
    "Fruits": 60,
    "Kebab": 5
}

var sampleMeal = {
    "Meat": 30,
    "Dairy": 30,
    "Fiber": 15,
    "Fruits": 31,
    "Kebab": 30
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
        var max_dim_absolute = Math.min(this.canvas.width/2, this.canvas.height/2);
        var max_dim = max_dim_absolute * 0.9;
        var graph_scale = 1;
        for (var categ in this.options.meal) {
            num_val++;
            // scale graph
            while ((this.options.meal[categ]/this.options.phd[categ] * max_dim/4 * graph_scale) > max_dim ) {
                graph_scale = graph_scale * 0.9;
            }
        }
 
        // draw slices
        var start_angle = 0;
        for (categ in this.options.meal) {
            val = this.options.meal[categ];
            var phd_val = this.options.phd[categ];
            var relative_val = val / phd_val;
            
            var slice_angle = 2 * Math.PI * (1 / num_val);

            
            console.log("Drawing slice: "+categ+" with rel_val: "+relative_val);
 
            drawPieSlice(
                this.ctx,
                this.canvas.width/2,
                this.canvas.height/2,
                max_dim/4 * relative_val * graph_scale,
                start_angle,
                start_angle+slice_angle,
                this.colors[color_index%this.colors.length]
            );
 
            start_angle += slice_angle;
            color_index++;
        }

        // draw phd circle
        this.ctx.fillStyle = "#47c3d3";
        drawArc(
            this.ctx,
            this.canvas.width/2,
            this.canvas.height/2,
            max_dim/4 * graph_scale,
            start_angle,
            2 * Math.PI * max_dim/2
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

function drawArc(ctx, centerX, centerY, radius, startAngle, endAngle){
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.stroke();
}