const searchBtn = document.getElementById('search');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
const randomMeal = document.querySelector(".random");
const searchInput = document.getElementById('search-input');
const titleElement = document.getElementById('title');

// event listeners
searchBtn.addEventListener('click', function () {
    getMealList();
    titleElement.innerText = "You Searched For :-";
});

searchInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        getMealList();
        titleElement.innerText = "You Searched For :-";
    }
});

mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});
function setAttribute(element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}
// get meal list that matches with the ingredients
function getMealList(){
    let searchInputTxt = document.getElementById('search-input').value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
    .then(response => response.json())
    .then(data => {
        let html = "";
        if(data.meals){
            data.meals.forEach(meal => {
                html += `
               
                   
                    <div class = "meal-item" data-id = "${meal.idMeal}">
                        <div class = "meal-img">
                            <img src = "${meal.strMealThumb}" alt = "food">
                        </div>
                        <div class = "meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href = "#" class = "recipe-btn">Get Recipe</a>
                        </div>
                    </div>
                `;
            });
            mealList.classList.remove('notFound');
        } else{
            html = "Sorry, we didn't find any meal!";
            mealList.classList.add('notFound');
        }

        mealList.innerHTML = html;
    });
}
// get recipe of the meal
function getMealRecipe(e){
    e.preventDefault();
    if(e.target.classList.contains('recipe-btn')){
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response => response.json())
        .then(data => mealRecipeModal(data.meals));
    }
}
// create a modaL
function mealRecipeModal(meal) {
    console.log(meal);
    meal = meal[0];
    let ingredients = [];
    let i = 1;
    // Collect all ingredients
    while (meal[`strIngredient${i}`]) {
        ingredients.push({
            name: meal[`strIngredient${i}`],
            measure: meal[`strMeasure${i}`]
        });
        i++;
    }

    let html = `
    <div class="recipe-meal-img">
    <img src="${meal.strMealThumb}" alt="">
</div>
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <h3 id="heading">Ingredients:</h3>
        <div class="recipe-instruct">
            
            <ul>
                ${ingredients.map(ingredient => `<li>${ingredient.measure} ${ingredient.name}</li>`).join('')}
            </ul>
        </div>
     
        <div class="recipe-link">
            <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
        </div>
    `;

    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}

async function getRandomApi() {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
    const data = await response.json();
    return data;
}
function showRandomMeal() {
    getRandomApi().then(res => {
        const ranmeal = res.meals[0];
        console.log(ranmeal);
        let html = `
            <h3 id="text1">Just for You :- </h3>
            <div class="card random-card" style="width: 18rem;">
                <img class="card-img-top c-img" src="${ranmeal.strMealThumb}" alt="${ranmeal.strMeal}">
                <div class="card-body c-body">
                    <h5 class="c-title">${ranmeal.strMeal}</h5>
                    <a href="#" class="recipe-btn">Get Recipe</a>
                </div>
            </div>
        `;
        randomMeal.innerHTML += html;
        clickBtn(ranmeal, document.querySelector('.recipe-btn'));
    }).catch(err => console.log(err));
}

showRandomMeal();
function clickBtn(meal, button) {
    button.addEventListener('click', function () {
        // Call the function to show the modal with ingredients
        mealRecipeModal([meal]);
    });
}











