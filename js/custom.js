const countryDishes = ['American', 'Canadian', 'Mexican', 'Spanish', 'Indian'];

countryDishes.forEach((dish) => {
    const dishContainer = document.getElementById('country-dish-container');
    const dishItem = document.createElement('li');
    dishItem.classList.add('dish-item');
    dishItem.style.listStyle = 'none';
    dishItem.innerHTML = `
        <a href="#" class="text-decoration-none fs-5">${dish}</a>
    `;
    dishContainer.appendChild(dishItem);
})

// Dish Load From API
const dishCategoryLoad = async () => {
    try{
        const dishCategoryData = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
        const dishCategory = await dishCategoryData.json();
        showDishesCategories(dishCategory.categories);
    } catch(err){
        return alert(err);
    }
}

const showDishesCategories = (categories) =>{
    // console.log(categories);
    const dishContainer = document.getElementById('dish-container');
    categories.reverse().forEach((category) => {
        const {strCategory, strCategoryThumb} = category;
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('col');
        categoryDiv.innerHTML = `
            <div class="card p-3">
                <img src="${strCategoryThumb}" class="card-img-top" alt="...">
                <div class="card-body d-flex justify-content-evenly">
                    <h4 class="card-title">
                        ${strCategory}
                    </h4>
                    <button onclick="recipeDataLoad('${strCategory}')" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#categoryModal">
                        Recipes
                    </button>
                </div>
            </div>
        `;
        dishContainer.appendChild(categoryDiv)
    })
}

const recipeDataLoad = async (strCategory) => {
    const URL = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${strCategory}`;
    
    try{
        const loadRecipes = await fetch(URL);
        const recipeCategory = await loadRecipes.json();
        showCateogryModal(recipeCategory.meals, strCategory);
    } catch (err) {
        return alert(err);
    }
}

const showCateogryModal = (recipes, strCategory) => {
    document.getElementById('recipeHeader').innerText = strCategory;
    const modalContainer = document.getElementById('modal-body');


    recipes.forEach((recipe) => {
        // console.log(recipe);
        const {idMeal, strMeal, strMealThumb} = recipe;
        const singleRecipeDiv = document.createElement('div');
        singleRecipeDiv.classList.add('d-flex', 'flex-column', 'justify-content-center', 'align-items-center', 'gap-2');
        singleRecipeDiv.innerHTML = `
            <img style ="width: 275px; height: 225px;" src="${strMealThumb}" class ="rounded-circle">
            <h4>${strMeal}</h4>
            <button onclick="loadRecipe(${idMeal})" class= "btn btn-primary">Check It Out</button>
        `;
        modalContainer.appendChild(singleRecipeDiv);
    })
}

const loadRecipe = async (idMeal) => {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`;
    try{
        const loadRecipe = await fetch(url);
        const recipeData = await loadRecipe.json();
        getRecipeData(recipeData.meals[0]);
    } catch (err) {
        return alert(err);
    }
}

const getRecipeData = (recipeData) => {
    console.log(recipeData);
    const {strMeal, strCategory, strArea, strInstructions, strMealThumb, strYoutube} = recipeData;
    const elements = [];
    for (const element of Object.keys(recipeData)){
        if(element.startsWith('strIngredient')){
            if(recipeData[element] != ''){
                elements.push(recipeData[element])
            }
        }
    }
    const dishContainer = document.getElementById('dish-container');
    dishContainer.innerHTML = `
        <div class = "container container w-100">
            <img style="height: 500px;" src="${strMealThumb}" class="img-fluid">
            <h3>Recipe: ${strArea} - ${strMeal} </h3>
            
            <h4>Ingredients:</h4>
            <ol id="ingredients-container" class = "row row-cols-3 row-cols-md-4 row-cols-lg-6">
            </ol>
            <p>
                <span>Cooking Instructions:</span>
                ${strInstructions}
            </p>
            <a target="_blank" href="${strYoutube}">Video Tutorial</a>
        </div>
    `;
    const itemsContainer = document.getElementById('ingredients-container');
    elements.forEach((items) => {
        const itemList = document.createElement('li');
        itemList.classList.add('list-style-none');
        itemList.innerText = `${items}`;
        itemsContainer.appendChild(itemList);
    })

    // const modalContainer = document.getElementById('categoryModal');
    // if(modalContainer.classList.contains('show') && modalContainer.style.display === 'block'){
    //     modalContainer.classList.remove('show');
    //     modalContainer.style.display === 'none';
    //     modalContainer.removeAttribute('role');
    //     modalContainer.removeAttribute('aria-modal');
    //     modalContainer.setAttribute('aria-hidden', 'true');
    // }

}
