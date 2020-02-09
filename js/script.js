var meal = { // Add more when thought of
    recipe: null, 
    ingredients: null, 
    picture: null
}

function initializeMatrix(matrix)
{
    for (let index = 0; index < 21; index++) {
        matrix[index] = meal;
    }
}

function changeElement(selected, current)
{
    current = selected;
}

function debug(matrix) {
    for (let index = 0; index < matrix.length; index++) {
        console.log(matrix[index].recipe);
    }
}